import ws from 'k6/ws';
import http from 'k6/http';
import { check, sleep } from 'k6';
import { Trend, Rate } from 'k6/metrics';

// Custom metrics for SLO verification
const ttftTrend = new Trend('ai_ttft_ms');
const connectionDropRate = new Rate('connection_drops');

export const options = {
  scenarios: {
    // 1. Spike Traffic: Simulate 10,000 users connecting over 2 minutes
    spike_traffic: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '2m', target: 10000 },
        { duration: '3m', target: 10000 }, // Sustained load
        { duration: '1m', target: 0 },
      ],
      gracefulRampDown: '30s',
    },
    // 2. Deployment Simulation: Constant load to verify zero-downtime
    deployment_sim: {
      executor: 'constant-vus',
      vus: 1000,
      duration: '10m', // Enough time to run a kubectl rollout restart
    }
  },
  thresholds: {
    // TTFT must be <= 2000ms for 95% of requests
    'ai_ttft_ms': ['p(95)<=2000'],
    // Connection drop rate must be < 0.1%
    'connection_drops': ['rate<0.001'],
    // HTTP API errors must be < 1%
    'http_req_failed': ['rate<0.01'],
  },
};

const BASE_URL = __ENV.BASE_URL || 'https://staging.api.hidewin.com';
const WS_URL = __ENV.WS_URL || 'wss://staging.api.hidewin.com/realtime';

export default function () {
  // 1. HTTP Verification (AI TTFT Simulation)
  const res = http.post(`${BASE_URL}/api/v1/ai/generate`, JSON.stringify({ prompt: "hello" }), {
    headers: { 'Content-Type': 'application/json' },
  });
  
  check(res, { 'status is 200': (r) => r.status === 200 });
  if (res.json('ttft_ms')) {
    ttftTrend.add(res.json('ttft_ms'));
  }

  // 2. WebSocket Signaling Connection
  const wsRes = ws.connect(`${WS_URL}/signaling`, function (socket) {
    socket.on('open', () => {
      socket.send(JSON.stringify({ event: 'join_room', room: 'load-test-room' }));
    });
    
    socket.on('message', (msg) => {
      const data = JSON.parse(msg);
      // Process server advisory
      if (data.type === 'server_shutdown') {
        // Pod is gracefully shutting down, client should reconnect
        socket.close();
      }
    });

    socket.on('close', () => {
      connectionDropRate.add(1);
    });

    socket.setTimeout(function () {
      socket.close();
    }, 60000); // Hold connection for 60s
  });

  check(wsRes, { 'websocket connected successfully': (r) => r && r.status === 101 });
  sleep(1);
}

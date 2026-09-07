const WebSocket = require('ws');
const ws = new WebSocket('ws://localhost:8001/ws/transcribe');

ws.on('open', () => {
    console.log('Successfully connected to WebSocket server!');
    ws.close();
});

ws.on('error', (err) => {
    console.error('WebSocket connection failed:', err.message);
});

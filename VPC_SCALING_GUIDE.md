# VPC & KUBERNETES SCALING BLUEPRINT
This document outlines the exact architectural changes required to handle thousands of concurrent sessions across an auto-scaled Cloud VPC without latency.

## 1. The WebRTC Load Balancing Problem (Tightly Coupled State)
**The Issue:** Right now, your `cloud_relay.py` stores active meetings in a local Python dictionary (`channels = {}`). If you put a Load Balancer in front of 5 Cloud Relay servers, the Host PC might connect to Relay Server A, but the Guest might be routed to Relay Server B. Server B won't know the meeting exists, and the connection will fail.

**The Solution:**
* **Immediate Fix (Easy):** Enable **Sticky Sessions (Session Affinity)** on your Load Balancer (like AWS ALB or Nginx). This forces the Load Balancer to always route a specific user to the same server they started on.
* **Enterprise Fix (Hard but required for massive scale):** Implement **Redis Pub/Sub**. When Guest hits Server B, Server B publishes the WebRTC packet to a Redis cluster. Server A hears it, and pushes it down the WebSocket to the Host PC.

## 2. The Database Problem (Tightly Coupled Storage)
**The Issue:** Your `hidewin-fastapi` backend currently uses `SQLite`. SQLite is a local file. If Kubernetes auto-scales your API to 10 instances to handle heavy web traffic, you will end up with 10 different databases, and users will randomly lose their data.

**The Solution:**
* You must switch to a managed Cloud Database like **AWS RDS PostgreSQL**. 
* Update the `DATABASE_URL` in your `.env` file to point to the remote PostgreSQL cluster. SQLAlchemy will automatically connect to it and all 10 API instances will share the same data source.

## 3. WebRTC TURN Servers (The NAT Problem)
**The Issue:** Currently, `setupWebRTC()` in your `invite_client/index.html` relies on Google's free STUN server (`stun:stun.l.google.com:19302`). STUN only works if both the Host and Guest are on open networks. If a Guest joins from a strict corporate office firewall, the video will not connect.

**The Solution:**
* You must deploy a **TURN Server** (like Coturn). A TURN server physically relays the heavy video traffic when peer-to-peer fails.
* You will add your TURN server credentials to the `iceServers` array in your Javascript.

## 4. Kubernetes (k8s) Setup Strategy
When configuring your `Deployment.yaml` for Kubernetes:
1. **API Deployment (`hidewin-fastapi`)**: Set Auto-Scaling (HPA) to scale based on CPU usage. This is stateless and scales infinitely.
2. **Web Deployment (`Hide-Win-Web`)**: Use Nginx pods. This scales infinitely and cheaply.
3. **Relay Deployment (`hidewin-cloud-relay`)**: Do **NOT** auto-scale based on CPU! WebSockets are long-lived connections. Scale based on concurrent active connections, and ensure your Ingress Controller supports WebSocket upgrades and Sticky Sessions.

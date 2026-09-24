# GRACEFUL SHUTDOWN STRATEGY (KUBERNETES)

## The Problem
When a Kubernetes Pod is terminated (e.g., during a rolling update or HPA scale-down), it receives a `SIGTERM` signal. If the application abruptly exits, active HTTP and WebSocket connections are dropped, violating our zero-downtime requirement.

## Implementation Requirements

### 1. PreStop Hook (Kubernetes)
Pods are configured with a `preStop` hook: `sleep 5`. This delays the `SIGTERM` delivery to the application slightly, allowing the AWS ALB target group deregistration to propagate, ensuring no *new* requests are sent to the pod.

### 2. Application Handling (SIGTERM)
When the application (Python/Node.js) receives the `SIGTERM`:
1. **Stop Accepting**: Immediately close the listening server socket (do not accept new connections).
2. **Finish Work**: Allow in-flight HTTP requests to complete.
3. **WebSockets**: Drain active application WebSocket connections and send reconnect guidance where the protocol supports it.
4. **Flush State**: Ensure any pending Redis updates or logs are flushed.
5. **Exit**: Exit cleanly with code `0`.

### 3. Connection Draining
Kubernetes `terminationGracePeriodSeconds` is set to 30s. If the application fails to exit cleanly within 30 seconds, a `SIGKILL` is issued.

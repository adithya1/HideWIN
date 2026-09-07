# CURRENT SECURITY AUDIT

1. **Authentication**: JWT/Session handling needs review. Presence of `bypass_login.py` indicates development shortcuts are present.
2. **Secrets Management**: Missing robust secrets manager (e.g., AWS Secrets Manager).
3. **WebRTC & Signaling**: Lack of strict authorization on signaling channels could allow session hijacking.
4. **Dependencies**: Requires regular auditing via `npm audit` and `pip-audit`.

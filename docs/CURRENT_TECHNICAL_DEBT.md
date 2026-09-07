# CURRENT TECHNICAL DEBT

1. **In-Memory State**: Real-time sessions are stored in memory, preventing horizontal scaling.
2. **Database Engine**: SQLite is unsuitable for high-concurrency production deployments.
3. **Missing Abstractions**: No clean separation between Controllers, Services, and Repositories.
4. **Hardcoded AI Logic**: AI provider SDKs are called directly, making it difficult to implement proper fallback/circuit-breaking.
5. **Lack of CI/CD & Tests**: Minimal automated test coverage for WebRTC and AI streaming components.
6. **Patch Scripts**: The repository contains numerous temporary patch scripts (e.g., `bypass_login.py`).

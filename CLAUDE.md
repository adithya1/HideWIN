# Hide-WIN Engineering Rules

## Mission
Build an enterprise-grade real-time AI platform.

## Architecture
Use Clean Architecture.
Dependency direction:
presentation -> application -> domain
Infrastructure implements domain/application interfaces.

## Never
- put SQL in controllers
- call AI vendors from controllers
- store production state in process memory
- store production secrets in source code
- use SQLite for production
- use global mutable state
- create unbounded queues
- perform blocking I/O inside async request handlers
- bypass authentication in production
- silently swallow exceptions

## AI
All AI providers must implement AIProvider.
The application must not depend directly on Anthropic/Gemini/OpenAI SDKs.

## WebRTC
Signaling and media are separate concerns.
Realtime services must be horizontally scalable.
Do not use process-local dictionaries as authoritative distributed state.

## APIs
Every API must have:
- typed request
- typed response
- authentication
- authorization
- error contract
- timeout
- observability
- complexity documentation

## Testing
No significant behavior change without tests.

## Performance
Never claim a performance target without benchmark evidence.

## Security
Never commit:
- secrets
- API keys
- private keys
- tokens
- credentials

## Code Quality
Use type checking.
Use linting.
Use formatting.
Use tests.
Use dependency scanning.

## Migration
Never perform a giant rewrite.
Migrate incrementally.
After each phase:
- build
- test
- lint
- type check
- integration test
- document

IMPORTANT AI MEMORY POLICY

Do not rely on previous chat sessions.
Do not assume that information from a previous conversation still exists.
The repository is the persistent memory.

Before making decisions, inspect:
- requirements
- architecture
- ADRs
- project memory
- current state
- changelog
- migration log
- Git history

If context is missing, reconstruct it from the repository.
Never guess historical intent.

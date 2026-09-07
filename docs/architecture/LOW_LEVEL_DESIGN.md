# LOW LEVEL DESIGN: AI GATEWAY & REALTIME

## AI Provider Abstraction
```mermaid
classDiagram
    class AIProvider {
        <<interface>>
        +stream_response(request: AIRequest) AsyncIterator~AIChunk~
    }
    class BedrockClaudeProvider {
        +stream_response()
    }
    class GeminiProvider {
        +stream_response()
    }
    class OpenAIProvider {
        +stream_response()
    }
    
    AIProvider <|-- BedrockClaudeProvider
    AIProvider <|-- GeminiProvider
    AIProvider <|-- OpenAIProvider
```

## WebRTC Distributed State (Redis)
- **Key Naming**: `session:{meeting_id}:participants` (Set), `presence:{user_id}` (String/TTL)
- **Pub/Sub**: Channel `meeting:{meeting_id}:events` routes signaling messages across multiple Node.js instances.
- **Eviction Policy**: Volatile-TTL.

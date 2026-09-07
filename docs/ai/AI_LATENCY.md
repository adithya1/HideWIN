# AI LATENCY OPTIMIZATION & SLOs

## Target
The primary objective of the Hide-WIN AI pipeline is to achieve a **Time to First Useful Response of <= 2 seconds** from the moment the user finishes speaking.

## Latency Pipeline Stages (End-to-End)
1. **Capture**: Audio buffer / Screen frame capture (Client)
2. **Preprocessing**: Audio format conversion / Image downscaling (Client/Edge)
3. **VAD (Voice Activity Detection)**: Identifying the end of speech (Client/Worker)
4. **Transcription**: Whisper inference (Worker)
5. **Context Assembly**: Retrieving historical meeting context & RAG (API)
6. **Prompt Construction**: Injecting context into the system prompt (AI Gateway)
7. **Model Request**: Network transmission to AI provider (AI Gateway)
8. **TTFT (Time to First Token)**: Provider processing and first byte return (AI Gateway)
9. **Streaming**: Receiving the remaining payload chunks (AI Gateway)
10. **Client Rendering**: Displaying the chunks on UI (Client)

## Performance SLOs
| Metric | p50 Target | p95 Target | p99 Target |
|--------|------------|------------|------------|
| Transcription Latency | < 300ms | < 600ms | < 1000ms |
| Context Assembly | < 50ms | < 100ms | < 250ms |
| TTFT (Network + AI) | < 700ms | < 1500ms | < 2500ms |
| **First Useful Response** | **<= 2.0s** | **<= 2.5s** | **<= 3.5s** |

## Optimization Strategies Implemented
- **Prompt Caching**: For Bedrock/Anthropic, the system prompt and meeting history are cached to drastically reduce input token processing time.
- **Incremental Transcription**: Audio chunks are transcribed mid-sentence to overlap Whisper latency with user speech time.
- **Parallel Context Retrieval**: RAG/DB lookups execute concurrently with the final VAD silence-detection delay.
- **Bounded Context Windows**: Context is strictly bounded to the last N messages to prevent context-bloat TTFT degradation.

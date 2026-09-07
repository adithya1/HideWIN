# CURRENT PERFORMANCE AUDIT

1. **AI Latency (TTFT)**: Currently bounded by raw network latency to the AI provider. Lacks parallel context retrieval and streaming optimization.
2. **WebRTC Signaling**: Node.js single-thread limits concurrent active signaling sessions to ~1,000-2,000 before event loop lag degrades TTFT. Target is 10,000.
3. **Database Performance**: SQLite locks on concurrent writes, bottlenecking meeting creation under load.
4. **Transcription**: `whisper-server` requires GPU acceleration for sub-second transcription. CPU-bound transcription will introduce latency.

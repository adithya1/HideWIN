import audioop

class VoiceActivityService:
    """
    Maintains state for a single audio stream connection.
    Handles resampling, buffering, and Voice Activity Detection (VAD) via RMS.
    """
    def __init__(
        self, 
        sample_rate_in: int = 24000, 
        sample_rate_out: int = 16000, 
        silence_threshold: int = 500, 
        chunks_to_wait: int = 15, 
        is_groq: bool = False
    ):
        self.sample_rate_in = sample_rate_in
        self.sample_rate_out = sample_rate_out
        self.silence_threshold = silence_threshold
        self.chunks_to_wait = chunks_to_wait
        
        self.resample_state = None
        self.audio_buffer = bytearray()
        self.silence_counter = 0
        self.is_speaking = False
        
        self.last_partial_size = 0
        # Require larger chunks for Groq to avoid spamming the cloud API, 
        # local can handle faster partials (0.5s)
        self.partial_threshold = (16000 * 1.5) if is_groq else (16000 * 0.5)

    def process_chunk(self, data: bytes):
        """
        Processes incoming raw PCM audio bytes.
        Returns a tuple: (partial_bytes, final_bytes)
        - partial_bytes: Bytes to transcribe immediately as a partial (in-progress) sentence.
        - final_bytes: Bytes to transcribe as a final, complete sentence.
        """
        try:
            resampled, self.resample_state = audioop.ratecv(
                data, 2, 1, self.sample_rate_in, self.sample_rate_out, self.resample_state
            )
        except Exception:
            # If invalid bytes occur, return nothing
            return None, None

        rms = audioop.rms(resampled, 2)
        
        partial_bytes = None
        final_bytes = None

        if rms > self.silence_threshold:
            self.is_speaking = True
            self.silence_counter = 0
            self.audio_buffer.extend(resampled)
            
            # Emit partial if threshold reached
            if len(self.audio_buffer) - self.last_partial_size > self.partial_threshold:
                self.last_partial_size = len(self.audio_buffer)
                partial_bytes = bytes(self.audio_buffer)
        else:
            if self.is_speaking:
                self.silence_counter += 1
                self.audio_buffer.extend(resampled)
                
                # If silence has lasted long enough, emit final buffer
                if self.silence_counter > self.chunks_to_wait:
                    # Require at least 0.5 seconds of audio to emit a final chunk
                    if len(self.audio_buffer) > 16000 * 0.5:
                        final_bytes = bytes(self.audio_buffer)
                    
                    # Reset state for next sentence
                    self.audio_buffer.clear()
                    self.is_speaking = False
                    self.last_partial_size = 0
                    self.silence_counter = 0
                    
        return partial_bytes, final_bytes

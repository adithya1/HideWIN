import pytest
import struct
from services.api.services.vad_service import VoiceActivityService

def generate_pcm_chunk(is_silent: bool, length_bytes: int = 4000) -> bytes:
    # Generate 16-bit PCM (2 bytes per sample). 
    # If silent, value is 0. If loud, value is 10000.
    val = 0 if is_silent else 10000
    samples = length_bytes // 2
    return struct.pack('<' + 'h' * samples, *[val]*samples)

def test_vad_ignores_silence():
    vad = VoiceActivityService(sample_rate_in=16000, sample_rate_out=16000, silence_threshold=500)
    silent_chunk = generate_pcm_chunk(is_silent=True)
    
    partial, final = vad.process_chunk(silent_chunk)
    
    assert partial is None
    assert final is None
    assert not vad.is_speaking
    assert len(vad.audio_buffer) == 0

def test_vad_triggers_speaking():
    vad = VoiceActivityService(sample_rate_in=16000, sample_rate_out=16000, silence_threshold=500)
    loud_chunk = generate_pcm_chunk(is_silent=False, length_bytes=2000)
    
    partial, final = vad.process_chunk(loud_chunk)
    
    assert partial is None
    assert final is None
    assert vad.is_speaking
    assert len(vad.audio_buffer) == 2000

def test_vad_emits_partial():
    vad = VoiceActivityService(sample_rate_in=16000, sample_rate_out=16000, silence_threshold=500)
    # Threshold is 16000 * 0.5 = 8000 bytes
    loud_chunk = generate_pcm_chunk(is_silent=False, length_bytes=9000)
    
    partial, final = vad.process_chunk(loud_chunk)
    
    assert partial is not None
    assert len(partial) == 9000
    assert final is None
    assert vad.is_speaking
    assert vad.last_partial_size == 9000

def test_vad_emits_final_after_silence():
    vad = VoiceActivityService(
        sample_rate_in=16000, sample_rate_out=16000, 
        silence_threshold=500, chunks_to_wait=2
    )
    
    # 1. Speak loudly
    loud_chunk = generate_pcm_chunk(is_silent=False, length_bytes=10000)
    partial, final = vad.process_chunk(loud_chunk)
    assert partial is not None
    
    # 2. First silent chunk (silence_counter = 1)
    silent_chunk = generate_pcm_chunk(is_silent=True, length_bytes=2000)
    p, f = vad.process_chunk(silent_chunk)
    assert p is None and f is None
    assert vad.is_speaking
    
    # 3. Second silent chunk (silence_counter = 2)
    p, f = vad.process_chunk(silent_chunk)
    assert p is None and f is None
    
    # 4. Third silent chunk (silence_counter = 3 > chunks_to_wait) -> emits final
    p, f = vad.process_chunk(silent_chunk)
    assert p is None
    assert f is not None
    assert len(f) == 10000 + 2000*3  # total buffered bytes
    
    # Buffer should be cleared
    assert len(vad.audio_buffer) == 0
    assert not vad.is_speaking

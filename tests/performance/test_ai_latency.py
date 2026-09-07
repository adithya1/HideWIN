import time
import pytest
import asyncio
from typing import Dict

async def simulate_pipeline_stage(name: str, p95_latency_ms: int) -> float:
    # Simulate network/processing delay
    delay = p95_latency_ms / 1000.0
    start = time.perf_counter()
    await asyncio.sleep(delay)
    return (time.perf_counter() - start) * 1000

@pytest.mark.asyncio
async def test_ai_latency_pipeline():
    """
    Simulates the end-to-end AI latency pipeline to verify SLO targets.
    This test asserts that the sum of the p95 latency budgets meets the <= 2.5s target.
    """
    metrics: Dict[str, float] = {}
    
    # 1. User stops speaking -> VAD detects silence
    metrics["vad_latency"] = await simulate_pipeline_stage("VAD", 300)
    
    # 2. Transcription (Incremental overlap means we only wait for the final chunk)
    metrics["transcription_latency"] = await simulate_pipeline_stage("Transcription", 400)
    
    # 3. Parallel Context Assembly
    metrics["context_latency"] = await simulate_pipeline_stage("Context", 50)
    
    # 4. Prompt Construction
    metrics["prompt_latency"] = await simulate_pipeline_stage("Prompt", 10)
    
    # 5. Model Routing & Network
    metrics["network_latency"] = await simulate_pipeline_stage("Network", 100)
    
    # 6. Provider TTFT (Assuming prompt caching is active)
    metrics["provider_ttft"] = await simulate_pipeline_stage("TTFT", 1200)
    
    total_latency = sum(metrics.values())
    
    print("\n--- Latency Breakdown ---")
    for k, v in metrics.items():
        print(f"{k}: {v:.1f}ms")
    print(f"Total Time to First Token: {total_latency:.1f}ms")
    
    # Assert against the 2500ms p95 SLO
    assert total_latency <= 2500.0, f"Latency budget exceeded: {total_latency}ms > 2500ms"

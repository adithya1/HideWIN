import re

filepath = r"c:\Users\akula\Downloads\Hide-WIN\hidewin-fastapi\routers\ai_proxy.py"
with open(filepath, "r", encoding="utf-8") as f:
    content = f.read()

# Replace everything from `elif provider == "groq":` up to `else:\n        raise HTTPException`
pattern = r"elif provider == \"groq\":.*?else:\s*raise HTTPException"

replacement = r"""elif provider == "groq":
        async def groq_streamer():
            url = "https://api.groq.com/openai/v1/chat/completions"
            headers = {"Authorization": f"Bearer {key_record.api_key_value}", "Content-Type": "application/json"}
            
            # Convert Gemini format to OpenAI format
            messages = []
            for item in contents:
                role = "assistant" if item.get("role") == "model" else "user"
                text = ""
                for part in item.get("parts", []):
                    if "text" in part:
                        text += part["text"]
                messages.append({"role": role, "content": text})
                
            payload = {"model": model_name, "messages": messages, "stream": True}
            
            async with httpx.AsyncClient() as client:
                async with client.stream('POST', url, headers=headers, json=payload, timeout=60.0) as response:
                    if response.status_code != 200:
                        yield f"data: {{\"error\": \"Groq API Error\"}}\n\n"
                        return
                    
                    async for line in response.aiter_lines():
                        if line.startswith("data: "):
                            data_str = line[6:]
                            if data_str == "[DONE]":
                                break
                            try:
                                import json
                                data_json = json.loads(data_str)
                                chunk_text = data_json["choices"][0]["delta"].get("content", "")
                                if chunk_text:
                                    # Convert OpenAI chunk back to Gemini format for frontend compatibility
                                    import json
                                    fake_gemini_chunk = json.dumps({"candidates": [{"content": {"parts": [{"text": chunk_text}]}}]})
                                    yield "data: " + fake_gemini_chunk + "\n\n"
                            except Exception:
                                pass

        return StreamingResponse(groq_streamer(), media_type="text/event-stream")
    else:
        raise HTTPException"""

content = re.sub(pattern, replacement, content, flags=re.DOTALL)

with open(filepath, "w", encoding="utf-8") as f:
    f.write(content)
print("ai_proxy.py syntax fixed")

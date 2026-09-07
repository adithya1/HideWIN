import re

filepath = r"c:\Users\akula\Downloads\Hide-WIN\hidewin-fastapi\routers\ai_proxy.py"
with open(filepath, "r", encoding="utf-8") as f:
    content = f.read()

# Add groq implementation for /generate
pattern_generate = r"(if provider == \"gemini\":.*?return {\"text\": res\.json\(\)\[\"candidates\"\]\[0\]\[\"content\"\]\[\"parts\"\]\[0\]\[\"text\"\], \"provider\": provider, \"model\": model_name})"
replacement_generate = r"""\1
            elif provider == "groq":
                url = "https://api.groq.com/openai/v1/chat/completions"
                headers = {"Authorization": f"Bearer {key_record.api_key_value}", "Content-Type": "application/json"}
                messages = []
                if system_instruction:
                    messages.append({"role": "system", "content": system_instruction})
                messages.append({"role": "user", "content": prompt})
                payload = {"model": model_name, "messages": messages}
                res = await client.post(url, headers=headers, json=payload, timeout=60.0)
                res.raise_for_status()
                return {"text": res.json()["choices"][0]["message"]["content"], "provider": provider, "model": model_name}"""

content = re.sub(pattern_generate, replacement_generate, content, flags=re.DOTALL)

# Add groq implementation for /stream
pattern_stream = r"(if provider == \"gemini\":.*?return StreamingResponse\(gemini_streamer\(\), media_type=\"text/event-stream\"\))"
replacement_stream = r"""\1
    elif provider == "groq":
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
                        error_text = await response.aread()
                        yield f"data: {{\"error\": \"Groq API Error: {response.status_code} {error_text.decode('utf-8', errors='ignore')}\"}}\n\n"
                        return
                    
                    # Read Server-Sent Events from Groq
                    async for line in response.aiter_lines():
                        if line.startswith("data: "):
                            data_str = line[6:]
                            if data_str == "[DONE]":
                                break
                            try:
                                data_json = json.loads(data_str)
                                chunk_text = data_json["choices"][0]["delta"].get("content", "")
                                if chunk_text:
                                    # Convert OpenAI chunk back to Gemini format for frontend compatibility
                                    fake_gemini_chunk = json.dumps({"candidates": [{"content": {"parts": [{"text": chunk_text}]}}]})
                                    yield f"data: {fake_gemini_chunk}\n\n"
                            except Exception:
                                pass

        return StreamingResponse(groq_streamer(), media_type="text/event-stream")"""

content = re.sub(pattern_stream, replacement_stream, content, flags=re.DOTALL)

with open(filepath, "w", encoding="utf-8") as f:
    f.write(content)
print("ai_proxy.py patched for Groq LLM streaming.")

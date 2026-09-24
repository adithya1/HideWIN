import re

path = r'C:\Users\akula\Downloads\Hide-WIN - Copy\hidewin-fastapi\routers\user.py'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the screenshot_and_analyze block with robust AiProviderKey logic
old_block = """        if event.type == "screenshot_and_analyze":
            import base64
            from io import BytesIO
            from groq import AsyncGroq
            import db_models as models
            
            # 1. Take Screenshot
            img = pyautogui.screenshot()
            
            # Compress and encode
            buffered = BytesIO()
            img.convert("RGB").save(buffered, format="JPEG", quality=50)
            img_str = base64.b64encode(buffered.getvalue()).decode("utf-8")
            
            # 2. Get Groq API Key
            key_record = db.query(models.APIKey).filter(models.APIKey.provider == "groq", models.APIKey.is_active == True).first()
            if not key_record:
                return {"status": "error", "message": "No Groq API key configured in database."}
                
            # 3. Call AI Vision Model
            client = AsyncGroq(api_key=key_record.api_key_value)
            prompt_text = event.prompt if event.prompt else "Analyze this screenshot and explain what is happening on the screen. Be concise and helpful."
            
            response = await client.chat.completions.create(
                model="llama-3.2-11b-vision-preview",
                messages=[
                    {
                        "role": "user",
                        "content": [
                            {"type": "text", "text": prompt_text},
                            {"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{img_str}"}}
                        ]
                    }
                ],
                max_tokens=500
            )
            answer = response.choices[0].message.content
            return {"status": "success", "answer": answer}"""

new_block = """        if event.type == "screenshot_and_analyze":
            import base64
            from io import BytesIO
            import httpx
            import db_models as models
            
            # 1. Take Screenshot
            img = pyautogui.screenshot()
            
            # Compress and encode
            buffered = BytesIO()
            img.convert("RGB").save(buffered, format="JPEG", quality=50)
            img_str = base64.b64encode(buffered.getvalue()).decode("utf-8")
            
            prompt_text = event.prompt if event.prompt else "Analyze this screenshot and explain what is happening on the screen. Be concise."
            
            # 2. Check DB for Gemini or Groq
            answer = "Error: No valid API key found in Admin Dashboard."
            
            gemini_key = db.query(models.AiProviderKey).filter(models.AiProviderKey.provider == "gemini", models.AiProviderKey.is_enabled == True).first()
            groq_key = db.query(models.AiProviderKey).filter(models.AiProviderKey.provider == "groq", models.AiProviderKey.is_enabled == True).first()
            
            async with httpx.AsyncClient() as client:
                if gemini_key:
                    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={gemini_key.api_key_value}"
                    payload = {
                        "contents": [{
                            "parts": [
                                {"text": prompt_text},
                                {"inline_data": {"mime_type": "image/jpeg", "data": img_str}}
                            ]
                        }]
                    }
                    res = await client.post(url, json=payload, timeout=30.0)
                    if res.status_code == 200:
                        answer = res.json().get("candidates", [{}])[0].get("content", {}).get("parts", [{}])[0].get("text", "No answer")
                elif groq_key:
                    url = "https://api.groq.com/openai/v1/chat/completions"
                    headers = {"Authorization": f"Bearer {groq_key.api_key_value}"}
                    payload = {
                        "model": "llama-3.2-11b-vision-preview",
                        "messages": [{
                            "role": "user",
                            "content": [
                                {"type": "text", "text": prompt_text},
                                {"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{img_str}"}}
                            ]
                        }],
                        "max_tokens": 500
                    }
                    res = await client.post(url, headers=headers, json=payload, timeout=30.0)
                    if res.status_code == 200:
                        answer = res.json().get("choices", [{}])[0].get("message", {}).get("content", "No answer")
                        
            return {"status": "success", "answer": answer}"""

if old_block in content:
    content = content.replace(old_block, new_block)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Patched user.py successfully!")
else:
    print("Could not find exact block to replace.")

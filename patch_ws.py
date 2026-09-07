with open(r'C:\Users\akula\Downloads\Hide-WIN\hidewin-fastapi\run_api.py', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix the signaling_join broadcast logic so the host also gets the broadcasts!
old_broadcast = """            # Otherwise broadcast to all
            else:
                for p_ws in list(channels[channel_id]["participants"].values()):
                    try:
                        await p_ws.send_json(msg)
                    except:
                        pass"""
                        
new_broadcast = """            # Otherwise broadcast to all
            else:
                for p_ws in list(channels[channel_id]["participants"].values()):
                    try:
                        await p_ws.send_json(msg)
                    except:
                        pass
                try:
                    await channels[channel_id]["host"].send_json(msg)
                except:
                    pass"""

content = content.replace(old_broadcast, new_broadcast)

with open(r'C:\Users\akula\Downloads\Hide-WIN\hidewin-fastapi\run_api.py', 'w', encoding='utf-8') as f:
    f.write(content)
print("Patched guest broadcast logic in backend")

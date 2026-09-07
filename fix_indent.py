with open(r'C:\Users\akula\Downloads\Hide-WIN\hidewin-fastapi\run_api.py', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if line.strip() == "while True:":
        lines[i] = "        while True:\n"
    elif line.strip() == "data = await websocket.receive_text()":
        lines[i] = "            data = await websocket.receive_text()\n"
    elif line.strip() == "msg = json.loads(data)":
        lines[i] = "            msg = json.loads(data)\n"
    elif line.strip() == "# If msg has a target, send to that specific guest":
        lines[i] = "            # If msg has a target, send to that specific guest\n"
    elif line.strip() == 'if "target" in msg:':
        lines[i] = '            if "target" in msg:\n'
    elif line.strip() == 'target_id = msg["target"]':
        lines[i] = '                target_id = msg["target"]\n'
    elif line.strip() == 'if target_id in channels[channel_id]["guests"]:':
        lines[i] = '                if target_id in channels[channel_id]["guests"]:\n'
    elif line.strip() == 'await channels[channel_id]["guests"][target_id].send_text(data)':
        lines[i] = '                    await channels[channel_id]["guests"][target_id].send_text(data)\n'
    elif line.strip() == 'else:':
        if "guests" in lines[i-1] or "target" in lines[i-1] or "data" in lines[i-1]:
            lines[i] = '            else:\n'
    elif line.strip() == '# broadcast to all':
        lines[i] = '                # broadcast to all\n'
    elif line.strip() == 'for guest_id, guest_ws in channels[channel_id]["guests"].items():':
        lines[i] = '                for guest_id, guest_ws in channels[channel_id]["guests"].items():\n'
    elif line.strip() == 'await guest_ws.send_text(data)':
        lines[i] = '                    await guest_ws.send_text(data)\n'

with open(r'C:\Users\akula\Downloads\Hide-WIN\hidewin-fastapi\run_api.py', 'w', encoding='utf-8') as f:
    f.writelines(lines)

print("Fixed indentation")

import re

audio_path = r"Hide-Win-Master\src\utils\gemini.audio.js"
gemini_path = r"Hide-Win-Master\src\utils\gemini.js"

with open(audio_path, 'r', encoding='utf-8') as f:
    audio_code = f.read()

# Extract functions
append_match = re.search(r'(function appendOralAudioPcm.*?)\nasync function processAccumulatedOralAudio', audio_code, re.DOTALL)
process_match = re.search(r'(async function processAccumulatedOralAudio.*?)\nmodule\.exports =', audio_code, re.DOTALL)

append_code = append_match.group(1)
process_code = process_match.group(1)

# Remove from audioUtils
audio_code = audio_code.replace(append_code, '')
audio_code = audio_code.replace(process_code, '')
audio_code = audio_code.replace(', appendOralAudioPcm, processAccumulatedOralAudio', '')

with open(audio_path, 'w', encoding='utf-8') as f:
    f.write(audio_code)


with open(gemini_path, 'r', encoding='utf-8') as f:
    gemini_code = f.read()

gemini_code = gemini_code.replace(', appendOralAudioPcm, processAccumulatedOralAudio', '')

# Insert functions and variables back
insert_block = f"""
let oralAudioChunks = [];
let totalOralPcmBytes = 0;

{append_code}

{process_code}
"""

gemini_code = gemini_code.replace(
    "// appendOralAudioPcm -> gemini.audio.js\n\n\n// processAccumulatedOralAudio -> gemini.audio.js",
    insert_block
)

with open(gemini_path, 'w', encoding='utf-8') as f:
    f.write(gemini_code)

print("Restored successfully")

with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\utils\renderer.js', 'r', encoding='utf-8') as f:
    content = f.read()

target = """function setupLinuxMicProcessing(micStream) {
    console.log("Replacing continuous chunking with Silero VAD processing...");
    initSileroVAD(micStream);
}"""

replacement = """function setupLinuxMicProcessing(micStream) {
    console.log("Temporarily skipping Silero VAD processing to prevent WASM crashes...");
    // initSileroVAD(micStream);
}"""

content = content.replace(target, replacement)

with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\utils\renderer.js', 'w', encoding='utf-8') as f:
    f.write(content)
print("Disabled VAD to prevent WASM fatal aborts")

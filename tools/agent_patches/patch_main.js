const fs = require('fs');
const path = 'C:\\Users\\akula\\Downloads\\Hide-WIN - Copy\\hidewin-fastapi\\main.py';
let content = fs.readFileSync(path, 'utf8');

const target = 'elif msg["type"] in ["ice_candidate", "candidate"] or msg["type"] == "offer" or msg["type"] == "answer":';
const inject = 'elif msg["type"] in ["ice_candidate", "candidate", "offer", "answer", "ai_answer", "transcript"]:';

content = content.replace(target, inject);
fs.writeFileSync(path, content);
console.log("Patched main.py routing");

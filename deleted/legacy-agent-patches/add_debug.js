const fs = require('fs');
const path = 'C:\\Users\\akula\\Downloads\\Hide-WIN - Copy\\hidewin-fastapi\\main.py';
let content = fs.readFileSync(path, 'utf8');

if (!content.includes('/debug/channels')) {
    const inject = `
@app.get("/debug/channels")
def debug_channels():
    return {"channels": {k: {"token": v["token"], "has_participant": v["participant"] is not None} for k, v in channels.items()}}
`;
    content = content + inject;
    fs.writeFileSync(path, content);
    console.log("Added debug endpoint");
} else {
    console.log("Debug endpoint already exists");
}

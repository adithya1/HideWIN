const fs = require('fs');
const path = require('path');

const configPath = path.join(__dirname, 'services', 'web', 'src', 'config.js');
fs.writeFileSync(configPath, 'export const API_BASE = import.meta.env.VITE_API_URL || \"http://127.0.0.1:8000\";\n');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(function(file) {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) { 
            results = results.concat(walk(file));
        } else if (file.endsWith('.jsx')) {
            results.push(file);
        }
    });
    return results;
}

const files = walk(path.join(__dirname, 'services', 'web', 'src'));
files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    if (content.includes('http://localhost:8000')) {
        let depth = file.split(path.sep).length - path.join(__dirname, 'services', 'web', 'src').split(path.sep).length;
        let relativePath = '../'.repeat(depth) + 'config';
        if (depth === 0) relativePath = './config';
        
        let newContent = content;
        // Basic replacement, using string concat or template literals where appropriate
        // If it's a fetch('http://localhost:8000...')
        newContent = newContent.replace(/'http:\/\/localhost:8000([^']*)'/g, \"API_BASE + ''\");
        newContent = newContent.replace(/\"http:\/\/localhost:8000([^\"]*)\"/g, 'API_BASE + \"\"');
        newContent = newContent.replace(/\http:\/\/localhost:8000([^\]*)\/g, \"\\${API_BASE}\\\");
        
        // Ensure API_BASE is imported at the top
        if (!newContent.includes('import { API_BASE }')) {
            // Find first import
            const firstImportMatch = newContent.match(/^import /m);
            if (firstImportMatch) {
                newContent = newContent.replace(/^import /m, import { API_BASE } from \"\";\nimport );
            } else {
                newContent = import { API_BASE } from \"\";\n + newContent;
            }
        }
        
        fs.writeFileSync(file, newContent);
    }
});

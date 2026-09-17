const fs = require('fs');
const path = require('path');

function checkImports(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const regex = /import\s+.*?from\s+['"](.*?)['"]/g;
    let match;
    while ((match = regex.exec(content)) !== null) {
        const importPath = match[1];
        if (importPath.startsWith('.')) {
            const resolvedPath = path.resolve(path.dirname(filePath), importPath);
            if (!fs.existsSync(resolvedPath)) {
                console.log(`BROKEN IMPORT IN ${filePath}: ${importPath}`);
            }
        }
    }
}

function walkDir(dir) {
    fs.readdirSync(dir).forEach(file => {
        let fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            walkDir(fullPath);
        } else if (fullPath.endsWith('.js')) {
            checkImports(fullPath);
        }
    });
}

walkDir(path.join(__dirname, 'src', 'components'));
console.log("DONE");

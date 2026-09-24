path_code = """
const path = typeof window !== 'undefined' && window.require ? window.require('path') : require('path');
const isBrowser = typeof window !== 'undefined';

let baseDir = '';
if (!isBrowser) {
    baseDir = path.join(__dirname, '..');
} else {
    baseDir = '.';
}

function getAssetPath(subPath) {
    // Return relative or absolute path via path.join
    // For browser views (index.html is in src/), assets is at ./assets
    return path.join(baseDir, 'assets', subPath).replace(/\\\\/g, '/');
}

function getUtilsPath(subPath) {
    return path.join(baseDir, 'utils', subPath).replace(/\\\\/g, '/');
}

function getComponentsPath(subPath) {
    return path.join(baseDir, 'components', subPath).replace(/\\\\/g, '/');
}

module.exports = {
    getAssetPath,
    getUtilsPath,
    getComponentsPath,
    baseDir
};
"""
with open('src/utils/pathManager.js', 'w', encoding='utf-8') as f:
    f.write(path_code)

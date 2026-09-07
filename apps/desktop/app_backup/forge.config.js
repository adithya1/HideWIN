const { FusesPlugin } = require('@electron-forge/plugin-fuses');
const { FuseV1Options, FuseVersion } = require('@electron/fuses');
const JavaScriptObfuscator = require('javascript-obfuscator');
const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
    });
}

module.exports = {
    packagerConfig: {
        asar: {
            unpack: '{**/{onnxruntime-node,onnxruntime-common,@huggingface/transformers,sharp,@img}/**,**/*.exe}',
        },
        extraResource: ['./src/assets/SystemAudioDump'],
        name: 'HideWin',
        executableName: 'HideWin',
        appBundleId: 'com.hidewin.app',
        icon: 'src/assets/images/logo',
        // Win32 file properties
        win32metadata: {
            CompanyName: 'HideWin',
            FileDescription: 'HideWin App',
            OriginalFilename: 'HideWin.exe',
            ProductName: 'HideWin',
            InternalName: 'HideWin',
        },
    },
    hooks: {
        packageAfterPrune: async (config, buildPath) => {
            console.log('Obfuscating source files in: ' + buildPath);
            const srcPath = path.join(buildPath, 'src');
            if (fs.existsSync(srcPath)) {
                walkDir(srcPath, (filePath) => {
                    if (filePath.endsWith('.js') && !filePath.includes('node_modules') && !filePath.includes('assets') && !filePath.includes('components')) {
                        const code = fs.readFileSync(filePath, 'utf8');
                        const obfuscationResult = JavaScriptObfuscator.obfuscate(code, {
                            compact: true,
                            controlFlowFlattening: true,
                            controlFlowFlatteningThreshold: 0.75,
                            deadCodeInjection: true,
                            deadCodeInjectionThreshold: 0.4,
                            debugProtection: false,
                            debugProtectionInterval: 0,
                            disableConsoleOutput: false,
                            identifierNamesGenerator: 'hexadecimal',
                            log: false,
                            numbersToExpressions: true,
                            renameGlobals: false,
                            selfDefending: true,
                            simplify: true,
                            splitStrings: true,
                            splitStringsChunkLength: 10,
                            stringArray: true,
                            stringArrayCallsTransform: true,
                            stringArrayCallsTransformThreshold: 0.5,
                            stringArrayEncoding: ['base64'],
                            stringArrayIndexShift: true,
                            stringArrayRotate: true,
                            stringArrayShuffle: true,
                            stringArrayWrappersCount: 1,
                            stringArrayWrappersChainedCalls: true,
                            stringArrayWrappersParametersMaxCount: 2,
                            stringArrayWrappersType: 'variable',
                            stringArrayThreshold: 0.75,
                            unicodeEscapeSequence: false
                        });
                        fs.writeFileSync(filePath, obfuscationResult.getObfuscatedCode());
                    }
                });
                console.log('Obfuscation complete.');
            }
        }
    },
    rebuildConfig: {},
    makers: [
        {
            name: '@electron-forge/maker-squirrel',
            config: {
                name: 'HideWin',
                productName: 'HideWin',
                shortcutName: 'HideWin',
                createDesktopShortcut: false,
                createStartMenuShortcut: false,
                setupIcon: 'src/assets/images/logo.ico',
                loadingGif: 'src/assets/images/installer-loading.gif',
                noMsi: true,
            },
        },
        {
            name: '@electron-forge/maker-zip',
            platforms: ['win32', 'darwin'],
        },
        {
            name: '@electron-forge/maker-dmg',
            platforms: ['darwin'],
        },
        {
            name: '@reforged/maker-appimage',
            platforms: ['linux'],
            config: {
                options: {
                    name: 'HideWin',
                    productName: 'HideWin Application',
                    genericName: 'System Service',
                    description: 'HideWin Application',
                    categories: ['System'],
                    icon: 'src/assets/logo.png'
                }
            },
        },
    ],
    plugins: [
        {
            name: '@electron-forge/plugin-auto-unpack-natives',
            config: {},
        },
        new FusesPlugin({
            version: FuseVersion.V1,
            [FuseV1Options.RunAsNode]: false,
            [FuseV1Options.EnableCookieEncryption]: true,
            [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
            [FuseV1Options.EnableNodeCliInspectArguments]: false,
            [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
            [FuseV1Options.OnlyLoadAppFromAsar]: true,
        }),
    ],
};

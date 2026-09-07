const { exec } = require('child_process');
const path = require('path');
const os = require('os');
const fs = require('fs');

function convertToPdf(inputPath) {
    return new Promise((resolve, reject) => {
        const ext = path.extname(inputPath).toLowerCase();
        const outputFileName = `converted_${Date.now()}_${path.basename(inputPath, ext)}.pdf`;
        const outputPath = path.join(os.tmpdir(), outputFileName);
        
        let psScript = '';

        if (ext === '.doc' || ext === '.docx') {
            psScript = `
$word = New-Object -ComObject Word.Application
$word.Visible = $false
$word.DisplayAlerts = 0
try {
    $doc = $word.Documents.Open("${inputPath}", $false, $true)
    $doc.SaveAs([ref] "${outputPath}", [ref] 17)
    $doc.Close()
} finally {
    $word.Quit()
    [System.Runtime.Interopservices.Marshal]::ReleaseComObject($word) | Out-Null
}
`;
        } else if (ext === '.ppt' || ext === '.pptx') {
            psScript = `
$ppt = New-Object -ComObject PowerPoint.Application
$ppt.DisplayAlerts = 1
try {
    $pres = $ppt.Presentations.Open("${inputPath}", $true, $false, $false)
    $pres.SaveAs("${outputPath}", 32)
    $pres.Close()
} finally {
    $ppt.Quit()
    [System.Runtime.Interopservices.Marshal]::ReleaseComObject($ppt) | Out-Null
}
`;
        } else if (ext === '.xls' || ext === '.xlsx') {
            psScript = `
$excel = New-Object -ComObject Excel.Application
$excel.Visible = $false
$excel.DisplayAlerts = $false
try {
    $wb = $excel.Workbooks.Open("${inputPath}", 0, $true)
    $wb.ExportAsFixedFormat(0, "${outputPath}")
    $wb.Close($false)
} finally {
    $excel.Quit()
    [System.Runtime.Interopservices.Marshal]::ReleaseComObject($excel) | Out-Null
}
`;
        } else {
            return reject(new Error('Unsupported file type for conversion'));
        }

        // Save the script to a temp ps1 file to execute
        const psFile = path.join(os.tmpdir(), `convert_${Date.now()}.ps1`);
        fs.writeFileSync(psFile, psScript, 'utf8');

        exec(`powershell.exe -ExecutionPolicy Bypass -NoProfile -File "${psFile}"`, (error, stdout, stderr) => {
            try { fs.unlinkSync(psFile); } catch(e) {}
            
            if (error) {
                console.error('PowerShell Conversion Error:', error);
                console.error('stderr:', stderr);
                return reject(error);
            }
            
            if (fs.existsSync(outputPath)) {
                resolve(outputPath);
            } else {
                reject(new Error('Conversion failed, output file not found'));
            }
        });
    });
}

module.exports = { convertToPdf };

const fs=require('fs');
const c=fs.readFileSync('src/utils/window.js','utf8');
let line=1;
for(let i=0;i<c.length;i++){
    if(c[i]==='\n') line++;
    if(c[i]==='`') console.log('Backtick at line '+line);
}

const fs=require('fs');
const c=fs.readFileSync('src/utils/window.js','utf8');
let s=0, d=0, b=0;
for(let i=0;i<c.length;i++){
    if(c[i]==='\'') s++;
    if(c[i]==='\"') d++;
    if(c[i]==='`') b++;
}
console.log('single', s, 'double', d, 'backtick', b);

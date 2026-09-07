const { app } = require('electron');
app.whenReady().then(() => {
    const fs = require('fs');
    fs.writeFileSync('desktop_path.txt', app.getPath('desktop'));
    app.quit();
});

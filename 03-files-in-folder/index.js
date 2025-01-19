const fs = require('fs');
const path = require('path');

const secretFolder = path.join(__dirname, 'secret-folder');

// Читаємо вміст папки
fs.readdir(secretFolder, { withFileTypes: true }, (err, entries) => {
  if (err) {
    console.error(err);
    return;
  }

  entries.forEach((entry) => {
    if (entry.isFile()) {
      const filePath = path.join(secretFolder, entry.name);

      fs.stat(filePath, (err, stats) => {
        if (err) {
          console.error(err);
          return;
        }

        const fileName = path.parse(entry.name).name;
        const fileExtension = path.extname(entry.name).slice(1);
        const fileSizeKB = (stats.size / 1024).toFixed(2);
        const fileSizeB = stats.size;

        console.log(`${fileName} - ${fileExtension} - ${fileSizeKB}kb - ${fileSizeB}b`);
      });
    }
  });
});

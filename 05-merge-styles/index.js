const fs = require('fs');
const path = require('path');

const stylesDir = path.join(__dirname, 'styles');
const outputDir = path.join(__dirname, 'project-dist');
const outputFile = path.join(outputDir, 'bundle.css');

fs.mkdir(outputDir, { recursive: true }, (err) => {
  if (err) return;  

  fs.writeFile(outputFile, '', (err) => {
    if (err) return;

    fs.readdir(stylesDir, { withFileTypes: true }, (err, files) => {
      if (err) return;

      const cssFiles = files.filter(file => file.isFile() && path.extname(file.name) === '.css');

      if (cssFiles.length === 0) {
        return;
      }

      cssFiles.forEach((file, index) => {
        const filePath = path.join(stylesDir, file.name);

        fs.readFile(filePath, 'utf8', (err, data) => {
          if (err) return;

          fs.appendFile(outputFile, data + '\n', (err) => {
            if (err) return;
          });
        });
      });
    });
  });
});

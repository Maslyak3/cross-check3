const fs = require('fs');
const path = require('path');

const projectDist = path.join(__dirname, 'project-dist');
const componentsDir = path.join(__dirname, 'components');
const stylesDir = path.join(__dirname, 'styles');
const assetsDir = path.join(__dirname, 'assets');
const outputHtml = path.join(projectDist, 'index.html');
const outputCss = path.join(projectDist, 'style.css');
const outputAssets = path.join(projectDist, 'assets');
const templateFile = path.join(__dirname, 'template.html');

fs.mkdir(projectDist, { recursive: true }, (err) => {
  if (err) return;

  buildHtml();
  mergeStyles();
  cleanDirectory(outputAssets)
    .then(() => copyAssets(assetsDir, outputAssets))
    .catch(() => {});
});

function cleanDirectory(dirPath) {
  return new Promise((resolve, reject) => {
    fs.rm(dirPath, { recursive: true, force: true }, (err) => {
      if (err) reject(err);
      else {
        fs.mkdir(dirPath, { recursive: true }, (err) => {
          if (err) reject(err);
          else resolve();
        });
      }
    });
  });
}

function buildHtml() {
  fs.readFile(templateFile, 'utf8', (err, template) => {
    if (err) return;

    const tags = template.match(/{{\s*\w+\s*}}/g) || [];
    let processedTemplate = template;

    const processTags = tags.map((tag) => {
      const componentName = tag.replace(/{{\s*|\s*}}/g, '');
      const componentFile = path.join(componentsDir, `${componentName}.html`);

      return new Promise((resolve) => {
        fs.readFile(componentFile, 'utf8', (err, content) => {
          if (err) resolve('');
          else {
            processedTemplate = processedTemplate.replace(new RegExp(tag, 'g'), content);
            resolve();
          }
        });
      });
    });

    Promise.all(processTags).then(() => {
      fs.writeFile(outputHtml, processedTemplate, () => {});
    });
  });
}

function mergeStyles() {
    fs.readdir(stylesDir, { withFileTypes: true }, (err, files) => {
      if (err) return;
  
      const cssFiles = files
        .filter(file => file.isFile() && path.extname(file.name) === '.css')
        .map(file => path.join(stylesDir, file.name));
  
      const readPromises = cssFiles.map(filePath =>
        new Promise((resolve, reject) => {
          fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) reject(err);
            else resolve(data);
          });
        })
      );
  
      Promise.all(readPromises)
        .then(contents => {
          const mergedStyles = contents.join('\n');
          fs.writeFile(outputCss, mergedStyles, () => {});
        })
        .catch(() => {});
    });
  }

function copyAssets(src, dest) {
  fs.mkdir(dest, { recursive: true }, (err) => {
    if (err) return;

    fs.readdir(src, { withFileTypes: true }, (err, files) => {
      if (err) return;

      files.forEach((file) => {
        const srcPath = path.join(src, file.name);
        const destPath = path.join(dest, file.name);

        if (file.isDirectory()) {
          copyAssets(srcPath, destPath);
        } else {
          fs.copyFile(srcPath, destPath, () => {});
        }
      });
    });
  });
}

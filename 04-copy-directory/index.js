const fs = require('fs');
const path = require('path');

const sourceDir = path.join(__dirname, 'files');
const targetDir = path.join(__dirname, 'files-copy');

function copyDir() {
  fs.stat(targetDir, function (err, stats) {
    if (!err && stats.isDirectory()) {
      fs.rm(targetDir, { recursive: true }, function () {
        createTargetDir();
      });
    } else {
      createTargetDir();
    }
  });
}

function createTargetDir() {
  fs.mkdir(targetDir, { recursive: true }, function (err) {
    if (err) return;

    fs.readdir(sourceDir, function (err, files) {
      if (err) return;

      files.forEach(function (file) {
        const sourcePath = path.join(sourceDir, file);
        const targetPath = path.join(targetDir, file);

        fs.stat(sourcePath, function (err, stats) {
          if (err) return;

          if (stats.isFile()) {
            fs.copyFile(sourcePath, targetPath, function (err) {});
          } else if (stats.isDirectory()) {
            copyDirRecursive(sourcePath, targetPath);
          }
        });
      });
    });
  });
}

function copyDirRecursive(sourceDir, targetDir) {
  fs.stat(targetDir, function (err) {
    if (err) {
      fs.mkdir(targetDir, { recursive: true }, function (err) {
        if (err) return;

        fs.readdir(sourceDir, function (err, files) {
          if (err) return;

          files.forEach(function (file) {
            const sourcePath = path.join(sourceDir, file);
            const targetPath = path.join(targetDir, file);

            fs.stat(sourcePath, function (err, stats) {
              if (err) return;

              if (stats.isFile()) {
                fs.copyFile(sourcePath, targetPath, function (err) {});
              } else if (stats.isDirectory()) {
                copyDirRecursive(sourcePath, targetPath);
              }
            });
          });
        });
      });
    } else {
      fs.readdir(sourceDir, function (err, files) {
        if (err) return;

        files.forEach(function (file) {
          const sourcePath = path.join(sourceDir, file);
          const targetPath = path.join(targetDir, file);

          fs.stat(sourcePath, function (err, stats) {
            if (err) return;

            if (stats.isFile()) {
              fs.copyFile(sourcePath, targetPath, function (err) {});
            } else if (stats.isDirectory()) {
              copyDirRecursive(sourcePath, targetPath);
            }
          });
        });
      });
    }
  });
}

copyDir();

const fs = require("fs");
const path = require("path");
const copyFolder = path.join(__dirname, "files-copy");
const originFolder = path.join(__dirname, "files");

function copyDirectory() {
  fs.promises
    .access(copyFolder)
    .catch(() => fs.promises.mkdir(copyFolder))
    .then(() => fs.promises.readdir(copyFolder))
    .then((files) => {
      for (file of files) {
        const interCopyFolder = path.join(copyFolder, file);
        fs.stat(interCopyFolder, (err, stats) => {
          if (err) {
            console.log(err);
            return;
          }
          if (stats.isFile()) {
            fs.unlink(interCopyFolder, (err) => {
              if (err) {
                throw err;
              }
              console.log(`файл ${interCopyFolder} удален`);
            });
          }
        });
      }
    })
    .then(() => fs.promises.readdir(originFolder))
    .then((files) => {
      for (file of files) {
        let originFile = path.join(originFolder, file);
        let copyFile = path.join(copyFolder, file);

        fs.copyFile(originFile, copyFile, (err) => {
          if (err) {
            console.error(err);
          } else {
            console.log(`Файл ${file} успешно скопирован в ${copyFile}!`);
          }
        });
      }
    })
}

copyDirectory();
const path = require("path");
const fs = require("fs/promises");
const projectFolder = path.join(__dirname, "project-dist");
const copyFolder = path.join(__dirname, "project-dist", "assets");
const originFolder = path.join(__dirname, "assets");


async function deleteFolder() {
  try {
    await fs.access(projectFolder);
  } catch {
    await fs.mkdir(projectFolder);
  }

  const files = await fs.readdir(projectFolder);
  const unlinkPromises = files.map((file) => {
    const interProjectFolder = path.join(projectFolder, file);
    return fs.unlink(interProjectFolder);
  });

  await Promise.all(unlinkPromises);
}

function createFiles() {
   return Promise.all([
     fs.writeFile(path.join(projectFolder, "style.css"), ""),
     fs.writeFile(path.join(projectFolder, "index.html"), ""),
   ]);
}

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
          }
        });
      }
    });
}

deleteFolder()
  .then(createFiles)
  .then(() => console.log("Done"))
  .catch((err) => console.error(err));

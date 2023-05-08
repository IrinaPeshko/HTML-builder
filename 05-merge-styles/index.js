const path = require("path");
const fs = require("fs");
const styles  = path.join(__dirname, 'styles');
const resultArr = [];


fs.promises
  .writeFile(path.join(__dirname, "project-dist", "bundle.css"), "")
  .then(() => fs.promises.readdir(styles))
  .then((files) => {
    const promises = [];
    for (file of files) {
      const stylesFiles = path.join(styles, file);
      const promise = new Promise((resolve, reject) => {
        fs.stat(stylesFiles, (err, stats) => {
          if (err) {
            reject(err);
          } else if (stats.isFile() & (path.extname(stylesFiles) === ".css")) {
            const readableStream = fs.createReadStream(stylesFiles);
            let data = "";
            readableStream.on("data", (chunk) => {
              data += chunk;
            });
            readableStream.on("end", () => {
              resolve(data);
            });
          } else {
            resolve();
          }
        });
      });
      promises.push(promise);
    }
    return Promise.all(promises);
  })
  .then((dataArr) => {
    dataArr.forEach((data) => {
      if (data) {
        resultArr.push(data); 
      }
    });
    fs.appendFile(path.join(path.join(__dirname, "project-dist", "bundle.css")), `${resultArr.join('\n')}\n`, (err) => {
      if (err) throw err;
    });
  })
  .catch((err) => console.error(err));
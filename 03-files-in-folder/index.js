const fs = require('fs');
const path = require('path')
const secretFolder = path.join(__dirname, 'secret-folder')
fs.readdir(secretFolder, (err, files)=>{
  if (err) {
    console.error(err);
    return;
  }
  for(file of files){
    let fileWay = path.join(secretFolder, file);
    fs.stat(fileWay, (err, stats) => {
      if (err) {
        console.error(err);
        return;
      }
      if (stats.isFile()) {
        const result = [];
        let lastDotIndex = path.basename(fileWay).lastIndexOf(".");
        result.push(path.basename(fileWay).slice(0, lastDotIndex));
        result.push(path.extname(fileWay).slice(1));
        result.push(`${stats.size}b`)
        console.log(result.join(' - '));
      }
    });
    }
  });
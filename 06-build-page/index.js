const path = require("path");
const fsPromises = require("fs/promises");
const fs = require("fs");
const projectFolder = path.join(__dirname, "project-dist");
const copyFolder = path.join(__dirname, "project-dist", "assets");
const originFolder = path.join(__dirname, "assets");
const originHTML = path.join(__dirname, "template.html");
const copyHTML = path.join(__dirname, "project-dist", "index.html");
const componentsHTML = path.join(__dirname, "components");
const styles = path.join(__dirname, "styles");

async function deleteFolder() {
  // создаем папку если она еще не создана
  try {
    await fsPromises.access(projectFolder);
  } catch {
    await fsPromises.mkdir(projectFolder);
  }

  // удаляем каждый файл
  const files = await fsPromises.readdir(projectFolder);
  const unlinkPromises = files.map((file) => {
    const interProjectFolder = path.join(projectFolder, file);
    return fsPromises.rm(interProjectFolder, { recursive: true });
  });

  await Promise.all(unlinkPromises);
}

// создаем пустые файлы
function createFiles() {
  return Promise.all([
    fsPromises.writeFile(path.join(projectFolder, "style.css"), ""),
    fsPromises.writeFile(path.join(projectFolder, "index.html"), ""),
  ]);
}

async function copyDirectory(originFolder, copyFolder) {
  // Создаем папку назначения, если она еще не создана
  await fsPromises.mkdir(copyFolder, { recursive: true });

  // Получаем список файлов и папок в директории
  const files = await fsPromises.readdir(originFolder);

  // Рекурсивно копируем каждый файл и папку
  for (const file of files) {
    const srcPath = path.join(originFolder, file);
    const destPath = path.join(copyFolder, file);

    const stat = await fsPromises.stat(srcPath);

    if (stat.isDirectory()) {
      await copyDirectory(srcPath, destPath);
    } else {
      await fsPromises.copyFile(srcPath, destPath);
    }
  }
}

async function createHTML() {
  try {
    let template = await fsPromises.readFile(originHTML, "utf8");

    const regex = /\{\{(\w+)\}\}/g;
    let match;

    // Создаем массив Promise, чтобы асинхронно читать содержимое каждого компонента.
    while ((match = regex.exec(template)) !== null) {
      const fileName = match[1];
      const componentPath = path.join(componentsHTML, `${fileName}.html`);
      fsPromises.readFile(componentPath, {
        encoding: "utf8",
      }).then(file =>{
       fileName
       file

        fs.readdir(componentsHTML, (err, files) => {
          if (err) {
            console.error(err);
            return;
          }
            const componentName = `{{${fileName}}}`;
            template = template.replace(componentName, file);

          // Сохраняем полученный HTML в файл `project-dist/index.html`.
          fsPromises.writeFile(copyHTML, template, { encoding: "utf8" });
        });
      });
    }
  } catch (err) {
    console.error(err);
  }
}

function createCss() {
  const resultArr = [];
  return fsPromises
    .readdir(styles, "utf8")
    .then((files) => {
      const promises = [];
      for (file of files) {
        const stylesFiles = path.join(styles, file);
        const promise = new Promise((resolve, reject) => {
          if (path.extname(stylesFiles) === ".css") {
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
      fs.appendFile(
        path.join(path.join(__dirname, "project-dist", "style.css")),
        `${resultArr.join("\n")}\n`,
        (err) => {
          if (err) throw err;
        }
      );
    })
    .catch((err) => console.error(err));
}

deleteFolder()
  .then(createFiles)
  .then(() => copyDirectory(originFolder, copyFolder))
  .then(() => createHTML())
  .then(() => createCss())
  .then(() => console.log("task completed"))
  .catch((err) => console.error(err));

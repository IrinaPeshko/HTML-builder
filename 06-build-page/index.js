const path = require("path");
const fs = require("fs/promises");
const projectFolder = path.join(__dirname, "project-dist");
const copyFolder = path.join(__dirname, "project-dist", "assets");
const originFolder = path.join(__dirname, "assets");
const originHTML = path.join(__dirname, "template.HTML");

async function deleteFolder() {
  // создаем папку если она еще не создана
  try {
    await fs.access(projectFolder);
  } catch {
    await fs.mkdir(projectFolder);
  }

  // удаляем каждый файл
  const files = await fs.readdir(projectFolder);
  const unlinkPromises = files.map((file) => {
    const interProjectFolder = path.join(projectFolder, file);
    return fs.rm(interProjectFolder, { recursive: true });
  });

  await Promise.all(unlinkPromises);
}

// создаем пустые файлы
function createFiles() {
  return Promise.all([
    fs.writeFile(path.join(projectFolder, "style.css"), ""),
    fs.writeFile(path.join(projectFolder, "index.html"), ""),
  ]);
}

async function copyDirectory(originFolder, copyFolder) {
  // Создаем папку назначения, если она еще не создана
  await fs.mkdir(copyFolder, { recursive: true });

  // Получаем список файлов и папок в директории
  const files = await fs.readdir(originFolder);

  // Рекурсивно копируем каждый файл и папку
  for (const file of files) {
    const srcPath = path.join(originFolder, file);
    const destPath = path.join(copyFolder, file);

    const stat = await fs.stat(srcPath);

    if (stat.isDirectory()) {
      await copyDirectory(srcPath, destPath);
    } else {
      await fs.copyFile(srcPath, destPath);
    }
  }
}


function createHTML (){
  console.log(originHTML);
  const readableStream = fs.createReadStream(txt, "utf-8");
}

deleteFolder()
  .then(createFiles)
  .then(()=>copyDirectory(originFolder, copyFolder))
  // .then(createHTML)
  .then(() => console.log("Done"))
  .catch((err) => console.error(err));

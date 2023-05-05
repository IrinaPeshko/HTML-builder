const path = require('path');
const fs = require("fs");
const { stdout } = process;
const txt = path.join(__dirname, 'text.txt');
const readableStream = fs.createReadStream(txt, 'utf-8')
let data = ''
readableStream.on('data', chunk => data+=chunk)
readableStream.on("end", () => stdout.write(data));
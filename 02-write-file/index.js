const { stdin, stdout } = process;
const path = require("path");
const fs = require("fs");
const readline = require("readline");
const rl = readline.createInterface({
  input: stdin,
  output: stdout,
});
stdout.write("Привет, студент RS School, введи текстовое сообщение: \n");
fs.writeFile(path.join(__dirname, "text.txt"), "", (err) => {
  if (err) throw err;
});

rl.on('SIGINT', ()=>{
  stdout.write("Спасибо за внимание, удачи тебе!");
  rl.close();
})
rl.on("line", (input) => {
  if (input == 'exit'){
    stdout.write("Спасибо за внимание, удачи тебе!");
    rl.close();
  } else {
    fs.appendFile(path.join(__dirname, "text.txt"), `${input}\n`, (err) => {
      if (err) throw err;
    });
  } 
});

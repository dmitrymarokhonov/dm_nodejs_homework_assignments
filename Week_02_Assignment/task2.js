const fs = require('fs');
const path = require('path');

if (process.argv.length < 4) {
  console.log(
    'Not sufficient amount of parameters, insert at least input and output paths'
  );
  process.exit();
}

const sources = process.argv.slice(2);
const destination = sources.pop();

const readDir = dir => {
  return new Promise((resolve, reject) => {
    try {
      const files = fs.readdirSync(dir);
      files.forEach(item => {
        let itemFullPath = path.join(dir, item);
        if (fs.lstatSync(itemFullPath).isDirectory()) {
          readDir(itemFullPath);
        } else {
          const fileName = path.basename(itemFullPath);
          const firstLetter = fileName.trim().charAt(0);
          const destPath = path.join(__dirname, destination);
          const letterSubFolder = path.join(destPath, firstLetter);

          if (!fs.existsSync(destPath)) {
            fs.mkdirSync(destPath);
          }
          if (!fs.existsSync(letterSubFolder)) {
            fs.mkdirSync(letterSubFolder);
          }
          fs.copyFileSync(itemFullPath, path.join(letterSubFolder, fileName));
          console.log(`${firstLetter}\t ${itemFullPath}`);
        }
      });
      resolve('source ' + dir + ' - distributed succesfully!');
    } catch (err) {
      reject(err);
    }
  });
};

sources.forEach(s => {
  readDir(s)
    .then(res => console.log(res))
    .catch(err => console.log(err));
});

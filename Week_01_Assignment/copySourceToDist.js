const fs = require('fs');
const path = require('path');

const sources = [];
let fileList = [];

// Collect this folder valid subdirectories with absolute path to 'source'-array
process.argv.forEach((sourceName, index, array) => {
  if (array.length === 2 && index === 1) {
    const defaultPath = path.join(__dirname, 'source/');
    return (
      fs.existsSync(defaultPath) &&
      fs.lstatSync(defaultPath).isDirectory() &&
      sources.push(defaultPath)
    );
  }
  if (index > 1) {
    const fullSourcePath = path.join(__dirname, sourceName);
    fs.existsSync(fullSourcePath) &&
      fs.lstatSync(fullSourcePath).isDirectory() &&
      sources.push(fullSourcePath);
  }
});
console.log('SourcesArray');
sources.forEach(s => console.log(`${sources.indexOf(s)}: ${s}`));

// Scan and collect to 'fileList' recursively each file in given directory
const readDir = dir => {
  const files = fs.readdirSync(dir);
  files.forEach(item => {
    let itemFullPath = path.join(dir, item);
    if (fs.lstatSync(itemFullPath).isDirectory()) {
      readDir(itemFullPath);
    } else {
      fileList = [...fileList, itemFullPath];
    }
  });
};

sources.forEach(dir => {
  readDir(dir);
});
// Create 'Dist' folder in current directory and as Dist subdirectories first character of each filename in 'fileList' + copy file to corresponding letter-folder
fileList.forEach(fullPath => {
  const fileName = path.basename(fullPath);
  const firstLetter = fileName.trim().charAt(0);
  const destPath = path.join(__dirname, 'Dist/');
  const letterSubFolder = path.join(destPath, firstLetter);

  if (!fs.existsSync(destPath)) {
    fs.mkdirSync(destPath);
  }
  if (!fs.existsSync(letterSubFolder)) {
    fs.mkdirSync(letterSubFolder);
  }
  fs.copyFileSync(fullPath, path.join(letterSubFolder, fileName));

  console.log(`${firstLetter}\t ${fullPath}`);
});

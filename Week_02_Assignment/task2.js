const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const asyncCopyFile = promisify(fs.copyFile);
const asyncExists = promisify(fs.exists);
const asyncMkdir = promisify(fs.mkdir);

if (process.argv.length < 4) {
  console.log(
    'Not sufficient amount of parameters, insert at least input and output paths'
  );
  process.exit();
}

const sources = process.argv.slice(2);
const destination = sources.pop();

function asyncReadDir(path) {
  return new Promise((resolve, reject) => {
    fs.readdir(path, function(err, data) {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}

function asyncLstatIsDirectory(path) {
  return new Promise((resolve, reject) => {
    fs.lstat(path, function(err, stats) {
      if (err) {
        reject(err);
      } else {
        resolve(stats.isDirectory());
      }
    });
  });
}

const readDir = async dir => {
  const files = await asyncReadDir(dir);
  files.forEach(async item => {
    let itemFullPath = path.join(dir, item);
    const pathIsDirectory = await asyncLstatIsDirectory(itemFullPath);
    if (pathIsDirectory) {
      readDir(itemFullPath);
    } else {
      const fileName = path.basename(itemFullPath);
      const firstLetter = fileName.trim().charAt(0);
      const destPath = path.join(__dirname, destination);
      const letterSubFolder = path.join(destPath, firstLetter);

      const destExists = await asyncExists(destPath);
      const letterSubFolderExists = await asyncExists(letterSubFolder);

      if (!destExists) {
        await asyncMkdir(destPath);
      }
      if (!letterSubFolderExists) {
        await asyncMkdir(letterSubFolder);
      }

      await asyncCopyFile(itemFullPath, path.join(letterSubFolder, fileName));
      console.log(`${firstLetter}\t ${itemFullPath}`);
    }
  });
};

sources.forEach(async s => {
  (await asyncLstatIsDirectory(s)) && readDir(s);
});

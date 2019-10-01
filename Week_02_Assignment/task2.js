const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const asyncCopyFile = promisify(fs.copyFile);
const asyncExists = promisify(fs.exists);
const asyncMkdir = promisify(fs.mkdir);
const asyncReaddir1 = promisify(fs.readdir);
const asyncLstat = promisify(fs.lstat);

if (process.argv.length < 4) {
  console.log(
    'Not sufficient amount of parameters, insert at least input and output paths'
  );
  process.exit();
}

const sources = process.argv.slice(2);
const destination = path.join(__dirname, sources.pop());

const checkIfExistsMakeNew = async path => {
  try {
    const pathExists = await asyncExists(path);
    if (!pathExists) {
      await asyncMkdir(path);
    }
  } catch (err) {
    console.log(err);
  }
};

const readDir = async dir => {
  const files = await asyncReaddir1(dir);

  files.forEach(async item => {
    let itemFullPath = path.join(dir, item);
    const lstatPath = await asyncLstat(itemFullPath);
    if (lstatPath.isDirectory()) {
      readDir(itemFullPath);
    } else {
      const fileName = path.basename(itemFullPath);
      const firstLetter = fileName.trim().charAt(0);
      const letterSubFolder = path.join(destination, firstLetter);
      const letterSubFolderExists = await asyncExists(letterSubFolder);

      if (!letterSubFolderExists) {
        await asyncMkdir(letterSubFolder);
      }

      await asyncCopyFile(itemFullPath, path.join(letterSubFolder, fileName));
      console.log(`${firstLetter}\t ${itemFullPath}`);
    }
  });
};

checkIfExistsMakeNew(destination);
sources.forEach(async s => {
  const path = await asyncLstat(s);
  path.isDirectory() && readDir(s);
});

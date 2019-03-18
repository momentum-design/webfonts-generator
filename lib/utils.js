const fs = require("fs");
const glob = require("glob");
const path = require("path");
const util = require("util");

const extractName = file => {
  return path.basename(file, path.extname(file));
};

// http://en.wikipedia.org/wiki/Private_Use_(Unicode)
const startCodepoint = 0xf101;
let currentCodepoint = startCodepoint;
const getNextCodepoint = () => {
  const res = currentCodepoint;
  currentCodepoint++;
  return res;
};

const globP = pattern => {
  return new Promise((resolve, reject) => {
    glob(pattern, (err, files) => {
      if (err) return reject(err);
      resolve(files);
    });
  });
};

const mkdirP = path => {
  return new Promise((resolve, reject) => {
    fs.mkdir(path, { recursive: true }, err => {
      if (err) reject(err);
      resolve();
    });
  });
};

const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

module.exports = {
  extractName,
  getNextCodepoint,
  glob: globP,
  mkdir: mkdirP,
  readFile,
  writeFile
};

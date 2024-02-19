const fs = require('fs');
const path = require('path');

function guidMapper(filePath) {
  this.filePath = filePath;
  this.data = this.loadFromFile();
}

guidMapper.prototype.loadFromFile = function () {
  try {
    const rawData = fs.readFileSync(this.filePath, 'utf8');
    return JSON.parse(rawData);
  } catch (error) {
    // If file doesn't exist or there's an error parsing it, initialize with an empty object.
    return {};
  }
};

guidMapper.prototype.writeFileSync = function () {
  const jsonData = JSON.stringify(this.data, null, 2);
  fs.writeFileSync(this.filePath, jsonData, 'utf8');
};

guidMapper.prototype.addEntry = function (guid, path, name) {
  if(!!guid && !! path && !!name){
    this.data[guid] = { path: path, name: name };
  }
};

guidMapper.prototype.removeEntry = function (guid) {
  if (this.data[guid]) {
    delete this.data[guid];
  } 
};

guidMapper.prototype.getEntries = function () {
  return this.data;
};

guidMapper.prototype.findEntryGuid = function (name, path) {
  for (const guid in this.data) {
    if (this.data.hasOwnProperty(guid)) {
      const entry = this.data[guid];
      if (entry.path === path && entry.name === name) {
        return guid;
      }
    }
  }
  return null;
};

module.exports = guidMapper;
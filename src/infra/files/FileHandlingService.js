const editJsonFile = require('edit-json-file');

module.exports = {


  setToJsonFile(file, key, data) {
    let File = editJsonFile(file);
    File.set(key, data);
    File.save();
  },


  readFromJson(file, key) {
    let File = editJsonFile(file);
    return File.get(key);
  }


};

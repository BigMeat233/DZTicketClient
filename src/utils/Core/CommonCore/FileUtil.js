/**
 * 文件操作工具
 *
 * Made By Douzi＂
 */

var fs = require('fs');

function FileUtil() {
  this.readFile = _readFile;
  this.writeFile = _writeFile;
  this.writeFileSync = _writeFileSync;
  this.readFileSync = _readFileSync;

  function _readFileSync(filePath) {
    try {
      var result = fs.readFileSync(filePath, 'utf-8');
      return result;
    } catch (e) {
      return null;
    }
  }

  function _writeFileSync(filePath, msg) {
    try {
      fs.writeFileSync(filePath, msg, 'utf-8');
      return true;
    } catch (e) {
      return false;
    }
  }

  function _readFile(filePath, callBack) {
    fs.readFile(filePath, 'utf-8', function(err, data) {
      if (err) {
        callBack(null);
      } else {
        callBack(data);
      }
    });
  }

  function _writeFile(filePath, msg, callBack) {
    fs.writeFile(filePath, msg, 'utf-8', function(err) {
      if (err) {
        callBack(false);
      } else {
        callBack(true);
      }
    });
  }
}

var instance = new FileUtil();
export default instance;
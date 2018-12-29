/**
 * 状态控制核心
 *
 * Made By Douzi＂
 */

function StateCore() {
  var _objectMap = {};

  this.setItem = _setItem;
  this.getItem = _getItem;
  this.getAll = _getAll;
  this.removeItem = _removeItem;
  this.removeAll = _removeAll;

  function _setItem(key, value) {
    _objectMap[key] = value;
  }

  function _getItem(key) {
    return _objectMap[key];
  }

  function _getAll() {
    return _objectMap;
  }

  function _removeItem(key) {
    delete _objectMap[key];
  }

  function _removeAll() {
    _objectMap = {};
  }
}

var instance = new StateCore();
export default instance;
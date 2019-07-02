/**
 * 持久化核心
 *
 * Made By Douzi＂
 */
function LocalCore() {
  this.setItem = _setItem;
  this.getItem = _getItem;
  this.removeItem = _removeItem;
  this.removeAll = _removeAll;

  function _setItem(key, value) {
    localStorage.setItem(key, value);
  }

  function _getItem(key) {
    return localStorage.getItem(key);
  }

  function _removeItem(key) {
    localStorage.removeItem(key);
  }

  function _removeAll() {
    localStorage.clear();
  }
}

var instance = new LocalCore();
export default instance;
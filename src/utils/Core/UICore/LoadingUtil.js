/**
 * 菊花组件
 *
 * Made By Douzi＂
 */

import { Loading } from 'element-ui';

function LoadingUtil() {
  var _loading = null;

  this.show = _show;
  this.close = _close;

  function _show() {
    _loading = Loading.service();
  }

  function _close() {
    setTimeout(function() {
      _loading.close();
    }, 0);
  }
}

var instance = new LoadingUtil();
export default instance;
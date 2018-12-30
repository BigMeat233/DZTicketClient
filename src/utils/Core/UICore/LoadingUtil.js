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
    setTimeout(() => {
      _loading = Loading.service();
    }, 0);
  }

  function _close() {
    setTimeout(function () {
      _loading.close();
    }, 0);
  }
}

var instance = new LoadingUtil();
export default instance;
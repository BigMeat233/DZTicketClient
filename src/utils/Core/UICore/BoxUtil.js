/**
 * 弹框组件
 *
 * Made By Douzi＂
 */

import { MessageBox } from 'element-ui';

function BoxUtil() {
  this.alert = _alert;
  this.confirm = _confirm;

  function _alert(title, content, cb) {

    //回调私有方法
    function callback(action) {
      if (cb != null && cb != undefined) {
        cb(action);
      }
    }

    var opt = {
      confirmButtonText: '确定',
      callback: callback
    };

    MessageBox.alert(content, title, opt);
  }

  function _confirm(title, content, cb1, cb2) {
    var opt = {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
      center: false,
    };

    MessageBox
      .confirm(content, title, opt)
      .then(function() { cb1() })
      .catch(function() { cb2() });
  }
}

var instance = new BoxUtil();
export default instance;
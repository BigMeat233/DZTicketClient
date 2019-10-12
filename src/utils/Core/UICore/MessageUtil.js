/**
 * 消息组件
 *
 * Made By Douzi＂
 */

import { Message } from 'element-ui'

function MessageUtil() {
  this.success = _success;
  this.info = _info;
  this.warn = _warn;
  this.error = _error;

  function _success(msg, showClose, duration) {
    var opt = {
      type: 'success',
      message: msg,
      showClose: showClose === undefined ? false : showClose,
      duration: duration === undefined ? 1500 : duration
    };
    return Message(opt);
  }

  function _info(msg, showClose, duration) {
    var opt = {
      type: 'info',
      message: msg,
      showClose: showClose === undefined ? false : showClose,
      duration: duration === undefined ? 1500 : duration
    };
    return Message(opt);
  }

  function _warn(msg, showClose, duration) {
    var opt = {
      type: 'warning',
      message: msg,
      showClose: showClose === undefined ? false : showClose,
      duration: duration === undefined ? 1500 : duration
    };
    return Message(opt);
  }

  function _error(msg, showClose, duration) {
    var opt = {
      type: 'error',
      message: msg,
      showClose: showClose === undefined ? false : showClose,
      duration: duration === undefined ? 1500 : duration
    };
    return Message(opt);
  }
}

var instance = new MessageUtil();
export default instance;
/**
 * 平台通信报文
 *
 * Made By Douzi＂
 */

var iconv = require('iconv-lite')

function SocketMsg(params) {

  var _params = {};

  this.msgToBuffer = msgToBuffer;

  init();

  function init() {
    _params = params;
  }

  // 对象转`JSON`字符串
  function toJsonString() {
    return JSON.stringify(_params)
  }

  // 获取`JSON`字符串的长度
  function getJsonStringLength() {
    return _params.toJsonString().replace(/[\u0391-\uFFE5]/g, 'aa').length
  }

  // 字符串转`byte`数组
  function stringToByte() {
    const str = _params.toJsonString()
    const bytes = []
    let len, c
    len = str.length
    for (let i = 0; i < len; i++) {
      c = str.charCodeAt(i)
      if (c >= 0x010000 && c <= 0x10FFFF) {
        bytes.push(((c >> 18) & 0x07) | 0xF0)
        bytes.push(((c >> 12) & 0x3F) | 0x80)
        bytes.push(((c >> 6) & 0x3F) | 0x80)
        bytes.push((c & 0x3F) | 0x80)
      } else if (c >= 0x000800 && c <= 0x00FFFF) {
        bytes.push(((c >> 12) & 0x0F) | 0xE0)
        bytes.push(((c >> 6) & 0x3F) | 0x80)
        bytes.push((c & 0x3F) | 0x80)
      } else if (c >= 0x000080 && c <= 0x0007FF) {
        bytes.push(((c >> 6) & 0x1F) | 0xC0)
        bytes.push((c & 0x3F) | 0x80)
      } else {
        bytes.push(c & 0xFF)
      }
    }
    return bytes
  }

  // `number`转`byte`数组
  function toLH(n) {
    const bytes = [4]
    bytes[0] = n & 0xff
    bytes[1] = n >> 8 & 0xff
    bytes[2] = n >> 16 & 0xff
    bytes[3] = n >> 24 & 0xff
    return bytes
  }

  // 格式化消息格式
  function msgToBuffer() {
    const buf = iconv.encode(toJsonString(), 'gbk')
    const len = buf.length
    let bytes = []
    bytes = bytes.concat(toLH(0), toLH(0), toLH(len), toLH(0))
    const buf0 = Buffer.from(bytes)
    const tbuf = Buffer.concat([buf0, buf], buf0.length + len)
    return tbuf
  }
}

export default SocketMsg
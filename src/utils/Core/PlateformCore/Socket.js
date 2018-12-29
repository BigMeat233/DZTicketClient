/**
 * 平台通讯Socket
 *
 * Made By Douzi＂
 */

var iconv = require('iconv-lite');
var net = require('net');
import SocketMsg from './SocketMsg.js';

function Socket() {
  var _client = null;
  var _self = this;

  this.onReceiveMsg = onReceiveMsg;
  this.onConnectSuccess = onConnectSuccess;
  this.onConnectFailure = onConnectFailure;
  this.onConnectTimeout = onConnectTimeout;
  this.connect = connect;
  this.send = send;

  function connect(host, port) {
    _client = new net.Socket();

    _client.on('connect', function() {
      _self.onConnectSuccess();
    });

    _client.on('data', function(data) {
      const msges = getMsges(data);
      for (let msg of msges) {
        var message = GBK2UTF8(msg);
        _self.onReceiveMsg(message);
      }
    })

    _client.on('timeout', function() {
      _self.onConnectTimeout();
    })

    _client.on('error', function() {
      _self.onConnectFailure();
    })

    _client.connect(port, host);
  }

  //状态监听

  function onReceiveMsg(msg) {
    console.log(msg);
  }

  function onConnectSuccess() {
    console.log('建立长连接成功');
  }

  function onConnectTimeout() {
    console.log('建立长连接超时,进行重连');
  }

  function onConnectFailure() {
    console.log('建立长连接失败,进行重连');
  }

  function send(params) {
    var socketMsg = new SocketMsg(params);
    _client.write(socketMsg.msgToBuffer());
  }

  //处理入参报文通用
  function GBK2UTF8(msg) {
    let str = iconv.decode(msg, 'gbk')
    str = str.substring(0, str.length - 1)
    return str
  }

  function jsonToObj(str) {
    return JSON.parse(str)
  }

  //解析返回报文通用
  function getMsges(bytes) {
    const msges = []
    bufferToMsg(bytes, msges)
    return msges
  }

  function bytesToNumber(bytes) {
    let n = 0
    n = (bytes[0] & 0xFF) | ((bytes[1] & 0xFF) << 8) | ((bytes[2] & 0xFF) << 16) | ((bytes[3] & 0xFF) << 24)
    return n
  }

  function bufferToMsg(bytes, msgs) {
    const bytesLen = bytes.length
    const header = bytes.slice(0, 16)

    const header3 = header.slice(8, 12)
    const bodyLen = bytesToNumber(header3)

    const msgLen = bodyLen + header.length
    const msg = bytes.slice(16, msgLen)
    msgs.push(msg)
    if (msgLen < bytesLen) {
      bufferToMsg(bytes.slice(msgLen), msgs)
    }
  }
}


var instance = new Socket();
export default instance;
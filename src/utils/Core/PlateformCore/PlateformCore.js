/**
 * 平台交互核心
 *
 * Made By Douzi＂
 */

import Socket from './Socket.js';
import Common from '../CommonCore';

//平台返回事件名
const EVENT_NAME_INIT = 'Init';
const EVENT_NAME_SWITCH = 'SwitchNotify';
const EVENT_NAME_SWITCH_FINISH = 'Switch';
const EVENT_NAME_READY = 'Ready';
const EVENT_NAME_NOTIFY = 'EventNotify';

//提交类型与事件名
const EMIT_TYPE_SWITCH = '31016';
const EMIT_NAME_SWITCH = 'Switch';
const EMIT_TYPE_READY = '31026';
const EMIT_NAME_READY = 'Ready';
const EMIT_NAME_CUSTOM = '31034';


function PlateformCore() {
  Socket.onConnectSuccess = onConnectSuccess;
  Socket.onConnectTimeout = onConnectTimeout;
  Socket.onConnectFailure = onConnectFailure;
  Socket.onReceiveMsg = onReceiveMsg;

  //准备就绪成功Hook
  this.onReady = function() {};
  //处理通知Hook
  this.handleNotifyEvent = function(param) {};
  this.handleConnectTimeout = function() {};
  this.handleConnectFailure = function() {};
  //连接
  this.connect = connect;
  //提交自定义事件
  this.emitCustomEvent = emitCustomEvent;

  var _sessionId = '0';
  var _serialNum = '0';
  var _self = this;

  //连接
  function connect(host, port) {
    Socket.connect(host, port);
  }

  //发送自定义事件
  function emitCustomEvent(emitName, param) {
    var customMsg = getMsgCopy();
    customMsg.header.type = EMIT_NAME_CUSTOM;
    customMsg.content.param.service_name = emitName;
    customMsg.content.param.service_param = param;
    Socket.send(customMsg);
  }

  //Socket连接成功
  function onConnectSuccess() {
    console.log('PlateformCore -> STATE : 成功与硬件平台建立长连接');
    emitInitEvent();
  }

  //Socket连接超时
  function onConnectTimeout() {
    console.log('PlateformCore -> STATE : 与硬件平台建立长连接超时');
    _self.handleConnectTimeout();
  }

  //Socket连接失败
  function onConnectFailure() {
    console.log('PlateformCore -> STATE : 与硬件平台建立长连接失败');
    _self.handleConnectFailure();
  }

  //Socket收到信息
  function onReceiveMsg(msg) {
    console.log('PlateformCore -> REC MSG : ' + msg);
    var resultObj = JSON.parse(msg);
    //处理sessionId和serialNum
    _sessionId = resultObj.header.session_id;
    _serialNum = fixSerialNum((parseInt(resultObj.header.serial_number) + 1));
    //分发报文处理
    var param = resultObj.content.param;
    var serverName = param.service_name;
    //初始化
    if (serverName === EVENT_NAME_INIT) {
      handleInitEvent(param);
    }
    //切换状态
    else if (serverName === EVENT_NAME_SWITCH) {
      handleSwitchEvent(param);
    }
    //切换状态完成
    else if (serverName === EVENT_NAME_SWITCH_FINISH) {
      handleSwitchFinishEvent(param);
    }
    //准备就绪
    else if (serverName === EVENT_NAME_READY) {
      handleReadyEvent(param);
    }
    //通知
    else if (serverName === EVENT_NAME_NOTIFY) {
      _self.handleNotifyEvent(param);
    }

    //私有API - 序列号校正
    function fixSerialNum(num) {
      return ('000000000' + num).slice(-10)
    }
  }

  //提交初始化
  function emitInitEvent() {
    var initMsg = getMsgCopy();
    Socket.send(initMsg);
  }

  //处理初始化返回
  function handleInitEvent(param) {
    console.log('PlateformCore -> INIT STATE : ' + param.result.description);
  }

  //处理切换状态返回
  function handleSwitchEvent(param) {
    console.log('PlateformCore -> SWITCH TO : ' + param.service_param.state_name);
    var stateName = param.service_param.state_name;
    var switchMsg = getMsgCopy();
    switchMsg.header.type = EMIT_TYPE_SWITCH;
    switchMsg.content.param.service_name = EMIT_NAME_SWITCH;
    switchMsg.content.param.service_param = {
      state_name: stateName,
    };
    Socket.send(switchMsg);
  }

  //处理切换状态完成返回
  function handleSwitchFinishEvent(param) {
    console.log('PlateformCore -> SWITCH STATE : ' + param.result.description);
    var state = param.result.description;
    if (state === 'succeeded') {
      var readyMsg = getMsgCopy();
      readyMsg.header.type = EMIT_TYPE_READY;
      readyMsg.content.param.service_name = EMIT_NAME_READY;
      readyMsg.content.param.service_param = {};
      Socket.send(readyMsg);
    }
  }

  //处理准备就绪返回
  function handleReadyEvent(param) {
    console.log('PlateformCore -> READT STATE : ' + param.result.description);
    _self.onReady();
  }

  //获取报文副本
  function getMsgCopy() {
    var commonMsg = {
      header: {
        tag: 'tdos',
        version: '1.0.0.1',
        type: '31018',
        time_stamp: Common.time.format(new Date(), 'yyyy-MM-dd hh:mm:ss S'),
        session_id: _sessionId,
        serial_number: _serialNum,
      },
      content: {
        from: '127.0.0.1:6001',
        to: '127.0.0.1:6002',
        verb: 'DoService',
        param: {
          service_name: 'Init',
          service_param: {
            app_name: 'tdrobotterminalapp',
            strategy_name: 'tdrobotterminalapp',
          },
        },
      },
    };
    return JSON.parse(JSON.stringify(commonMsg));
  }
}

var instance = new PlateformCore();
export default instance;
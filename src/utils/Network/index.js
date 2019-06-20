import Core from '@/utils/Core';
import Http from './Http';
class Network {
  static initPage(successCB) {
    let funcName = '/InitPage.do';
    let params = {};
    Core.ui.loading.show();
    let success = data => {
      Core.ui.loading.close();
      let code = data.HEAD.code;
      let msg = data.HEAD.msg;
      if (code === '111111') {
        let otnId = data.BODY.otnId;
        Core.local.setItem('otnId', otnId);
        successCB(otnId);
      } else {
        Core.ui.message.warn(msg);
      }
    };
    let failure = err => {
      Core.ui.loading.close();
      Core.ui.message.error('网络错误');
    };
    Http.post(funcName, params, success, failure);
  }

  static getCheckCode(successCB) {
    let funcName = '/GetCheckCode.do';
    let params = {
      otnId: Core.local.getItem('otnId')
    };
    Core.ui.loading.show();
    let success = data => {
      Core.ui.loading.close();
      let code = data.HEAD.code;
      let msg = data.HEAD.msg;
      if (code === '111111') {
        let imgBase64 = data.BODY.imgBase64;
        successCB(imgBase64);
      } else {
        Core.ui.message.warn(msg);
      }
    };
    let failure = err => {
      Core.ui.loading.close();
      Core.ui.message.error('网络错误');
    };
    Http.post(funcName, params, success, failure);
  }

  static login(userId, userPwd, answer, successCB) {
    let funcName = '/Login.do';
    let params = {
      otnId: Core.local.getItem('otnId'),
      userId,
      userPwd,
      answer
    };
    Core.ui.loading.show();
    let success = data => {
      Core.ui.loading.close();
      let code = data.HEAD.code;
      let msg = data.HEAD.msg;
      if (code === '111111') {
        successCB(true);
      } else {
        Core.ui.message.warn(msg);
        successCB(false);
      }
    };
    let failure = err => {
      Core.ui.loading.close();
      Core.ui.message.error('网络错误');
    };
    Http.post(funcName, params, success, failure);
  }

  static registerDevice(successCB) {
    let funcName = '/RegisterDevice.do';
    let params = {
      otnId: Core.local.getItem('otnId')
    };
    Core.ui.loading.show();
    let success = data => {
      Core.ui.loading.close();
      let code = data.HEAD.code;
      let msg = data.HEAD.msg;
      if (code === '111111') {
        successCB(true);
      } else {
        Core.ui.message.warn(msg);
        successCB(false);
      }
    };
    let failure = err => {
      Core.ui.loading.close();
      Core.ui.message.error('网络错误');
    };
    Http.post(funcName, params, success, failure);
  }

  static queryTickets(startStation, endStation, date, ticketType, successCB) {
    let funcName = '/QueryTickets.do';
    let params = {
      otnId: Core.local.getItem('otnId'),
      startStation,
      endStation,
      date,
      ticketType
    };
    let success = data => {
      let code = data.HEAD.code;
      let msg = data.HEAD.msg;
      if (code === '111111') {
        let ticketInfos = data.BODY.ticketInfos;
        successCB(ticketInfos);
      } else {
        successCB([]);
      }
    };
    let failure = err => {
      successCB([]);
    };
    Http.post(funcName, params, success, failure);
  }

  static queryPersons(page, size, successCB) {
    let funcName = '/QueryPersons.do';
    let params = {
      otnId: Core.local.getItem('otnId'),
      page,
      size,
    };
    Core.ui.loading.show();
    let success = data => {
      Core.ui.loading.close();
      let code = data.HEAD.code;
      let msg = data.HEAD.msg;
      if (code === '111111') {
        let personInfos = data.BODY.personInfos;
        successCB(personInfos);
      } else {
        Core.ui.message.warn(msg);
      }
    };
    let failure = err => {
      Core.ui.loading.close();
      Core.ui.message.error('网络错误');
    };
    Http.post(funcName, params, success, failure);
  }

  static addPerson(name, sex, certCode, certNo, typeCode, successCB) {
    let funcName = '/AddPerson.do';
    let params = {
      otnId: Core.local.getItem('otnId'),
      name,
      sex,
      certCode,
      certNo,
      typeCode
    };
    Core.ui.loading.show();
    let success = data => {
      Core.ui.loading.close();
      let code = data.HEAD.code;
      let msg = data.HEAD.msg;
      if (code === '111111') {
        successCB(true);
      } else {
        Core.ui.message.warn(msg);
        successCB(false);
      }
    };
    let failure = err => {
      Core.ui.loading.close();
      Core.ui.message.error('网络错误');
    };
    Http.post(funcName, params, success, failure);
  }

  static deletePerson(name, certCode, certNo, successCB) {
    let funcName = '/DeletePerson.do';
    let params = {
      otnId: Core.local.getItem('otnId'),
      name,
      certCode,
      certNo,
    };
    Core.ui.loading.show();
    let success = data => {
      Core.ui.loading.close();
      let code = data.HEAD.code;
      let msg = data.HEAD.msg;
      if (code === '111111') {
        successCB(true);
      } else {
        Core.ui.message.warn(msg);
        successCB(false);
      }
    };
    let failure = err => {
      Core.ui.loading.close();
      Core.ui.message.error('网络错误');
    };
    Http.post(funcName, params, success, failure);
  }

  static orderTicket(trainNo, trainId, trainCount, secStr, startStation, endStation, date, location, ticketType, personInfos, seatLocations, successCB) {
    let funcName = '/OrderTicket.do';
    let params = {
      otnId: Core.local.getItem('otnId'),
      trainNo,
      trainId,
      trainCount,
      secStr,
      startStation,
      endStation,
      date,
      location,
      ticketType,
      personInfos,
      seatLocations,
    };
    let success = data => {
      let code = data.HEAD.code;
      let msg = data.HEAD.msg;
      if (code === '111111') {
        successCB({ result: true, queueInfo: data.BODY.queueInfo });
      } else {
        successCB({ result: false, err: msg });
      }
    };
    let failure = (err) => {
      successCB({ result: false, err: '网络错误' });
    };
    Http.post(funcName, params, success, failure);
  }

  static queryQueue(successCB, failureCB) {
    let funcName = '/QueryQueue.do';
    let params = {
      otnId: Core.local.getItem('otnId')
    };
    let success = data => {
      let code = data.HEAD.code;
      let msg = data.HEAD.msg;
      if (code === '111111') {
        let queueInfo = data.BODY.queueInfo;
        successCB(queueInfo);
      } else {
        failureCB('1', msg);
      }
    };
    let failure = (err) => {
      failureCB('0', '网络错误');
    };
    Http.post(funcName, params, success, failure);
  }

  static cancelQueue(successCB) {
    let funcName = '/CancelQueue.do';
    let params = {
      otnId: Core.local.getItem('otnId')
    };
    Core.ui.loading.show();
    let success = data => {
      Core.ui.loading.close();
      let code = data.HEAD.code;
      let msg = data.HEAD.msg;
      if (code === '111111') {
        successCB(true);
      } else {
        successCB(false, msg);
      }
    };
    let failure = (err) => {
      Core.ui.loading.close();
      successCB(false, '网络错误');
    };
    Http.post(funcName, params, success, failure);
  }

  static queryOrder(successCB) {
    let funcName = '/QueryOrder.do';
    let params = {
      otnId: Core.local.getItem('otnId')
    };
    Core.ui.loading.show();
    let success = data => {
      Core.ui.loading.close();
      let code = data.HEAD.code;
      let msg = data.HEAD.msg;
      if (code === '111111') {
        let orderInfo = data.BODY.orderInfo;
        successCB(orderInfo);
      } else {
        Core.ui.message.warn(msg);
      }
    };
    let failure = (err) => {
      Core.ui.loading.close();
      Core.ui.message.error('网络错误');
    };
    Http.post(funcName, params, success, failure);
  }

  static cancelOrder(orderId, successCB) {
    let funcName = '/CancelOrder.do';
    let params = {
      otnId: Core.local.getItem('otnId'),
      orderId
    };
    Core.ui.loading.show();
    let success = data => {
      Core.ui.loading.close();
      let code = data.HEAD.code;
      let msg = data.HEAD.msg;
      if (code === '111111') {
        successCB(true);
      } else {
        Core.ui.message.warn(msg);
        successCB(false);
      }
    };
    let failure = (err) => {
      Core.ui.loading.close();
      Core.ui.message.error('网络错误');
    };
    Http.post(funcName, params, success, failure);
  }

  static destroy(successCB) {
    let funcName = '/Destroy.do';
    let params = {
      otnId: Core.local.getItem('otnId')
    };
    let success = data => {
      let code = data.HEAD.code;
      let msg = data.HEAD.msg;
      if (code === '111111') {
        successCB(true);
      } else {
        Core.ui.message.warn(msg);
        successCB(false);
      }
    };
    let failure = (err) => {
      Core.ui.message.error('网络错误');
    };
    Http.post(funcName, params, success, failure);
  }

  static indexStationNames(index, successCB) {
    let funcName = '/IndexStationNames.do';
    let params = {
      index,
    };
    let success = (data) => {
      let code = data.HEAD.code;
      let msg = data.HEAD.msg;
      if (code === '111111') {
        let stationNames = data.BODY.stationNames;
        successCB(stationNames);
      } else {
        successCB([]);
      }
    };
    let failure = (err) => {
    };
    Http.post(funcName, params, success, failure);
  }

  static queryStationStops(trainNo, startStation, endStation, date, successCB) {
    let funcName = '/QueryStationStops.do';
    let params = {
      trainNo,
      startStation,
      endStation,
      date,
    };
    Core.ui.loading.show();
    let success = (data) => {
      Core.ui.loading.close();
      let code = data.HEAD.code;
      let msg = data.HEAD.msg;
      if (code === '111111') {
        let stationStops = data.BODY.stationStops;
        successCB(stationStops);
      } else {
        Core.ui.message.warn(msg);
      }
    };
    let failure = (err) => {
      Core.ui.loading.close();
      Core.ui.message.error('网络错误');
    };
    Http.post(funcName, params, success, failure);
  }
}

export default Network;

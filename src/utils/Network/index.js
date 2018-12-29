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
      ß;
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
    Core.ui.loading.show();
    let success = data => {
      Core.ui.loading.close();
      let code = data.HEAD.code;
      let msg = data.HEAD.msg;
      if (code === '111111') {
        let ticketInfos = data.BODY.ticketInfos;
        successCB(ticketInfos);
      } else {
        Core.ui.message.warn(msg);
        successCB([]);
      }
    };
    let failure = err => {
      Core.ui.loading.close();
      Core.ui.message.error('网络错误');
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

  static orderTicket(trainNo, trainId, trainCount, secStr, startStation, endStation, date, location, ticketType, personInfos, successCB) {
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
    };
    Core.ui.loading.show();
    let success = data => {
      Core.ui.loading.close();
      let code = data.HEAD.code;
      let msg = data.HEAD.msg;
      if (code === '111111') {
        successCB(data.BODY.queueInfo);
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

  static queryQueue(successCB) {
    let funcName = '/QueryQueue.do';
    let params = {
      otnId: Core.local.getItem('otnId')
    };
    Core.ui.loading.show();
    let success = data => {
      Core.ui.loading.close();
      let code = data.HEAD.code;
      let msg = data.HEAD.msg;
      if (code === '111111') {
        let queueInfo = data.BODY.queueInfo;
        successCB(queueInfo);
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
}

export default Network;

import Core from '@/utils/Core';
import Http from './Http';
class Network {
  static createSuccessObject(data) {
    return { result: true, data };
  }

  static createHandlerErrorObject(msg) {
    return { result: false, err: { code: '1', msg } };
  }

  static createNetworkErrorObject() {
    return { result: false, err: { code: '0', msg: '网络错误' } }
  }

  static responseHandler(response, resolve) {
    if (response.result) {
      const data = response.data;
      const code = data.HEAD.code;
      const msg = data.HEAD.msg;
      if (code === '111111') {
        resolve(this.createSuccessObject(data.BODY));
      } else {
        resolve(this.createHandlerErrorObject(msg));
      }
    } else {
      resolve(this.createNetworkErrorObject());
    }
  }

  static initPage(isLoading = true) {
    return new Promise(async (resolve) => {
      const funcName = '/InitPage.do';
      const params = {};
      const response = await Http.post(funcName, params, { isLoading });
      this.responseHandler(response, resolve);
    });
  }

  static getCheckCode(isLoading = true) {
    return new Promise(async (resolve) => {
      const funcName = '/GetCheckCode.do';
      const params = {
        otnId: Core.local.getItem('otnId')
      };
      const response = await Http.post(funcName, params, { isLoading });
      this.responseHandler(response, resolve);
    });
  }

  static login(userId, userPwd, answer, isLoading = true) {
    return new Promise(async (resolve) => {
      const funcName = '/Login.do';
      const params = {
        otnId: Core.local.getItem('otnId'),
        userId,
        userPwd,
        answer
      };
      const response = await Http.post(funcName, params, { isLoading });
      this.responseHandler(response, resolve);
    });
  }

  static registerDevice(isLoading = true) {
    return new Promise(async (resolve) => {
      const funcName = '/RegisterDevice.do';
      const params = {
        otnId: Core.local.getItem('otnId')
      };
      const response = await Http.post(funcName, params, { isLoading });
      this.responseHandler(response, resolve);
    });
  }

  static queryTickets(startStation, endStation, date, ticketType, isLoading = true) {
    return new Promise(async (resolve) => {
      const funcName = '/QueryTickets.do';
      const params = {
        otnId: Core.local.getItem('otnId'),
        startStation,
        endStation,
        date,
        ticketType
      };
      const response = await Http.post(funcName, params, { isLoading });
      this.responseHandler(response, resolve);
    });
  }

  static queryPersons(page, size, isLoading = true) {
    return new Promise(async (resolve) => {
      const funcName = '/QueryPersons.do';
      const params = {
        otnId: Core.local.getItem('otnId'),
        page,
        size,
      };
      const response = await Http.post(funcName, params, { isLoading });
      this.responseHandler(response, resolve);
    });
  }

  static addPerson(name, sex, certCode, certNo, typeCode, isLoading = true) {
    return new Promise(async (resolve) => {
      const funcName = '/AddPerson.do';
      const params = {
        otnId: Core.local.getItem('otnId'),
        name,
        sex,
        certCode,
        certNo,
        typeCode
      };
      const response = await Http.post(funcName, params, { isLoading });
      this.responseHandler(response, resolve);
    });
  }

  static deletePerson(name, certCode, certNo, isLoading = true) {
    return new Promise(async (resolve) => {
      const funcName = '/DeletePerson.do';
      const params = {
        otnId: Core.local.getItem('otnId'),
        name,
        certCode,
        certNo,
      };
      const response = await Http.post(funcName, params, { isLoading });
      this.responseHandler(response, resolve);
    });
  }

  static orderTicket(trainNo, trainId, trainCount, secStr, startStation, endStation, date, location, ticketType, personInfos, seatLocations, isLoading = true) {
    return new Promise(async (resolve) => {
      const funcName = '/OrderTicket.do';
      const params = {
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
      const response = await Http.post(funcName, params, { isLoading });
      this.responseHandler(response, resolve);
    });
  }

  static queryQueue(isLoading = true) {
    return new Promise(async (resolve) => {
      const funcName = '/QueryQueue.do';
      const params = {
        otnId: Core.local.getItem('otnId')
      };
      const response = await Http.post(funcName, params, { isLoading });
      this.responseHandler(response, resolve);
    });
  }

  static cancelQueue(isLoading = true) {
    return new Promise(async (resolve) => {
      const funcName = '/CancelQueue.do';
      const params = {
        otnId: Core.local.getItem('otnId')
      };
      const response = await Http.post(funcName, params, { isLoading });
      this.responseHandler(response, resolve);
    });
  }

  static queryOrder(isLoading = true) {
    return new Promise(async (resolve) => {
      const funcName = '/QueryOrder.do';
      const params = {
        otnId: Core.local.getItem('otnId')
      };
      const response = await Http.post(funcName, params, { isLoading });
      this.responseHandler(response, resolve);
    });
  }

  static cancelOrder(orderId, isLoading = true) {
    return new Promise(async (resolve) => {
      const funcName = '/CancelOrder.do';
      const params = {
        otnId: Core.local.getItem('otnId'),
        orderId
      };
      const response = await Http.post(funcName, params, { isLoading });
      this.responseHandler(response, resolve);
    });
  }

  static destroy(isLoading = true) {
    return new Promise(async (resolve) => {
      const funcName = '/Destroy.do';
      const params = {
        otnId: Core.local.getItem('otnId')
      };
      const response = await Http.post(funcName, params, { isLoading });
      this.responseHandler(response, resolve);
    });
  }

  static indexStationNames(index, isLoading = true) {
    return new Promise(async (resolve) => {
      const funcName = '/IndexStationNames.do';
      const params = {
        index,
      };
      const response = await Http.post(funcName, params, { isLoading });
      this.responseHandler(response, resolve);
    });
  }

  static queryStationStops(trainNo, startStation, endStation, date, isLoading = true) {
    return new Promise(async (resolve) => {
      const funcName = '/QueryStationStops.do';
      const params = {
        trainNo,
        startStation,
        endStation,
        date,
      };
      const response = await Http.post(funcName, params, { isLoading });
      this.responseHandler(response, resolve);
    });
  }
}

export default Network;

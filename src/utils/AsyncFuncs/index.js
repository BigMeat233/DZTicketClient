import Network from '@/utils/Network';
import Core from '@/utils/Core';
class AsyncFuncs {
  static initPage() {
    return new Promise(async (resolve) => {
      const result = await Network.initPage();
      if (result.result) {
        const otnId = result.data.otnId;
        Core.local.setItem('otnId', otnId);
        resolve(otnId);
      } else if (result.err.code === '1') {
        Core.ui.message.warn(result.err.msg);
      } else {
        Core.ui.message.error(result.err.msg);
      }
    });
  }

  static registerDevice() {
    return new Promise(async (resolve) => {
      const result = await Network.registerDevice();
      if (result.result) {
        resolve(true);
      } else if (result.err.code === '1') {
        Core.ui.message.warn(result.err.msg);
      } else {
        Core.ui.message.error(result.err.msg);
      }
    });
  }

  static getCheckCode() {
    return new Promise(async (resolve) => {
      const result = await Network.getCheckCode();
      if (result.result) {
        resolve(result.data.imgBase64);
      } else if (result.err.code === '1') {
        Core.ui.message.warn(result.err.msg);
      } else {
        Core.ui.message.error(result.err.msg);
      }
    });
  }

  static login(userId, userPwd, answer) {
    return new Promise(async (resolve) => {
      const result = await Network.login(userId, userPwd, answer);
      if (result.result) {
        resolve(true);
      } else if (result.err.code === '1') {
        Core.ui.message.warn(result.err.msg);
        resolve(false);
      } else {
        Core.ui.message.error(result.err.msg);
        resolve(false);
      }
    });
  }

  // 查询车票(带菊花)
  static queryTickets(startStation, endStation, date, ticketType) {
    return new Promise(async (resolve) => {
      const result = await Network.queryTickets(startStation, endStation, date, ticketType);
      if (result.result) {
        resolve(result.data.ticketInfos);
      } else {
        resolve([]);
      }
    });
  }

  // 查询车票(不带菊花和提示)
  static queryTicketsWithoutLoading(startStation, endStation, date, ticketType) {
    return new Promise(async (resolve) => {
      const result = await Network.queryTickets(startStation, endStation, date, ticketType, false);
      if (result.result) {
        resolve(result.data.ticketInfos);
      } else {
        resolve([]);
      }
    });
  }

  static queryPersons() {
    return new Promise(async (resolve) => {
      const result = await Network.queryPersons('1', '100');
      if (result.result) {
        resolve(result.data.personInfos);
      } else if (result.err.code === '1') {
        Core.ui.message.warn(result.err.msg);
      } else {
        Core.ui.message.error(result.err.msg);
      }
    })
  }

  static addPerson(name, sex, certCode, certNo, personCode) {
    return new Promise(async (resolve) => {
      const result = await Network.addPerson(name, sex, certCode, certNo, personCode);
      if (result.result) {
        Core.ui.message.success('添加乘客成功');
        resolve(true);
      } else if (result.err.code === '1') {
        Core.ui.message.warn(result.err.msg);
        resolve(false);
      } else {
        Core.ui.message.error(result.err.msg);
        resolve(false);
      }
    });
  }

  static deletePerson(name, certType, certNo) {
    return new Promise(async (resolve) => {
      const result = await Network.deletePerson(name, certType, certNo);
      if (result.result) {
        Core.ui.message.success('删除乘客成功');
        resolve(true);
      } else if (result.err.code === '1') {
        Core.ui.message.warn(result.err.msg);
        resolve(false);
      } else {
        Core.ui.message.error(result.err.msg);
        resolve(false);
      }
    });
  }

  // 下单(不带菊花)
  static orderTicketWithoutLoadingAndTips(trainNo, trainId, trainCount, secStr, startStation, endStation, date, location, ticketType, personInfos, seatLocations) {
    return new Promise(async (resolve) => {
      const result = await Network.orderTicket(trainNo, trainId, trainCount, secStr, startStation, endStation, date, location, ticketType, personInfos, seatLocations, false);
      if (result.result) {
        resolve({ result: true, queueInfo: result.data.queueInfo });
      } else if (result.err.code === '1') {
        resolve({ result: false, err: result.err.msg });
      } else {
        resolve({ result: false, err: result.err.msg });
      }
    });
  }

  // 下单(带菊花)
  static orderTicket(trainNo, trainId, trainCount, secStr, startStation, endStation, date, location, ticketType, personInfos, seatLocations) {
    return new Promise(async (resolve) => {
      const result = await Network.orderTicket(trainNo, trainId, trainCount, secStr, startStation, endStation, date, location, ticketType, personInfos, seatLocations);
      if (result.result) {
        resolve({ result: true, queueInfo: result.data.queueInfo });
      } else if (result.err.code === '1') {
        resolve({ result: false, err: result.err.msg });
      } else {
        resolve({ result: false, err: result.err.msg });
      }
    });
  }

  // 查询队列(带菊花)
  static queryQueue() {
    return new Promise(async (resolve) => {
      const result = await Network.queryQueue();
      if (result.result) {
        resolve({ result: true, queueInfo: result.data.queueInfo });
      } else if (result.err.code === '1') {
        Core.ui.message.warn(result.err.msg);
        resolve({ result: false, errCode: result.err.code, err: result.err.msg });
      } else {
        Core.ui.message.error(result.err.msg);
        resolve({ result: false, errCode: result.err.code, err: result.err.msg });
      }
    });
  }

  // 查询队列(不带菊花)
  static queryQueueWithoutLoadingAndTips() {
    return new Promise(async (resolve) => {
      const result = await Network.queryQueue(false);
      if (result.result) {
        resolve({ result: true, queueInfo: result.data.queueInfo });
      } else {
        resolve({ result: false, errCode: result.err.code, err: result.err.msg });
      }
    });
  }

  static cancelQueue() {
    return new Promise(async (resolve) => {
      const result = await Network.cancelQueue();
      if (result.result) {
        Core.ui.message.success('取消排队成功');
        resolve(true);
      } else if (result.err.code === '1') {
        Core.ui.message.warn(result.err.msg);
        resolve(false);
      } else {
        Core.ui.message.error(result.err.msg);
        resolve(false);
      }
    });
  }

  static cancelQueueWithoutTip() {
    return new Promise(async (resolve) => {
      const result = await Network.cancelQueue();
      if (result.result) {
        resolve(true);
      } else {
        resolve(false);
      }
    });
  }

  static queryOrder() {
    return new Promise(async (resolve) => {
      const result = await Network.queryOrder();
      if (result.result) {
        const orderInfo = result.data.orderInfo;
        resolve(orderInfo);
      } else if (result.err.code === '1') {
        Core.ui.message.warn(result.err.msg);
      } else {
        Core.ui.message.error(result.err.msg);
      }
    });
  }

  static cancelOrder(orderId) {
    return new Promise(async (resolve) => {
      const result = await Network.cancelOrder(orderId);
      if (result.result) {
        Core.ui.message.success('取消订单成功');
        resolve(true);
      } else if (result.err.code === '1') {
        Core.ui.message.warn(result.err.msg);
        resolve(false);
      } else {
        Core.ui.message.error(result.err.msg);
        resolve(false);
      }
    });
  }

  static indexStationNamesWithoutLoadingAndTips(index) {
    return new Promise(async (resolve) => {
      const result = await Network.indexStationNames(index, false);
      if (result.result) {
        const stationNames = result.data.stationNames;
        resolve(stationNames);
      } else {
        resolve([]);
      }
    });
  }

  static queryStationStops(trainNo, startStation, endStation, date) {
    return new Promise(async (resolve) => {
      const result = await Network.queryStationStops(trainNo, startStation, endStation, date);
      if (result.result) {
        resolve(result.data.stationStops);
      } else if (result.err.code === '1') {
        Core.ui.message.warn(result.err.msg);
      } else {
        Core.ui.message.error(result.err.msg);
      }
    });
  }

  static destroy() {
    return new Promise(async (resolve) => {
      const result = await Network.destroy();
      if (result.result) {
        resolve(true);
        Core.local.removeItem('otnId');
      } else if (result.err.code === '1') {
        Core.ui.message.warn(result.err.msg);
        resolve(false);
      } else {
        Core.ui.message.error(result.err.msg);
        resolve(false);
      }
    });
  }
}

export default AsyncFuncs;
import Core from '@/utils/Core';
import Macro from '@/utils/Macro';
import Network from '@/utils/Network';

class AsyncFuncs {
  static initPage() {
    return new Promise(async (resolve) => {
      const result = await Network.initPage();
      if (result.result) {
        const otnId = result.data.initInfo.otnId;
        const confInfo = result.data.initInfo.confInfo;
        Core.local.setItem('otnId', otnId);
        resolve({ otnId, confInfo });
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

  static getLocalCheckCode() {
    return new Promise(async (resolve) => {
      const result = await Network.getLocalCheckCode();
      if (result.result) {
        resolve(result.data.imgBase64);
      } else if (result.err.code === '1') {
        Core.ui.message.warn(result.err.msg);
      } else {
        Core.ui.message.error(result.err.msg);
      }
    });
  }

  static getAiCheckCode(userId, answer) {
    return new Promise(async (resolve) => {
      const result = await Network.getAiCheckCode(userId, answer);
      if (result.result) {
        resolve({
          result: true,
          aiCheckCode: result.data.aiCheckCode
        });
      } else if (result.err.code === '1') {
        Core.ui.message.warn(result.err.msg);
        resolve({ result: false, aiCheckCode: {} });
      } else {
        Core.ui.message.error(result.err.msg);
        resolve({ result: false, aiCheckCode: {} });
      }
    });
  }

  static login(userId, userPwd, answer, aiCheckResult) {
    return new Promise(async (resolve) => {
      const result = await Network.login(userId, userPwd, answer, aiCheckResult);
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

  static localLogin(userId, userPwd, answer) {
    return new Promise(async (resolve) => {
      const result = await Network.localLogin(userId, userPwd, answer);
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
  static queryTickets(startStation, endStation, date, ticketType, isStationStrict) {
    return new Promise(async (resolve) => {
      const result = await Network.queryTickets(startStation, endStation, date, ticketType);
      if (result.result) {
        const ticketInfos = isStationStrict
          ? (result.data.ticketInfos || [])
            .filter(({ startStr, endStr }) => startStr === startStation && endStr === endStation)
          : result.data.ticketInfos;
        resolve(ticketInfos);
      } else {
        resolve([]);
      }
    });
  }

  // 查询车票(不带菊花和提示)
  static queryTicketsWithoutLoading(startStation, endStation, date, ticketType, isStationStrict) {
    return new Promise(async (resolve) => {
      const result = await Network.queryTickets(startStation, endStation, date, ticketType, false);
      if (result.result) {
        const ticketInfos = isStationStrict
          ? (result.data.ticketInfos || [])
            .filter(({ startStr, endStr }) => startStr === startStation && endStr === endStation)
          : result.data.ticketInfos;
        resolve(ticketInfos);
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

  static addPerson(name, sex, phone, certCode, certNo, personCode) {
    return new Promise(async (resolve) => {
      const result = await Network.addPerson(name, sex, phone, certCode, certNo, personCode);
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

  static deletePerson(name, certType, certNo, secStr) {
    return new Promise(async (resolve) => {
      const result = await Network.deletePerson(name, certType, certNo, secStr);
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
  // 预下单
  static preOrderTicket(secStr, startStation, endStation, date, ticketType) {
    return new Promise(async (resolve) => {
      const result = await Network.preOrderTicket(secStr, startStation, endStation, date, ticketType);
      if (result.result) {
        resolve({ result: true, preOrderInfo: result.data.preOrderInfo });
      } else {
        resolve({ result: false, err: result.err.msg });
      }
    });
  }

  // 预下单不带菊花
  static preOrderTicketWithoutLoadingAndTips(secStr, startStation, endStation, date, ticketType) {
    return new Promise(async (resolve) => {
      const result = await Network.preOrderTicket(secStr, startStation, endStation, date, ticketType, false);
      if (result.result) {
        resolve({ result: true, preOrderInfo: result.data.preOrderInfo });
      } else {
        resolve({ result: false, err: result.err.msg });
      }
    });
  }

  // 下单(不带菊花)
  static orderTicketWithoutLoadingAndTips(trainNo, trainId, trainCount, startStation, endStation, date, location, personInfos, seatLocations, keyInfo, aiCheck) {
    return new Promise(async (resolve) => {
      const result = await Network.orderTicket(trainNo, trainId, trainCount, startStation, endStation, date, location, personInfos, seatLocations, keyInfo, aiCheck, false);
      if (result.result) {
        resolve({ result: true, queueInfo: result.data.queueInfo });
      } else {
        resolve({ result: false, err: result.err.msg });
      }
    });
  }

  // 下单(带菊花)
  static orderTicket(trainNo, trainId, trainCount, startStation, endStation, date, location, personInfos, seatLocations, keyInfo, aiCheck) {
    return new Promise(async (resolve) => {
      const result = await Network.orderTicket(trainNo, trainId, trainCount, startStation, endStation, date, location, personInfos, seatLocations, keyInfo, aiCheck);
      if (result.result) {
        resolve({ result: true, queueInfo: result.data.queueInfo });
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

  static queryPrice(trainNo, date, startCode, endCode, seatTypeCodes) {
    return new Promise(async (resolve) => {
      const result = await Network.queryPrice(trainNo, date, startCode, endCode, seatTypeCodes);
      if (result.result) {
        resolve(result.data.priceInfo);
      } else if (result.err.code === '1') {
        Core.ui.message.warn(result.err.msg);
      } else {
        Core.ui.message.error(result.err.msg);
      }
    });
  }

  static queryAlternateRate(secStr, seatTypeCode) {
    return new Promise(async (resolve) => {
      const result = await Network.queryAlternateRate(secStr, seatTypeCode);
      if (result.result) {
        resolve(result.data.rateInfo);
      } else if (result.err.code === '1') {
        Core.ui.message.warn(result.err.msg);
        if (result.err.msg === Macro.limitStrings.isAlternated) {
          resolve({ isAlternated: true });
        } else if (result.err.msg === Macro.limitStrings.isOffline) {
          resolve({ isOffline: true });
        }
      } else {
        Core.ui.message.error(result.err.msg);
      }
    });
  }

  // 预候补单
  static preOrderAlternates(alternates) {
    return new Promise(async (resolve) => {
      const result = await Network.preOrderAlternates(alternates);
      if (result.result) {
        resolve({ result: true, preOrderInfo: result.data.preOrderInfo });
      } else {
        resolve({ result: false, err: result.err.msg });
      }
    });
  }

  // 预候补单(无菊花和提示)
  static preOrderAlternatesWithoutLoadingAndTips(alternates) {
    return new Promise(async (resolve) => {
      const result = await Network.preOrderAlternates(alternates, false);
      if (result.result) {
        resolve({ result: true, preOrderInfo: result.data.preOrderInfo });
      } else {
        resolve({ result: false, err: result.err.msg });
      }
    });
  }

  // 下候补单(带菊花)
  static orderAlternates(dateTime, alternates, persons, aiCheck) {
    return new Promise(async (resolve) => {
      const result = await Network.orderAlternates(dateTime, alternates, persons, aiCheck);
      if (result.result) {
        resolve({ result: true });
      } else {
        resolve({ result: false, err: result.err.msg });
      }
    });
  }

  // 下候补单(无菊花和提示)
  static orderAlternatesWithoutLoadingAndTips(dateTime, alternates, persons, aiCheck) {
    return new Promise(async (resolve) => {
      const result = await Network.orderAlternates(dateTime, alternates, persons, aiCheck, false);
      if (result.result) {
        resolve({ result: true });
      } else {
        resolve({ result: false, err: result.err.msg });
      }
    });
  }

  static queryAlternateQueue() {
    return new Promise(async (resolve) => {
      const result = await Network.queryAlternateQueue();
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

  static queryAlternateQueueWithoutLoadingAndTips() {
    return new Promise(async (resolve) => {
      const result = await Network.queryAlternateQueue(false);
      if (result.result) {
        resolve({ result: true, queueInfo: result.data.queueInfo });
      } else {
        resolve({ result: false, errCode: result.err.code, err: result.err.msg });
      }
    });
  }

  static cancelAlternateQueue() {
    return new Promise(async (resolve) => {
      const result = await Network.cancelAlternateQueue();
      if (result.result) {
        Core.ui.message.success('取消候补排队成功');
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

  static cancelAlternateQueueWithoutTip() {
    return new Promise(async (resolve) => {
      const result = await Network.cancelAlternateQueue();
      if (result.result) {
        resolve(true);
      } else {
        resolve(false);
      }
    });
  }

  static queryAlternateOrder() {
    return new Promise(async (resolve) => {
      const result = await Network.queryAlternateOrder();
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

  static queryAlternateOrderWithoutTip() {
    return new Promise(async (resolve) => {
      const result = await Network.queryAlternateOrder();
      if (result.result) {
        const orderInfo = result.data.orderInfo;
        resolve(orderInfo);
      }
    });
  }

  static cancelAlternateOrder(orderId) {
    return new Promise(async (resolve) => {
      const result = await Network.cancelAlternateOrder(orderId);
      if (result.result) {
        Core.ui.message.success('取消候补订单成功');
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
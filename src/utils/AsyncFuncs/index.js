import Network from '@/utils/Network';
import Core from '@/utils/Core';
class AsyncFuncs {
  // 查询车票(带菊花)
  static queryTickets(startStation, endStation, date, ticketType) {
    return new Promise((resolve, reject) => {
      Core.ui.loading.show();
      Network.queryTickets(startStation, endStation, date, ticketType, (ticketInfos) => {
        Core.ui.loading.close();
        resolve(ticketInfos);
      });
    });
  }
  // 查询车票(不带菊花)
  static queryTicketsWithoutLoading(startStation, endStation, date, ticketType) {
    return new Promise((resolve, reject) => {
      Network.queryTickets(startStation, endStation, date, ticketType, (ticketInfos) => {
        resolve(ticketInfos);
      });
    });
  }
  static queryPersons() {
    return new Promise((resolve, reject) => {
      Network.queryPersons('1', '100', (personInfos) => {
        resolve(personInfos);
      });
    })
  }
  static addPerson(name, sex, certCode, certNo, personCode) {
    return new Promise((resolve, reject) => {
      Network.addPerson(name, sex, certCode, certNo, personCode, (result) => {
        resolve(result);
      });
    });
  }
  static deletePerson(name, certType, certNo) {
    return new Promise((resolve, reject) => {
      Network.deletePerson(name, certType, certNo, (result) => {
        resolve(result);
      });
    });
  }
  // 下单(不带菊花)
  static orderTicketWithoutLoading(trainNo, trainId, trainCount, secStr, startStation, endStation, date, location, ticketType, personInfos, seatLocations) {
    return new Promise((resolve, reject) => {
      Network.orderTicket(trainNo, trainId, trainCount, secStr, startStation, endStation, date, location, ticketType, personInfos, seatLocations, (result) => {
        resolve(result);
      });
    });
  }
  // 下单(带菊花)
  static orderTicket(trainNo, trainId, trainCount, secStr, startStation, endStation, date, location, ticketType, personInfos, seatLocations) {
    return new Promise((resolve, reject) => {
      Core.ui.loading.show();
      Network.orderTicket(trainNo, trainId, trainCount, secStr, startStation, endStation, date, location, ticketType, personInfos, seatLocations, (result) => {
        Core.ui.loading.close();
        resolve(result);
      });
    });
  }
  // 查询队列(带菊花)
  static queryQueue() {
    return new Promise((resolve, reject) => {
      Core.ui.loading.show();
      Network.queryQueue((queueInfo) => {
        Core.ui.loading.close();
        // Succee时的提示在业务层解析数据后进行提示
        resolve({ result: true, queueInfo });
      }, (errCode, err) => {
        Core.ui.loading.close();
        // Error时做提示
        if (errCode === '0') {
          Core.ui.message.error(err);
        } else if (errCode === '1') {
          Core.ui.message.warn(err);
        }
        resolve({ result: false, errCode, err });
      });
    });
  }
  // 查询队列(不带菊花)
  static queryQueueWithoutLoading() {
    return new Promise((resolve, reject) => {
      Network.queryQueue((queueInfo) => {
        resolve({ result: true, queueInfo });
      }, (errCode, err) => {
        resolve({ result: false, errCode, err });
      });
    });
  }
  static cancelQueue() {
    return new Promise((resolve, reject) => {
      Network.cancelQueue((result, err) => {
        if (!result) {
          Core.ui.message.error(err);
        }
        resolve(result);
      });
    });
  }

  static cancelQueueWithoutTip() {
    return new Promise((resolve, reject) => {
      Network.cancelQueue((result, err) => {
        resolve(result);
      });
    });
  }
  static queryOrder() {
    return new Promise((resolve, reject) => {
      Network.queryOrder((result) => {
        resolve(result);
      });
    });
  }
  static cancelOrder(orderId) {
    return new Promise((resolve, reject) => {
      Network.cancelOrder(orderId, (result) => {
        resolve(result);
      });
    });
  }
  static queryStationStops(trainNo, startStation, endStation, date) {
    return new Promise((resolve, reject) => {
      Network.queryStationStops(trainNo, startStation, endStation, date, (result) => {
        resolve(result);
      });
    });
  }
  static destroy() {
    return new Promise((resolve, reject) => {
      Network.destroy((result) => {
        resolve(result);
      });
    });
  }
}

export default AsyncFuncs;
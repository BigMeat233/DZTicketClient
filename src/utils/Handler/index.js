class Handler {
  static toTicketDisplayInfo(ticketInfo) {
    return {
      trainCount: ticketInfo.trainCount,
      date: ticketInfo.date,
      time: ticketInfo.startT + ' - ' + ticketInfo.endT + ' | ' + ticketInfo.duration,
      station: ticketInfo.startStr + ' - ' + ticketInfo.endStr,
      superSeat: ticketInfo.superSeat,// 商务座
      firSeat: ticketInfo.firSeat,// 一等座
      secSeat: ticketInfo.secSeat,// 二等座
      superBed: ticketInfo.superBed,// 动卧
      superSoftBed: ticketInfo.superSoftBed,// 高级软卧
      softBed: ticketInfo.softBed,// 软卧
      softSeat: ticketInfo.softSeat,// 软座
      hardBed: ticketInfo.hardBed,// 硬卧
      hardSeat: ticketInfo.hardSeat,// 硬座
      noSeat: ticketInfo.noSeat,// 无座
      trainId: ticketInfo.trainId,
      location: ticketInfo.location,
      startS: ticketInfo.startS,
      endS: ticketInfo.endS,
      startN: ticketInfo.startStr,
      endN: ticketInfo.endStr,
      secStr: ticketInfo.secStr,
      trainNo: ticketInfo.trainNo,
      state: ticketInfo.state
    };
  }
  static toTrainInfo(ticketDisplayInfo) {
    let trainId = ticketDisplayInfo.trainId;
    let trainNo = ticketDisplayInfo.trainNo;
    let trainCount = ticketDisplayInfo.trainCount;
    let location = ticketDisplayInfo.location;
    let secStr = ticketDisplayInfo.secStr;
    let startS = ticketDisplayInfo.startS;
    let endS = ticketDisplayInfo.endS;
    let startN = ticketDisplayInfo.startN;
    let endN = ticketDisplayInfo.endN;
    let date = ticketDisplayInfo.date.substring(0, 4) + '-' + ticketDisplayInfo.date.substring(4, 6) + '-' + ticketDisplayInfo.date.substring(6, 8);
    let superSeat = ticketDisplayInfo.superSeat;// 商务座
    let firSeat = ticketDisplayInfo.firSeat;// 一等座
    let secSeat = ticketDisplayInfo.secSeat;// 二等座
    let superBed = ticketDisplayInfo.superBed;// 动卧
    let superSoftBed = ticketDisplayInfo.superSoftBed;// 高级软卧
    let softBed = ticketDisplayInfo.softBed;// 软卧
    let softSeat = ticketDisplayInfo.softSeat;// 软座
    let hardBed = ticketDisplayInfo.hardBed;// 硬卧
    let hardSeat = ticketDisplayInfo.hardSeat;// 硬座
    let noSeat = ticketDisplayInfo.noSeat;// 无座

    return {
      trainId,
      trainNo,
      trainCount,
      location,
      secStr,
      startS,
      startN,
      endS,
      endN,
      date,
      superSeat,
      firSeat,
      secSeat,
      superBed,
      superSoftBed,
      softBed,
      softSeat,
      hardBed,
      hardSeat,
      noSeat
    };
  }
  static getOrderPersonInfo(trainInfos, personInfos) {
    trainInfos = trainInfos.map((trainInfo) => {
      trainInfo['9'] = this.getAmount(trainInfo.superSeat);
      trainInfo['P'] = this.getAmount(trainInfo.superSeat);
      trainInfo['M'] = this.getAmount(trainInfo.firSeat);
      trainInfo['O'] = this.getAmount(trainInfo.secSeat);
      trainInfo['6'] = this.getAmount(trainInfo.superSoftBed);
      trainInfo['F'] = this.getAmount(trainInfo.superBed);
      trainInfo['4'] = this.getAmount(trainInfo.softBed);
      trainInfo['3'] = this.getAmount(trainInfo.hardBed);
      trainInfo['2'] = this.getAmount(trainInfo.softSeat);
      trainInfo['1'] = this.getAmount(trainInfo.hardSeat);
      return trainInfo;
    });
    let persons = [];
    let trainInfo = null;
    for (let i = 0; i < trainInfos.length; i++) {
      trainInfo = trainInfos[i];
      personInfos.forEach((personInfo) => {
        for (let j = 0; j < personInfo.seatCodes.length; j++) {
          let seatCode = personInfo.seatCodes[j];
          if (trainInfo[seatCode] >= 1) {
            personInfo.seatCode = seatCode;
            trainInfo[seatCode] -= 1;
            persons.push(personInfo);
            break;
          }
        }
      });
      // 两个人买不到同一辆车 -> 清空数据尝试下一辆车
      if (persons.length !== personInfos.length) {
        persons = [];
        trainInfo = null;
        continue;
      }
      // 两个人都有票 -> 直接返回,不执行后续的循环
      else {
        return { trainInfo, persons };
      }
    }
    // 两个人无法买到同一辆车 -> 清空数据并返回
    if (persons.length !== personInfos.length) {
      persons = [];
      trainInfo = null;
    }
    return { trainInfo, persons };
  }

  static getAmount(amountStr) {
    if (amountStr === '无' || amountStr === '') {
      return 0;
    } else if (amountStr === '有') {
      return 10;
    } else {
      return parseInt(amountStr);
    }
  }
}

export default Handler;
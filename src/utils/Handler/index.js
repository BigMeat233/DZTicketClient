import Macro from '@/utils/Macro';

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
    let time = ticketDisplayInfo.time;
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
      time,
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

  static updatePersons(oldPersonInfos, newPersonInfos) {
    const persons = newPersonInfos.map((newPersonInfo) => {
      let isExisted = false;
      for (let i = 0; i < oldPersonInfos.length; i++) {
        let oldPersonInfo = oldPersonInfos[i];
        if (newPersonInfo.certNo === oldPersonInfo.certNo) {
          isExisted = true;
          return {
            isSelected: oldPersonInfo.isSelected,
            name: newPersonInfo.name,
            certCode: newPersonInfo.certCode,
            certType: newPersonInfo.certName,
            certNo: newPersonInfo.certNo,
            typeCode: newPersonInfo.typeCode,
            typeName: newPersonInfo.typeName,
            seatCodes: oldPersonInfo.seatCodes,
            phone: newPersonInfo.phone
          };
        }
      }
      if (!isExisted) {
        return {
          isSelected: false,
          name: newPersonInfo.name,
          certCode: newPersonInfo.certCode,
          certType: newPersonInfo.certName,
          certNo: newPersonInfo.certNo,
          typeCode: newPersonInfo.typeCode,
          typeName: newPersonInfo.typeName,
          seatCodes: []
        };
      }
    });
    return persons;
  }

  static getSeatLocation(persons) {
    // 当每个人都只有一种座位类型时展示选座
    // 选中的人
    const selectedPersons = persons.filter((person) => person.isSelected);
    const defaultSeatLocation = {
      isShow: false,
      selectedLocations: [],
      selectorItems: [],
      selectorLimit: 0,
      placeholder: ''
    };
    // 1. 检查每个人的座位类型
    let isUniqueSeatType = true;
    for (let i = 0; i < selectedPersons.length; i++) {
      const selectedPerson = selectedPersons[0]
      if (selectedPerson.seatCodes.length !== 1) {
        isUniqueSeatType = false;
        break;
      }
    }
    if (!isUniqueSeatType) {
      // 此时无法选座
      return defaultSeatLocation;
    }
    // 2. 每个人的座位类型唯一,将计算公共座位的类型
    let commonSeatCodes = [];
    if (selectedPersons.length !== 0) {
      // 求选中人的座位交集
      const seatCodesArr = selectedPersons.map((selectedPerson) => selectedPerson.seatCodes);
      commonSeatCodes = seatCodesArr.reduce((result, seatCodes) => seatCodes.filter((seatCode) => result.indexOf(seatCode) !== -1));
      // 过滤可选座的类型(只有商务座 一等座 二等座可以选座)
      commonSeatCodes = commonSeatCodes.filter((commonSeatCode) => Macro.seatLocations.findIndex((seatLocation) => seatLocation.seatCode === commonSeatCode) !== -1);
    }
    // 如果公共座位类型不为1个,此时不可以选座
    if (commonSeatCodes.length !== 1) {
      // 此时无法选座
      return defaultSeatLocation;
    }
    // 公共座位类型为1个时可以选座
    else {
      // 此时可以选座
      const seatCode = commonSeatCodes[0];
      const seatLocation = Macro.seatLocations.find((seatLocation) => seatLocation.seatCode === seatCode);
      return {
        isShow: true,
        selectorItems: seatLocation.locations,
        selectorLimit: selectedPersons.length,
        placeholder: `请选择[${seatLocation.seatName}]的位置(空余座位少时请不要选座)`
      };
    }
  }
}

export default Handler;
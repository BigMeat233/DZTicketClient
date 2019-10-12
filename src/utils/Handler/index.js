import Macro from '@/utils/Macro';

class Handler {
  static toTicketDisplayInfo(ticketInfo) {
    // 构造座位票数
    const seatInfos = {};
    const seatTypeKeys = Object.keys(Macro.seatTypeKeyMap);
    seatTypeKeys.forEach((seatTypeKey) => seatInfos[seatTypeKey] = ticketInfo[seatTypeKey]);
    return {
      trainCount: ticketInfo.trainCount,
      date: ticketInfo.date,
      time: ticketInfo.startT + ' - ' + ticketInfo.endT + ' | ' + ticketInfo.duration,
      station: ticketInfo.startStr + ' - ' + ticketInfo.endStr,
      ...seatInfos,
      trainId: ticketInfo.trainId,
      location: ticketInfo.location,
      startS: ticketInfo.startS,
      endS: ticketInfo.endS,
      startN: ticketInfo.startStr,
      endN: ticketInfo.endStr,
      startCode: ticketInfo.startCode,
      endCode: ticketInfo.endCode,
      seatTypeCodes: ticketInfo.seatTypeCodes,
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
    let startCode = ticketDisplayInfo.startCode;
    let endCode = ticketDisplayInfo.endCode;
    let seatTypeCodes = ticketDisplayInfo.seatTypeCodes;
    // 构造座位票数
    const seatInfos = {};
    const seatTypeKeys = Object.keys(Macro.seatTypeKeyMap);
    seatTypeKeys.forEach((seatTypeKey) => seatInfos[seatTypeKey] = ticketDisplayInfo[seatTypeKey]);

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
      ...seatInfos,
      startCode,
      endCode,
      seatTypeCodes,
    };
  }
  static getAlternates(type, trainInfos, personInfos) {
    // type single/train/seat
    // 按照优先级找出personInfos中座位的交集
    const selectedPersons = personInfos;
    const seatCodesArr = selectedPersons.map((selectedPerson) => selectedPerson.seatCodes);
    const commonSeatCodes = seatCodesArr.reduce((result, seatCodes) => seatCodes.filter((seatCode) => result.indexOf(seatCode) !== -1));
    let commonSeatCode = '';
    if (commonSeatCodes.length === 0) {
      return [];
    } else if (commonSeatCodes.length === 1 && type === 'seat') {
      // 只有1个共同座位时,如果选择seat模式将强制降级为train模式
      if (type === 'seat') { type = 'train' }
    }
    // 设置seat模式和single模式使用的座位码
    commonSeatCode = commonSeatCodes[0];

    // 单车次座次模式(single)
    if (type === 'single') {
      for (let i = 0; i < trainInfos.length; i++) {
        const trainInfo = trainInfos[i];
        const key = Macro.seatTypeCodeMap[commonSeatCode].seatTypeKey;
        if (trainInfo[key] === '候补') {
          return [{
            dateStr: trainInfo.date,
            trainCount: trainInfo.trainCount,
            seatTypeCode: commonSeatCode,
            trainNo: trainInfo.trainNo,
            secStr: trainInfo.secStr,
            trainInfo,
          }];
        }
      }
      // 如果循环转出来了则证明没有找到
      return [];
    }
    // 多车次优先模式(train)
    else if (type === 'train') {
      const alternates = [];
      for (let i = 0; i < trainInfos.length; i++) {
        const trainInfo = trainInfos[i];
        const key = Macro.seatTypeCodeMap[commonSeatCode].seatTypeKey;
        if (trainInfo[key] === '候补') {
          alternates.push({
            dateStr: trainInfo.date,
            trainCount: trainInfo.trainCount,
            seatTypeCode: commonSeatCode,
            trainNo: trainInfo.trainNo,
            secStr: trainInfo.secStr,
            trainInfo,
          });
          if (alternates.length === 2) {
            return alternates;
          }
        }
      }
      // 如果循环转出来了则直接返回alternates
      return alternates;
    }
    // 多座次优先模式(seat)
    else if (type === 'seat') {
      let alternates = [];
      for (let i = 0; i < trainInfos.length; i++) {
        const trainInfo = trainInfos[i];
        const key1 = Macro.seatTypeCodeMap[commonSeatCodes[0]].seatTypeKey;
        const key2 = Macro.seatTypeCodeMap[commonSeatCodes[1]].seatTypeKey;

        if (trainInfo[key1] === '候补' && trainInfo[key2] === '候补') {
          alternates = [
            {
              dateStr: trainInfo.date,
              trainCount: trainInfo.trainCount,
              seatTypeCode: commonSeatCodes[0],
              trainNo: trainInfo.trainNo,
              secStr: trainInfo.secStr,
              trainInfo,
            }, {
              dateStr: trainInfo.date,
              trainCount: trainInfo.trainCount,
              seatTypeCode: commonSeatCodes[1],
              trainNo: trainInfo.trainNo,
              secStr: trainInfo.secStr,
              trainInfo,
            },
          ];
          return alternates;
        }
      }
      // 如果循环转出来了说明没有同时满足两个座位的车次
      // 降级为train模式
      for (let i = 0; i < trainInfos.length; i++) {
        const trainInfo = trainInfos[i];
        const key = Macro.seatTypeCodeMap[commonSeatCode].seatTypeKey;
        if (trainInfo[key] === '候补') {
          alternates.push({
            dateStr: trainInfo.date,
            trainCount: trainInfo.trainCount,
            seatTypeCode: commonSeatCode,
            trainNo: trainInfo.trainNo,
            secStr: trainInfo.secStr,
            trainInfo,
          });
          if (alternates.length === 2) {
            return alternates;
          }
        }
      }
      return alternates;
    }
  }

  static getOrderPersonInfo(trainInfos, personInfos) {
    trainInfos = trainInfos.map((trainInfo) => {
      const seatTypeKeys = Object.keys(Macro.seatTypeKeyMap);
      seatTypeKeys
        .filter((seatTypeKey) => seatTypeKey !== 'noSeat' && seatTypeKey !== 'otherSeat')
        .forEach((seatTypeKey) => {
          const seatTypeInfo = Macro.seatTypeKeyMap[seatTypeKey];
          trainInfo[seatTypeInfo.seatTypeCode] = this.getAmount(trainInfo[seatTypeKey]);
        });
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
    if (amountStr === '无' || amountStr === '' || amountStr === '候补') {
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
            phone: newPersonInfo.phone,
            secStr: newPersonInfo.secStr
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
          seatCodes: [],
          phone: newPersonInfo.phone,
          secStr: newPersonInfo.secStr,
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
      const selectedPerson = selectedPersons[i]
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
class Handler {
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
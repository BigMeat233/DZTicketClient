class Macro {
  constructor() {
    this.seatTypes = [
      { code: 'P', desc: '特等座', key: 'superSeat' },
      { code: '9', desc: '商务座', key: 'commSeat' },
      { code: 'M', desc: '一等座', key: 'firSeat' },
      { code: 'O', desc: '二等座', key: 'secSeat' },
      { code: 'A', desc: '高级动卧', key: 'superSuperBed' },
      { code: 'F', desc: '动卧', key: 'superBed' },
      { code: 'I', desc: '一等卧', key: 'firBed' },
      { code: 'J', desc: '二等卧', key: 'secBed' },
      { code: '6', desc: '高级软卧', key: 'superSoftBed' },
      { code: '4', desc: '软卧', key: 'softBed' },
      { code: '3', desc: '硬卧', key: 'hardBed' },
      { code: '2', desc: '软座', key: 'softSeat' },
      { code: '1', desc: '硬座', key: 'hardSeat' },
      { code: 'WZ', desc: '无座', key: 'noSeat' },
      { code: 'OT', desc: '其他', key: 'otherSeat' },
      { code: '5', desc: '包厢硬卧', key: '' },
      { code: '7', desc: '一等软座', key: '' },
      { code: '8', desc: '二等软座', key: '' },
      { code: 'B', desc: '混编硬座', key: '' },
      { code: 'C', desc: '混编硬卧', key: '' },
      { code: 'E', desc: '特等软座', key: '' },
      { code: 'H', desc: '一人软包', key: '' },
      { code: 'K', desc: '混编软座', key: '' },
      { code: 'L', desc: '混编软卧', key: '' },
      { code: 'Q', desc: '观光座', key: '' },
      { code: 'S', desc: '一等包座', key: '' },
    ];

    this.seatTypeCodeMap = {};
    this.seatTypeKeyMap = {};
    this.seatTypes.forEach((seatType) => {
      this.seatTypeCodeMap[seatType.code] = {
        seatTypeCode: seatType.code,
        seatTypeName: seatType.desc,
        seatTypeKey: seatType.key
      };

      if (seatType.key !== '') {
        this.seatTypeKeyMap[seatType.key] = {
          seatTypeCode: seatType.code,
          seatTypeName: seatType.desc,
          seatTypeKey: seatType.key
        };
      }
    });
    this.alternateTypes = [
      { label: '单车次座次模式(成功率:高,候补类型:至多1个车次,1个位次)', value: 'single' },
      { label: '多车次优先模式(成功率:中,候补类型:至多2个车次,1个位次)', value: 'train' },
      { label: '多座次优先模式(成功率:低,候补类型:至多1个车次,2个位次)', value: 'seat' },
    ];
    this.certTypes = [
      { label: '中国居民身份证', value: '1' },
      { label: '港澳居民来往内地通行证', value: 'C' },
      { label: '台湾居民来往大陆通行证', value: 'G' },
      { label: '护照', value: 'B' },
      { label: '外国人永久居留身份证', value: 'H' }
    ];
    this.seatLocations = [
      {
        seatCode: '9',
        seatName: '商务座',
        locations: [
          { label: '1A - 靠窗', value: '1A' },
          { label: '1C - 靠过道', value: '1C' },
          { label: '1F - 靠窗和过道', value: '1F' },
          { label: '2A - 靠窗', value: '2A' },
          { label: '2C - 靠过道', value: '2C' },
          { label: '2F - 靠窗和过道', value: '2F' },
        ]
      },
      {
        seatCode: 'P',
        seatName: '特等座',
        locations: [
          { label: '1A - 靠窗', value: '1A' },
          { label: '1C - 靠过道', value: '1C' },
          { label: '1F - 靠窗和过道', value: '1F' },
          { label: '2A - 靠窗', value: '2A' },
          { label: '2C - 靠过道', value: '2C' },
          { label: '2F - 靠窗和过道', value: '2F' },
        ]
      }, {
        seatCode: 'M',
        seatName: '一等座',
        locations: [
          { label: '1A - 靠窗', value: '1A' },
          { label: '1C - 靠过道', value: '1C' },
          { label: '1D - 靠过道', value: '1D' },
          { label: '1F - 靠窗', value: '1F' },
          { label: '2A - 靠窗', value: '2A' },
          { label: '2C - 靠过道', value: '2C' },
          { label: '2D - 靠过道', value: '2D' },
          { label: '2F - 靠窗', value: '2F' },
        ]
      }, {
        seatCode: 'O',
        seatName: '二等座',
        locations: [
          { label: '1A - 靠窗', value: '1A' },
          { label: '1B', value: '1B' },
          { label: '1C - 靠过道', value: '1C' },
          { label: '1D - 靠过道', value: '1D' },
          { label: '1F - 靠窗', value: '1F' },
          { label: '2A - 靠窗', value: '2A' },
          { label: '2B', value: '2B' },
          { label: '2C - 靠过道', value: '2C' },
          { label: '2D - 靠过道', value: '2D' },
          { label: '2F - 靠窗', value: '2F' },
        ]
      }
    ];
  }
}

let singleton = new Macro();
export default singleton;
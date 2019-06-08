class Macro {
  constructor() {
    this.seatTypes = [
      { label: '商务座', value: '9' },
      { label: '特等座', value: 'P' },
      { label: '一等座', value: 'M' },
      { label: '二等座', value: 'O' },
      { label: '高级软卧', value: '6' },
      { label: '动卧', value: 'F' },
      { label: '高级动卧', value: 'A' },
      { label: '软卧', value: '4' },
      { label: '硬卧', value: '3' },
      { label: '软座', value: '2' },
      { label: '硬座', value: '1' }
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
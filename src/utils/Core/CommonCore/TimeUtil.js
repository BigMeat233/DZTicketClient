/**
 * 时间处理工具
 *
 * Made By Douzi＂
 */

// 时间格式化  (时间格式字符串) => {时间格式化结果}
Date.prototype.format = function(fmt) {
  var o = {
    'M+': this.getMonth() + 1, // 月份
    'd+': this.getDate(), // 日
    'h+': this.getHours() % 12 == 0 ? 12 : this.getHours() % 12, // 小时
    'H+': this.getHours(), // 小时
    'm+': this.getMinutes(), // 分
    's+': this.getSeconds(), // 秒
    'q+': Math.floor((this.getMonth() + 3) / 3), // 季度
    'S': this.getMilliseconds() // 毫秒
  }
  var week = {
    '0': '/u65e5',
    '1': '/u4e00',
    '2': '/u4e8c',
    '3': '/u4e09',
    '4': '/u56db',
    '5': '/u4e94',
    '6': '/u516d'
  }
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  if (/(E+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? '/u661f/u671f' : '/u5468') : '') + week[this.getDay() + ''])
  }
  for (var k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
    }
  }
  return fmt
}

function TimeUtil() {

  this.getCurrentTime = _getCurrentTime;
  this.timeInterval = _timeInterval;
  this.format = _format;
  this.getTimestamp = _getTimestamp;

  function _getCurrentTime() {
    var currentDate = new Date()
    return currentDate.toLocaleString()
  }

  // 获取时间差 入参为Date类型 单位:秒
  function _timeInterval(startDate, endDate) {
    var interval = (endDate - startDate) / 1000
    return parseInt(interval)
  }

  // 时间格式化 入参为Date类型
  function _format(date, fmt) {
    if (date == null) {
      return ''
    } else {
      return date.format(fmt)
    }
  }

  // 获取时间戳
  function _getTimestamp(date) {
    var timestamp = date ? date.getTime() : new Date().getTime()
    return timestamp
  }
}

var instance = new TimeUtil();
export default instance;
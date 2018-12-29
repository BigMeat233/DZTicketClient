/**
 * 数学工具
 *
 * Made By Douzi＂
 */

function MathUtil() {
  //共有方法
  this.getRandomStr = getRandomStr;

  //获取随机数(位数)  PS:前面的不足位将补0
  function getRandomStr(bit) {
    var random = parseInt(Math.random() * Math.pow(10, bit)).toString();
    var fixStr = '';
    if (random.length < bit) {
      for (var i = 0; i < (bit - random.length); i++) {
        fixStr = fixStr + '0';
      }
    }
    random = fixStr + random;
    return random.toString();
  }
}

var instance = new MathUtil();
export default instance;
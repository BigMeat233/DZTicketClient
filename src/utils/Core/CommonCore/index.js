/**
 * 通用工具
 *
 * Made By Douzi＂
 */

import TimeUtil from './TimeUtil.js';
import CryptoUtil from './CryptoUtil.js';
import MathUtil from './MathUtil.js';
import FileUtil from './FileUtil.js';

var instance = {
  time: TimeUtil,
  crypto: CryptoUtil,
  math: MathUtil,
  file: FileUtil,
};

export default instance;
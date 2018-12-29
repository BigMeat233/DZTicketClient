/**
 * UI核心
 *
 * Made By Douzi＂
 */

import BoxUtil from './BoxUtil.js';
import MessageUtil from './MessageUtil.js';
import LoadingUtil from './LoadingUtil.js';

import Vue from 'vue';
import ElementUI from 'element-ui';

Vue.use(ElementUI);

import 'element-ui/lib/theme-chalk/index.css';

function UICore() {
  this.box = BoxUtil;
  this.message = MessageUtil;
  this.loading = LoadingUtil;
}

var instance = new UICore();
export default instance;
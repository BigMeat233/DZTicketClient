/**
 * 注入器核心
 *
 * Made By Douzi＂
 */

import Vue from 'vue';

function MixinCore() {

  this.load = load;

  function load(obj) {
    Vue.mixin(obj);
  }
}

var instance = new MixinCore();
export default instance;
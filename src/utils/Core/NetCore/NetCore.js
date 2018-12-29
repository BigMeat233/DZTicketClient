/**
 * 网络请求核心
 *
 * Made By Douzi＂
 */

import Vue from 'vue';
import VueResource from 'vue-resource';
import RequestManager from './RequestManager.js';

Vue.use(VueResource);
Vue.http.options.emulateJSON = true;

class NetCore {
  constructor() {
    this.requestManagerMap = {};
  }

  create(cfg) {
    var requestManager = new RequestManager(cfg);
    this.requestManagerMap[cfg.id] = requestManager;
    return requestManager;
  }

  getManager(id) {
    var manager = this.requestManagerMap[id];
    return manager;
  }
}

var instance = new NetCore();

export default instance;
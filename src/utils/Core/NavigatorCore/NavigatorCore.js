/**
 * 导航控制核心
 *
 * Made By Douzi＂
 */

import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

function NavigatorCore() {
  var _router = null;
  var _self = this;

  this.router = null;
  this.create = _create;
  this.push = _push;
  this.replace = _replace;
  this.go = _go;
  this.getParams = _getParams;

  function _create(routerCfg) {
    _router = new VueRouter(routerCfg);
    _self.router = _router;
  }

  function _push(location) {
    if (!_router) {
      _log('未构建路由表');
    }
    _router.push(location);
  }

  function _replace(location) {
    if (!_router) {
      _log('未构建路由表');
    }
    _router.replace(location);
  }

  function _go(n) {
    if (!_router) {
      _log('未构建路由表');
    }
    _router.go(n);
  }

  function _getParams(vm) {
    if (!_router) {
      _log('未构建路由表');
    }
    return vm.$route.params;
  }

  function _log(msg) {
    console.log('NavigatorCore -> ' + msg);
  }
}

var instance = new NavigatorCore();
export default instance;
/**
 * 请求管理器
 *
 * Made By Douzi＂
 */

import Vue from 'vue'

function RequestManager(cfg) {
  var _id = cfg.id;
  var _baseUrl = cfg.baseUrl;
  var _timeout = cfg.timeout;
  var _interceptor = cfg.interceptor ? cfg.interceptor : function(params) {};

  this.post = _post;
  this.get = _get;

  var _options = {
    timeout: _timeout,
  }

  function _get(funcName, params, success, failure) {
    var requestUrl = _baseUrl + funcName;
    var requestData = _interceptor(params);
    console.log('GET -> ' + requestUrl);
    Vue.http
      .get(requestUrl, requestData, _options)
      .then((response) => {
        success(response.body);
      }, (err) => {
        failure(err);
      });
  }

  function _post(funcName, params, success, failure) {
    var requestUrl = _baseUrl + funcName;
    var requestData = _interceptor(params);
    console.log('POST -> ' + requestUrl);
    Vue.http
      .post(requestUrl, requestData, _options)
      .then((response) => {
        success(response.body);
      }, (err) => {
        failure(err);
      });
  }
}

export default RequestManager
import Core from '@/utils/Core';

class Http {
  constructor() {
    let option = {
      id: 'REQ_01',
      baseUrl: 'http://127.0.0.1:3000',
      // baseUrl: 'http://t.og.gl',
      timeout: 30000,
      interceptor: (params) => { return { MESSAGE: JSON.stringify(params) } },
    };
    this._request = Core.net.create(option);
  }

  get(funcName, params, success, failure) {
    this._request.get(funcName, params, success, failure);
  }

  post(funcName, params, success, failure) {
    this._request.post(funcName, params, success, failure);
  }
}

var instance = new Http();
export default instance;
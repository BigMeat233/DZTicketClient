import Core from '@/utils/Core';

class Http {
  constructor() {
    let option = {
      id: 'REQ_01',
      baseUrl: 'http://127.0.0.1:18234',
      // baseUrl: 'http://t.og.gl',
      timeout: 30000,
      interceptor: (params) => { return { MESSAGE: JSON.stringify(params) } },
    };
    this._request = Core.net.create(option);
  }

  get(funcName, params, options) {
    const opt = options || { isLoading: true };
    return new Promise((resolve) => {
      opt.isLoading && Core.ui.loading.show();
      this._request.get(funcName, params, (data) => {
        opt.isLoading && Core.ui.loading.close();
        resolve({ result: true, data });
      }, (err) => {
        opt.isLoading && Core.ui.loading.close();
        resolve({ result: false, err });
      });
    });
  }

  post(funcName, params, options) {
    const opt = options || { isLoading: true };
    return new Promise((resolve) => {
      opt.isLoading && Core.ui.loading.show();
      this._request.post(funcName, params, (data) => {
        opt.isLoading && Core.ui.loading.close();
        resolve({ result: true, data });
      }, (err) => {
        opt.isLoading && Core.ui.loading.close();
        resolve({ result: false, err });
      });
    });
  }
}

var instance = new Http();
export default instance;
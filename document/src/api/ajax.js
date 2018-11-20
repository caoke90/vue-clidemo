//请求失败后的统一拦截，以及ajax的基本设置
import axios from 'axios';
import qs from 'qs';
import Vue from 'vue';
function cleanRequest(req) {
  for (const i in req) {
    /* eslint guard-for-in: 0 */
    if (req[i] !== 0 && !req[i]) {
      delete req[i];
    }
  }
}

axios.defaults.withCredentials = true;
axios.defaults.xsrfCookieName = null;
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

axios.defaults.baseURL=process.env.baseURL||"/";
Vue.prototype.$http = axios;
Vue.http = axios;

axios.interceptors.request.use(
  function (request) {
    const params = request.params;
    const body = request.data;
    if (params) {
      cleanRequest(params);
    }
    if (body) {
      cleanRequest(body);
      if (body.append) {
      } else {
        // 普通表单
        request.data = qs.stringify(body);
      }
    }
    return request;
  },
  function (error) {
    return Promise.reject(error);
  }
);

// Add a response interceptor
axios.interceptors.response.use(
  function (response) {

    return response;
  },
  function (error) {
    // Do something with response error
    return Promise.reject(error);
  }
);
export default axios;

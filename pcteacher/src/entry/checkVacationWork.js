// 引入公共配置1
import Vue from '../common/pcbase';
import '@babel/polyfill';
import 'es6-promise/auto';

// 项目的入口
import App from '../views/checkVacationWork.vue';

// 引入element ui
Vue.prototype.$ELEMENT = { size: 'small', zIndex: 3000 };
import { DatePicker, Message } from 'element-ui';
Vue.prototype.$message = Message;
Vue.use(DatePicker);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  components: { App },
  template: ' <div><mv-modal></mv-modal><App/></div>'
})



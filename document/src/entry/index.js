//引入公共配置1
import Vue from '../common/pcbase';

import router from '../router'
/*
  注册 组件容器
* */
Vue.component('card', require('../components/cardsync.vue'));


// 导入elm ui

import { Menu,MenuItem,Submenu} from 'element-ui';
Vue.use( Menu);
Vue.use( MenuItem);
Vue.use( Submenu);
Vue.prototype.$ELEMENT = { size: 'small' }
//项目的入口
import App from '../views/app'

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: ' <div><mv-modal></mv-modal><App/></div>'
})

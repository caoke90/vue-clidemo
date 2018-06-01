//引入公共配置1
import Vue from '../common/pcbase';

import router from '../router'
/*
  注册 组件容器
* */
Vue.component('card', require('../components/card.vue'));


// 导入elm ui
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI, { size: 'small' });

//项目的入口
import App from '../views/app'
import A from '../api/a'

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: ' <div><mv-modal></mv-modal><App/></div>'
})

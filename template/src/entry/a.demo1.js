//引入公共配置
import Vue from '../common/pcbase';
/*
  2、注册 组件容器
  展示组件的容器
* */
Vue.component('card', require('../components/card.vue'));


//项目的入口
import App from '../views/demo1'

/* eslint-disable no-new */
new Vue({
  el: '#app',
  components: { App },
  template: ' <div><mv-modal></mv-modal><App/></div>'
})

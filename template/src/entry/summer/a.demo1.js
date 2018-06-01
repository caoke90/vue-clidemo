//引入公共配置
import Vue from '@/common/pcbase';

/*
  注册 组件容器
* */
Vue.component('card', require('@/marvel/card.vue'));


//导入elm ui
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI, { size: 'small' });

//项目的入口
import App from '@/views/summer/demo1'

/* eslint-disable no-new */
new Vue({
  el: '#app',
  components: { App },
  template: ' <div><mv-modal></mv-modal><App/></div>'
})

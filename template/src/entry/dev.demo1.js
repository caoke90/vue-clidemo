//pc端：使用路由、图片懒加载、element-ui、服务、组件
import Vue from 'vue'

/*
* 图片懒加载*/
Vue.component('mv-img', require('../marvel/img.vue'));
/*
  1、注册 服务容器 mv-modal
  增加服务的接口
* */

Vue.component('mv-modal', require('../marvel/modal.vue'));

/*
  2、注册 组件容器
  展示组件的容器
* */
Vue.component('card', require('../marvel/card.vue'));

/*
  3、设置 当前项目用到的ui组件 2|3|10
  为了减少打包压缩文件数量
* */
const component = require.context('../marvel/cards', false, /\.vue$/);
const requireAll = context => context.keys().map(context);
requireAll(component).forEach((card) => {
  const name = (card.name || /(\S+\/)(\S+)\.vue/.exec(card.hotID)[2]).toLowerCase();
  Vue.component(name, card);
})

//项目公用的
import '../common/pcbase.css';
//1、导入elm ui
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI, { size: 'small' });

//项目的入口
import App from '../views/demo1'

/* eslint-disable no-new */
new Vue({
  el: '#app',
  components: { App },
  template: ' <div><mv-modal></mv-modal><App/></div>'
})

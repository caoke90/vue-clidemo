import 'es6-promise/auto';
import 'core-js/es7/array'
// pc端：使用路由、图片懒加载、element-ui、服务、组件
import Vue from 'vue'

// 修改移动端设备延迟300ms

import fastclick from 'fastclick'
fastclick.attach(document.body)


/*
* 图片懒加载
*/
Vue.component('mv-img', require('../marvel/img.vue'));

/*
* 触碰区域
* */
Vue.directive('press', require('../marvel/v-press'));

/*
  1、注册 服务容器 mv-modal
  增加服务的接口
* */

Vue.component('mv-modal', require('../marvel/modal.vue'));


// 项目公用的
require('./base.css');
require('./750rem.css');

require('../common/js/jsError');
require('../common/js/task');


export default Vue;

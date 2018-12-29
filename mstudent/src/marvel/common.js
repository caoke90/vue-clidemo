/*
* 相当于全局变量
* 通信bus
*/
//组件公共样式
require('../common/base.css');
require('../common/750rem.css');

import Vue from 'vue';


//组件公共的通信方式
import Bus from './bus'
export default Bus;

import modal from './modal.vue';
//定义一个公共dom层
new Vue({
  el: document.body.insertBefore(document.createElement("div"),document.body.childNodes[0]),
  components:{
    'mv-modal':modal
  },
  template: '<mv-modal></mv-modal>'
})

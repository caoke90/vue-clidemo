//引入公共配置1
import Vue from '../common/pcbase';
import axios from 'axios';

/*
  注册 组件容器
* */
Vue.component('card',require('../components/card.vue'));


import Router from 'vue-router'

// 同步页面
const index = r => r(require('@/views/index.vue'))

Vue.use(Router)

// 导入elm ui
import { Menu,MenuItem,Submenu,Breadcrumb,BreadcrumbItem} from 'element-ui';
Vue.use( Menu);
Vue.use( MenuItem);
Vue.use( Submenu);
Vue.use( Breadcrumb);
Vue.use( BreadcrumbItem);
Vue.prototype.$ELEMENT = { size: 'small' }
//项目的入口
import App from '../views/app'

if(window.bconfig&&window.bconfig.routes){
  window.binit(window.bconfig)
}else{
  axios.get('mdconfig.json').then(function (resp) {
    window.bconfig=resp.data
    window.binit(window.bconfig)
  })
}

window.binit=function (bconfig) {
  const routersCache=[]
  bconfig.routes.forEach(function (item) {
    const {path,name,card_group,leftmenu}=item;
    if(item.mheader===true){
      item.mheader=0;
    }
    if(item.leftmenu===true){
      item.leftmenu=0;
    }
    if(Object.prototype.toString.call(item.mheader)=='[object Number]'){
      item.mheader=bconfig.mheader[item.mheader]
    }
    if(Object.prototype.toString.call(item.leftmenu)=='[object Number]'){
      item.leftmenu=bconfig.leftmenu[item.leftmenu]
    }
    routersCache.push({
      name:name,
      path:path,
      component: index,
      meta:{
        mheader:item.mheader,
        leftmenu:item.leftmenu,

        card_group:item.card_group,
      }
    })
  })
  const router= new Router({
    // 默认 hash 模式 ，当前为 路由的 history 模式
    // mode: 'history',
    routes: routersCache
  })
  new Vue({
    el: '#app',
    router,
    components: { App },
    template: ' <div><mv-modal></mv-modal><App/></div>'
  })
}

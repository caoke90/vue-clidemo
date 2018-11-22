import Vue from 'vue'
import Router from 'vue-router'

// 同步页面
const index = r => r(require('@/views/index.vue'))

// 异步页面
// const index =r => require(['@/views/index.vue'],r);
// const marvel =r => require(['@/views/marvel.vue'],r);
// const page2 =r => require(['@/views/page2.vue'],r);
import bconfig from '../views/config.js';
const routersCache=[]
bconfig.routes.forEach(function (item) {
  const {path,name,card_group,leftmenu}=item;
  routersCache.push({
    name:name,
    path:path,
    component: index,
    meta:{
      mheader:item.mheader===true?bconfig.mheader:item.mheader,
      mfooter:item.mfooter===true?bconfig.mfooter:item.mfooter,
      leftmenu:item.leftmenu===true?bconfig.leftmenu:item.leftmenu,

      card_group:item.card_group,
    }
  })
})
console.log(routersCache)
Vue.use(Router)

export default new Router({
  // 默认 hash 模式 ，当前为 路由的 history 模式
  // mode: 'history',

  routes: routersCache
})

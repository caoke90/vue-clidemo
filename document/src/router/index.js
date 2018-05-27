import Vue from 'vue'
import Router from 'vue-router'

// 同步页面
const Hello = r => r(require('@/views/marvel.vue'))

// 异步页面
const index =r => require.ensure([], () => r(require('@/views/index.vue')), 'index')
const marvel =r => require.ensure([], () => r(require('@/views/marvel.vue')), 'marvel')
const page2 =r => require.ensure([], () => r(require('@/views/page2.vue')), 'page2')

Vue.use(Router)


export default new Router({
  // 默认 hash 模式 ，当前为 路由的 history 模式
  // mode: 'history',

  routes: [
    {
      path: '/',
      name: 'index',
      component: index
    },
    {
      path: '/marvel',
      name: 'marvel',
      component: marvel,
    },
    {
      path: '/marvel/:pname/:cname',
      name: 'marvelItem',
      component: marvel,
    },
    {
      path: '/page2',
      name: 'page2',
      component: page2
    }
  ]
})

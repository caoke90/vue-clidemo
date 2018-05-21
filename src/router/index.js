import Vue from 'vue'
import Router from 'vue-router'

// 同步页面
const Hello = r => r(require('@/views/page1.vue'))

// 异步页面
const page1 =r => require.ensure([], () => r(require('@/views/page1.vue')), 'page1')
const page2 =r => require.ensure([], () => r(require('@/views/page2.vue')), 'page2')
const info1 =r => require.ensure([], () => r(require('@/views/page1/info1.vue')), 'info1')
const info2 =r => require.ensure([], () => r(require('@/views/page1/info2.vue')), 'info2')

Vue.use(Router)


export default new Router({
  // 默认 hash 模式 ，当前为 路由的 history 模式
  mode: 'history',

  routes: [
    {
      path: '/',
      name: '',
      component: page1
    },
    {
      path: '/page1',

      component: page1,
      children:[
        {
          path: '',
          name: 'page1',
          component: info1
        },
        {
          path: 'info1',
          name: 'info1',
          component: info1
        },
        {
          path: 'info2',
          name: 'info2',
          component: info2
        }
      ]
    },
    {
      path: '/page2',
      name: 'page2',
      component: page2
    }
  ]
})

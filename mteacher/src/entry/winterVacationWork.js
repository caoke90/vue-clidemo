// 引入公共配置1
import Vue from '../common/mbase';
import VueRouter from 'vue-router';

// 项目的入口
import App from '../views/winterVacationWork.vue';

Vue.use(VueRouter);
const routes = [];
const router = new VueRouter({
  mode:'history',
  routes
});

/* eslint-disable no-new */
new Vue({
    el: '#app',
    components: {App},
    router: router,
    template: ' <div><mv-modal></mv-modal><App/></div>'
  })


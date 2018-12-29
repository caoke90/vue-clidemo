// 引入公共配置1
const Vue= window.Vue;
require('../common/pcbase.css')
Vue.component('mv-img', require('../marvel/img.vue'));
// 项目的入口
import App from '../views/zyquestion.vue';

Vue.component('zyquestion', App);


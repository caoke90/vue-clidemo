import Vue from 'vue';
const hljs = require('highlight.js');
import 'highlight.js/styles/default.css'

function highlight(el) {

  let blocks = el.querySelectorAll('pre code');
  blocks.forEach((block)=>{
    hljs.highlightBlock(block)
  })
}
Vue.directive('highlight', highlight);


<template>
  <div class="hello">
    <h1>dev.list.html 列表页</h1>
    <ul  class="list">
      <li v-for="(item,key) in list">
        <a :href="item" target="_blank">{{item}}</a>
      </li>
    </ul>
  </div>
</template>

<script>
  const productName = require('../../package').name||'template';
  const listkey=require.context('../entry',true,/\.js/).keys()
  var list=listkey.map(function (item) {
    return item.replace(/^\.\/(.+)\.js$/,'/'+productName+'/$1.html')
  })
  list=list.sort(function (n1,n2) {
    if(/dev/.test(n1)){
      return -1;
    }else if(/dev/.test(n2)){
      return 1;
    }{
      return 0;
    }
  })

  export default {
    name: 'HelloWorld',
    data () {
      return {
        list:list,
        card_group: [
          {
            card_type:'demo',
            md_type:'load'
          }
        ]
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .hello{
    width: 600px;
    margin: 0 auto;
  }
  .list{

    line-height: 30px;
  }
</style>

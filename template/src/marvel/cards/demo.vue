
<template>
  <div class="card demo">
    <div class="card-title">我是一个基础组件demo，展示组件的数据</div>
    <div class="card-title">{{card.card_type}}</div>
    <textarea >{{JSON.stringify(card,null,2)}}</textarea>
  </div>
</template>
<script>
  /*
* 必须字段:
* 1、name:'demo'
* 2、传入的props
  card：{
    card_type:'demo',
  ...
  }
*/
  export default {
    data() {
      return {};
    },
    name: "demo",
    props: ['card'],
    components: {
    },
    methods: {

    },
  };
</script>
<style rel="stylesheet/scss" type="text/css" lang="scss" scoped>

  .card10 .card-title{
    color: #939393;
    font-size:0.28rem;
    line-height:0.34rem;
    padding: 0.24rem 0 0.14rem 0.24rem;
    background: #f2f2f2;
  }
</style>

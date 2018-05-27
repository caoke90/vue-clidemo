<!--card10:一个空的容器，可以在里面放入卡片-->
<template>
  <div class="card card10" :style="{'margin-bottom':card.mbottom||'0.18rem'}">
    <card v-for="(v,k) in card.card_group" :card="v" :key="'c'+k"></card>
  </div>
</template>
<script>
  export default {
    data() {
      return {};
    },
    name: "card10",
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

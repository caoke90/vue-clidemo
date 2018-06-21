<template>
  <div class="card" :class="cardclass" :key="out">
    <div ref="card">
      <slot></slot>
    </div>
    <div class="btn" v-if="need">
      <div class="titleback">题目反馈</div>
      <div class="see" @click="toggle">{{out?'收起':'查看全部'}}<span class="icon" :class="out?'upArrow':'downArrow'"></span>
      </div>
    </div>
  </div>

</template>

<script>
  // 屏幕宽度
  const win_width = window.innerWidth > 750 ? 750 : window.innerWidth;
  const height = parseInt(460 * win_width / 750);
  export default {
    data: function () {
      return {
        need: false,
        out: 0
      }
    },
    props: ['card', 'height'],
    name: 'toggle',
    computed: {
      cardclass:function () {
        if(this.need){
          if(this.out){
            return 'out';
          }else{
            return 'in';
          }
        }else{
          return '';
        }

      }
    },
    methods: {
      toggle: function () {
        this.out = !this.out;
      }
    },
    mounted: function () {
      if (this.$refs.card.offsetHeight > height) {
        this.need = true;
      }
    }
  };

</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style rel="stylesheet/scss" type="text/css" lang="scss" scoped>
  .card {
    position: relative;

    .btn {
      padding: 0 0.4rem;
      position: absolute;
      width: 100%;
      bottom: 0;
      left: 0;
      background: #FFFFFF;
      .icon {
        display: inline-block;
        width: 0.22rem;
        height: 0.22rem;
        margin-left: 0.09rem;
      }
      .upArrow {
        vertical-align: -0.06rem;
        background: url('../assets/img/upArrow.png') no-repeat;
        background-size: 0.22rem 0.22rem;
      }
      .downArrow {
        vertical-align: 0.02rem;
        background: url('../assets/img/downArrow.png') no-repeat;
        background-size: 0.22rem 0.22rem;
      }
      .see {
        height: 0.88rem;
        font-size: 0.28rem;
        color: #58595E;
        text-align: center;
        line-height: 0.88rem;
      }
      .titleback {
        text-align: right;
        font-size: 0.24rem;
        color: #9D9FA1;
        background: #fff;
        padding-top: 0.1rem;
        line-height: 0.36rem;
        a{
          color: #9D9FA1;
        }
      }
    }
  }

  .card.out {
    padding-bottom: 0.44rem;
  }

  .card.in {
    padding-bottom: 0.44rem;
    max-height: 4.6rem;
    overflow: hidden;
  }
</style>

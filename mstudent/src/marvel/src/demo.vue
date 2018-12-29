<template>
  <div class="hello">
    <h3>最近更新时间：</h3>

    <question></question>

  </div>
</template>

<script>
  import question,{ demo } from '../index'
  export default {
    name: 'HelloWorld',
    components:{question},
    data () {
      return {
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss" type="text/css" rel="stylesheet/scss">
  .hello{
    max-width:750px;
    margin: 0 auto;
    color: #666;
    font-size: 0.28rem;
    padding:0 0.4rem;
  h2{
    font-size:0.4rem ;
    margin: 0.2rem 0;
  }
  }
</style>

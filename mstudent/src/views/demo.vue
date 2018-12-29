<template>
  <div class="container">
    <h3>最近更新时间：</h3>

    <question :question="question" @change="change"></question>

  </div>
</template>

<script>
  import question from 'marvel'

  export default {
    name: 'HelloWorld',
    components:{question},
    data () {
      return {
        question:{
          questionType2Id:'demo'
        }
      }
    },
    methods:{
      change:function ({type,question,component}) {
        console.log(type)
        console.log(question)
        console.log(component)

      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss" type="text/css" rel="stylesheet/scss">
  .container{
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
  .list{
    font-size: 0.32rem;
    line-height: 0.3rem;
  }
</style>

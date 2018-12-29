<template>
  <question :question="qobj"></question>
</template>

<script>
  import Question from '../models/question/Question';
  import question from '../components/zyquestion';
  export default{
    props:['zyquestion'],
    components:{question},
    data:function(){
      return {
        qobj:new Question(this.zyquestion)
      }
    },

    created:function () {

    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style rel="stylesheet/scss" type="text/css" lang="scss" scoped>

</style>

<!--纯文字+音频 听短语选答案-->
<template>
  <!-- <chioceTpl :question="question" @change="change"></chioceTpl> -->
</template>
<script>
  import oralMixin from './mixin';
  export default {
    name: "phrasesAnswer",
    props:['question'],
    components: {
      //chioceTpl
    },
      methods:{
      change:function (obj) {
        this.$emit('change',obj)
      }
    }
  };

</script>
<style lang="scss" scoped>

</style>

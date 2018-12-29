<!--纯文字 读音选词-->
<template>
   <!-- <chioceTpl :question="question" @change="change"></chioceTpl> -->
</template>
<script>
  // import chioceTpl from './components/chioceTpl'
  export default {
    name: "readChoiceWord",
    props:['question'],
    components: {
      // chioceTpl
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

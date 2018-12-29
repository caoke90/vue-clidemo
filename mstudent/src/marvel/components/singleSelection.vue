<!--纯文字 单项选择-->
<template>
  <div class="question-main-content main-content-choice">
    <chioceTpl :question="question" @change="change"></chioceTpl>
  </div>
</template>
<script>
  import chioceTpl from './choiceTpl'
  export default {
    name: "singleSelection",
    props:['question'],
    components: {
      chioceTpl
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

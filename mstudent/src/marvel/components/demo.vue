<!-- demo-->
<template>
  <div @click="change">
    change
  </div>
</template>
<script>
  //组件公共部分
  import Bus from '../common.js';
  import oralMixin from './mixin';

  export default {
    name: "demo",
    'mixins': [ oralMixin ],
    data() {
      return {

      };
    },
    methods: {
      change:function () {
        this.$emit('change',{
          type:"select",
          question:this.question,
          component:this,
        })
      }

    },
    created() {

    },
    components: {}
  };

</script>
<style lang="scss" scoped>

</style>

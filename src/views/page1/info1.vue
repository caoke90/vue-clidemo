<template>
  <div v-highlight class="main">

    <vue-markdown class="markdown">{{md}}</vue-markdown>

  </div>
</template>

<script>
  require('../../common/markdown.scss');
  import md from '../../../README.md';
  // console.log(md)
  import VueMarkdown from 'vue-markdown';
  require('@/directive/highlight')

  export default {
    name: 'HelloWorld',
    components:{VueMarkdown},
    data () {
      return {
        md:md,
        card_group: [
          {
            card_type:10,
            card_group:[
              {
                card_type:2
              },
              {
                card_type:3
              }
            ]
          }
        ]
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style rel="stylesheet/scss" type="text/css" lang="scss" scoped>

  .main {
    padding: 0 20px;
  }
</style>

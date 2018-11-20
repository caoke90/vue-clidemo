<template>
  <div class="container">
    <h2 style="line-height: 50px;">编辑左边，右边发生变化</h2>
    <div v-for="(v,k) in card_group"  :key="k">
      <card :card="v"></card>
    </div>
  </div>
</template>

<script>

  export default {
    data () {
      return {
        card_group: [
          {
            card_type:"edit",
            edit_type:"card11"
          }
        ]
      }
    },
    computed:{

    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style rel="stylesheet/scss" type="text/css" lang="scss" scoped>
  .container{
    padding-top: 20px;
    width: 1000px;
    margin: 0 auto;
  }
</style>

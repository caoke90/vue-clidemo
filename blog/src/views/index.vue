<template>
  <div class="container">
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
            card_type:'md',
            md_type:"hello"
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

<template>
  <div class="main">
    <!--card 容器层-->
    <div v-for="(v,k) in card_group"  :key="k">
      <card :card="v"></card>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'HelloWorld',
    data () {
      return {
        card_group:[
          {
            card_type:1,
            md_type:'index'
          }
        ]
      }
    },
    mounted:function () {

    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  /*当页面样式*/
  .main{
    padding: 0 10%;
  }
</style>

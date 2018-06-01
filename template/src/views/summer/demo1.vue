<template>
  <div class="hello">
    页面1
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
        card_group: [
          {
            card_type:'demo',
            md_type:'load'
          }
        ]
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .hello{
    width: 900px;
    margin: 0 auto;
  }

</style>

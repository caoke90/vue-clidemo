<template>
  <div class="hello">
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
            card_type:'md',
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

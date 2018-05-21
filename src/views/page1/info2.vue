<template>
  <div class="hello">
    <h1>页面1</h1>
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
          card_type:10,
          card_group:[
            {
              card_type:2
            },
            {
              card_type:2
            }
          ]
        }
      ]
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>

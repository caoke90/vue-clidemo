<template>
  <div v-if="$route.meta.leftmenu">
    <div class="g-bd1">
      <div class="g-sd1">
        <div style="position: fixed;width: 20%;top: 0;padding: 61px 0;height: 100vh;overflow-y: scroll">
          <card :card="$route.meta.leftmenu"></card>
        </div>
      </div>
      <div class="g-mn1">
        <div class="g-mn1c">
          <div v-for="(v,k) in $route.meta.card_group"  :key="k">
            <card :card="v"></card>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-else>
    <div class="container">
      <div v-for="(v,k) in $route.meta.card_group"  :key="k">
        <card :card="v"></card>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {}
    },

  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style rel="stylesheet/scss" type="text/css" lang="scss" scoped>
  .g-bd1{margin:0;}
  .g-sd1{position:relative;float:left;width:20%;margin-right:-20%;}
  .g-mn1{float:right;width:100%;}
  .g-mn1c{margin-left:20%;padding: 0 20px;}

  .container{
    max-width: 1000px;
    margin: 0 auto;
  }
</style>

<template>
  <div class="app">
    <div class="top">
      <card :card="card.mheader" ></card>
    </div>
    <div :key="$router.path">
      <router-view/>
    </div>


  </div>
</template>

<script>
  import bconfig from './config.js';

  console.log(bconfig);
  export default {
    name: 'App',
    data () {
      return {
        card:bconfig,
      }
    },
    methods: {
      handleSelect(key, keyPath) {
        if(key){
          this.$router.push({ name: key})
        }
      }
    }
  }
</script>

<style>
  .app{
    padding-top: 61px;
  }
  .top{
    position: fixed;
    width: 100%;
    top: 0;
    height: 0;
    z-index: 11;
  }

</style>

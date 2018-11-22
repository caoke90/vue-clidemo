<template>
  <div class="app">
    <div class="top" v-if="$route.meta.mheader" >
      <card :card="$route.meta.mheader" ></card>
    </div>
    <div style="height: 61px;" v-if="$route.meta.mheader"></div>
    <div :key="$route.path">
      <router-view/>
    </div>
  </div>
</template>

<script>

  export default {
    name: 'App',

  }
</script>

<style>
  .top{
    position: fixed;
    width: 100%;
    top: 0;
    height: 0;
    z-index: 11;
  }

</style>

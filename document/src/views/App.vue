<template>
  <div class="app">
    <div class="top">
      <el-menu

        :default-active="'1'"
        class="el-menu-demo"
        mode="horizontal"
        @select="handleSelect"
        background-color="#545c64"
        text-color="#fff"
        active-text-color="#ffd04b">
        <el-menu-item index="index">17作业组件文档平台</el-menu-item>
        <el-menu-item index="marvel">marvel组件</el-menu-item>
        <el-menu-item index="page2">源码下载</el-menu-item>
      </el-menu>
    </div>
    <div :key="$router.path">
      <router-view/>
    </div>


  </div>
</template>

<script>


  export default {
    name: 'App',
    data () {
      return {
        page1:{},
        page2:{
          info1:{}
        },
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

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
        <el-menu-item index="index">项目页面list</el-menu-item>
        <el-menu-item index="demo1">demo1</el-menu-item>
        <el-menu-item index="demo2">demo2</el-menu-item>
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

<template>
  <el-menu

    :default-active="'1'"
    class="el-menu-demo"
    mode="horizontal"
    @select="handleSelect"
    background-color="#545c64"
    text-color="#fff"
    active-text-color="#ffd04b">
    <template v-for="v in card.submenu">
      <el-submenu v-if="v.submenu" :index="v.name">
        <template slot="title">{{v.title}}</template>
        <el-menu-item :index="v2.name" v-for="v2 in v.submenu">{{v2.title}}</el-menu-item>
      </el-submenu>
      <el-menu-item v-else :index="v.name">{{v.title}}</el-menu-item>
    </template>
  </el-menu>
</template>

<script>

  export default {
    name: 'mheader',
    props: ['card'],
    data:function(){
      return {
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

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style rel="stylesheet/scss" type="text/css" lang="scss" >

</style>

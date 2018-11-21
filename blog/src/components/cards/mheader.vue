<template>
  <el-menu

    :default-active="activeIndex"
    class="el-menu-demo"
    mode="horizontal"
    @select="handleSelect"
    background-color="#545c64"
    text-color="#fff"
    active-text-color="#ffd04b">
    <template v-for="(v,k) in card.submenu" >
      <el-submenu v-if="v.submenu" :index="v.name">
        <template slot="title">{{v.title}}</template>
        <template v-for="v2,k2 in v.submenu" >
          <el-submenu v-if="v2.submenu" :index="v2.name">
            <template slot="title">{{v2.title}}</template>
            <el-menu-item :index="v3.name" v-for="(v3,k3) in v2.submenu" :key="k3">{{v3.title}}</el-menu-item>
          </el-submenu>
          <el-menu-item v-else :index="v2.name">{{v2.title}}</el-menu-item>
        </template>
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
        activeIndex:this.$route.name
      }
    },
    methods: {
      handleSelect(key, keyPath) {
        console.log(key,keyPath)
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

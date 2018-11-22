<template>
  <div>
    <el-menu
      :default-active="activeIndex"
      @select="handleSelect">
      <template v-for="(v,k) in card.submenu" >
        <el-submenu v-if="v.submenu" :index="v.name">
          <template slot="title"><span @click="mclick(v)">{{v.title}}</span></template>
          <template v-for="(v2,k2) in v.submenu" >
            <el-submenu v-if="v2.submenu" :index="v2.name">
              <template slot="title"><div @click="mclick(v2)">{{v2.title}}</div></template>
              <el-menu-item :index="v3.name" v-for="(v3,k3) in v2.submenu" :key="k3"><div @click="mclick(v3)">{{v3.title}}</div></el-menu-item>
            </el-submenu>
            <el-menu-item v-else :index="v2.name"><span @click="mclick(v2)">{{v2.title}}</span></el-menu-item>
          </template>
        </el-submenu>
        <el-menu-item v-else :index="v.name"><span @click="mclick(v)">{{v.title}}</span></el-menu-item>
      </template>
    </el-menu>
    <div class="line"></div>
  </div>
</template>

<script>

  export default {
    name: 'leftmenu',
    props: ['card'],
    data:function(){
      return {
        activeIndex:this.$route.name
      }
    },
    methods: {
      mclick(v){
        console.log(v)
        this.$router.push({ name: v.name,path: v.path})
      },
      handleSelect(key, keyPath) {
        console.log(arguments)
        // if(key){
        //   this.$router.push({ name: key})
        // }

      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style rel="stylesheet/scss" type="text/css" lang="scss" >

</style>

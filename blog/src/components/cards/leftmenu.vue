<template>
  <div>
    <el-menu
      :default-active="activeIndex"
      @select="handleSelect">
      <template v-for="(v,k) in card.submenu" >
        <el-submenu v-if="v.submenu" :index="v.name||v.path">
          <template slot="title">
            <i v-if="v.icon" :class="v.icon"></i>
            <span @click="mclick(v)">{{v.title}}</span>
          </template>
          <template v-for="(v2,k2) in v.submenu" >
            <el-submenu v-if="v2.submenu" :index="v2.name||v2.path">
              <template slot="title">
                <i v-if="v2.icon" :class="v2.icon"></i>
                <div @click="mclick(v2)">{{v2.title}}</div>
              </template>
              <el-menu-item :index="v3.name||v3.path" v-for="(v3,k3) in v2.submenu" :key="k3">
                <i v-if="v3.icon" :class="v3.icon"></i>
                <div @click="mclick(v3)">{{v3.title}}</div>
              </el-menu-item>
            </el-submenu>
            <el-menu-item v-else :index="v2.name||v2.path">
              <i v-if="v2.icon" :class="v2.icon"></i>
              <span @click="mclick(v2)">{{v2.title}}</span>
            </el-menu-item>
          </template>
        </el-submenu>
        <el-menu-item v-else :index="v.name||v.path">
          <i v-if="v.icon" :class="v.icon"></i>
          <span @click="mclick(v)">{{v.title}}</span>
        </el-menu-item>
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
        const key=v.name||v.path
        if(/^\w+/.test(key)){
          this.$router.push({ name: key})
        }else{
          this.$router.push({ path: key})
        }
      },
      handleSelect(key, keyPath) {
        if(/^\w+/.test(key)){
          this.$router.push({ name: key})
        }else{
          this.$router.push({ path: key})
        }

      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style rel="stylesheet/scss" type="text/css" lang="scss" >

</style>

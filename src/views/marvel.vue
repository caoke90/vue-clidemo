<template>
  <div class="g-bd1 f-cb">
    <div class="g-sd1">
      <div style="position: fixed;width: 20%;top: 0;padding-top: 61px;height: 100%;overflow: hidden">
        <el-menu
          default-active="1"
          class="el-menu-vertical-demo"
          @open="handleOpen"
          @select="handleSelect"
          :default-openeds="['cards','modals','tools']"
          @close="handleClose">

          <el-submenu index="cards">
            <template slot="title">
              <i class="el-icon-document"></i>组件
            </template>
            <el-menu-item index="card1">card1（markdown文档展示）</el-menu-item>
          </el-submenu>
          <el-submenu index="modals">
            <template slot="title">
              <i class="el-icon-menu"></i>ui服务
            </template>
            <el-menu-item index="file">文件上传</el-menu-item>
            <el-menu-item index="pswp">图片全屏预览</el-menu-item>
          </el-submenu>
          <el-submenu index="tools">
            <template slot="title">
              <i class="el-icon-location"></i>第三方服务
            </template>
            <!--<el-menu-item index="image">canvas图片压缩</el-menu-item>-->
            <el-menu-item index="storage">storage</el-menu-item>
          </el-submenu>
        </el-menu>
      </div>
    </div>
    <div class="g-mn1">
      <div class="g-mn1c" :key="$route.path">
        <div style="padding: 20px 0 0 0;" v-if="$route.params.pname">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ name: 'index' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ name: 'marvel' }">{{$route.params.pname}}</el-breadcrumb-item>
            <el-breadcrumb-item>{{$route.params.cname}}</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <div v-for="(v,k) in card_group"  :key="k">
          <card :card="v"></card>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
  const map={
    hello:{
      card_group:[
        {
          card_type:1,
          md_type:'hello'
        }
      ]
    },
    cards:{
      card1:{
        card_group:[
          {
            card_type:1,
            md_type:'card1'
          }
        ]
      }
    },
    modals:{
      file:{
        card_group:[
          {
            card_type:2,
            md_type:'file'
          },
          {
            card_type:1,
            md_type:'file'
          },
        ]
      },
      pswp:{
        card_group:[
          {
            card_type:2,
            md_type:'pswp'
          },
          {
            card_type:1,
            md_type:'pswp'
          },
        ]
      }
    },
    tools:{
      storage:{
        card_group:[
          {
            card_type:2,
            md_type:'storage'
          },
          {
            card_type:1,
            md_type:'storage'
          },
        ]
      },
      image:{
        card_group:[
          {
            card_type:2,
            md_type:'image'
          },
          {
            card_type:1,
            md_type:'image'
          },
        ]
      }
    },
  }
  export default {
    name: 'page1',
    data () {
      return {
        key:0,
      }
    },
    computed:{
      card_group:function(){
        const {pname,cname}=this.$route.params;
        console.log(pname)
        if(map[pname]&&map[pname][cname]){
          return map[pname][cname].card_group;
        }else{
          return map.hello.card_group;
        }

      }
    },
    methods: {
      handleOpen(key, keyPath) {
        console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
        console.log(key, keyPath);
      },
      handleSelect(key, keyPath) {
        if(keyPath.length==2){
          this.$router.push({ name: 'marvelItem', params: {
              pname:keyPath[0],
              cname:keyPath[1],
            }})
        }
      }
    },
    created:function () {


    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .g-bd1{margin:0;}
  .g-sd1{position:relative;float:left;width:20%;margin-right:-20%;}
  .g-mn1{float:right;width:100%;}
  .g-mn1c{margin-left:20%;padding: 0 20px;}
</style>

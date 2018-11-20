<template>
  <div class="g-bd1 f-cb">
    <div class="g-sd1">
      <div style="position: fixed;width: 20%;top: 0;padding: 61px 0;height: 100%;overflow-y: scroll">
        <el-menu
          default-active="1"
          class="el-menu-vertical-demo"
          @open="handleOpen"
          @select="handleSelect"
          :default-openeds="openeds"
          @close="handleClose">

          <el-submenu index="cards">
            <template slot="title">
              <i class="el-icon-document"></i>基础组件
            </template>
            <el-menu-item index="card11">card11（题库9种）</el-menu-item>

          </el-submenu>
          <el-submenu index="base">
            <template slot="title">
              <i class="el-icon-document"></i>基础知识
            </template>
            <el-menu-item index="card">card 组件容器</el-menu-item>
            <el-menu-item index="modal">modal 服务容器</el-menu-item>
            <el-menu-item index="bus">bus 组件与组件之前数据通信</el-menu-item>
            <el-menu-item index="img">img 延迟按需加载图片</el-menu-item>
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
          <card :card="v" ></card>
        </div>

      </div>
    </div>
  </div>

</template>

<script>
  const map={
    hello:[
      {
        card_type:'md',
        md_type:'hello'
      }
    ],
    cards:{
      card1:[
        {
          card_type:'md',
          md_type:'card1'
        }
      ],
      card11:[

        {
          card_type:'md',
          md_type:'card11'
        },
        {
          card_type:'edit',
          edit_type:"card11"
        },
      ],
    },
    modals:{

    },
    tools:{

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

        if(!pname&&!cname){
          return map.hello;
        }
        if(map[pname]&&map[pname][cname]){
          return map[pname][cname];
        }else{
          if(pname=='tools'||pname=='modals'){
            return [
              {
                card_type:'md',
                md_type:cname
              },
            ];
          }else{
            return [
              {
                card_type:'md',
                md_type:cname
              },
              ]
          }

        }

      },
      openeds:function () {
        const {pname,cname}=this.$route.params;
        if(!cname){
          return ['cards','modals','base','tools']
        }else{
          return [pname]
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

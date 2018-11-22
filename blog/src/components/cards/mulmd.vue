<template>
  <div>
    <div style="padding: 20px 0 0 0;" v-if="$route.params.pname">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ name: 'index' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ name: $route.params.pname }">{{$route.params.pname}}</el-breadcrumb-item>
        <el-breadcrumb-item>{{$route.params.cname}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div v-for="(v,k) in card_group"  :key="k">
      <card :card="v" ></card>
    </div>
  </div>
</template>

<script>

  export default {
    name: 'mulmd',
    props: ['card'],
    data:function(){
      return {
        card_group:[
          {
            card_type:'md',
            md_type:this.$route.params.cname
          }
        ]
      }
    },
    methods: {
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style rel="stylesheet/scss" type="text/css" lang="scss" >

</style>

<template>
  <div class="container">

    <div class="box" v-for="(v,k) in card_group"  :key="k">
      <card :card="v"></card>
    </div>
  </div>
</template>

<script>

  function getParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); // 构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg);  // 匹配目标参数
    if (r != null) return unescape(r[2]); return null; // 返回参数值
  }
  import storage from '@/utils/storage'
  import axios from 'axios';
  export default {
    data () {
      return {
        card_group:[]
      }
    },
    computed:{
    },
    created:function(){
      const cache=getParam('cache')
      if(cache){
        this.card_group=storage.getData(cache+'Cache');
        window.addEventListener('message', (event)=>{
          if(event.data&&event.data.type=='cache'){
            this.card_group=storage.getData(event.data.data+'Cache');
          }
        },false)
      }else{
        var hash=location.hash.substr(1)||'card';
        axios.get('/demo/mock/'+hash+'.js').then((resp)=>{
          this.card_group=resp.data;
        })

      }

    }

  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style rel="stylesheet/scss" type="text/css" lang="scss" scoped>
  .container{
    max-width: 750px;
    margin: 0 auto;
    font-size: 0.28rem;
  }
  .box{
    margin-bottom: 0.2rem;
  }

</style>

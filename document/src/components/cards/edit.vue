<template>
  <div class="card11">
    <div class="left">
      <textarea v-model="text"></textarea>
    </div>
    <div class="right">
      <div class="iframe">
        <iframe :src="'/'+productName+'/demo.html?cache='+card.edit_type"></iframe>
      </div>
    </div>

  </div>
</template>
<script>

  import axios from '@/api/ajax';
  import storage from '@/utils/storage'
  export default {
    data() {
      return {
        text:'',
        productName:process.env.productName

      };
    },
    name: "edit",
    props: ['card'],
    watch:{
      text:function (nval,oval) {

        try{
          const cache=JSON.parse(nval)
          storage.setData(this.card.edit_type+'Cache',cache);
          window.frames[0].postMessage({type:'cache',data:this.card.edit_type},'/')

        }catch (e) {

        }
      }
    },
    created:function () {
      axios.get('/mock/card11.js').then((resp) =>{
        this.text=JSON.stringify(eval(resp.data),null,2);
      })
    }
  };
</script>
<style rel="stylesheet/scss" type="text/css" lang="scss" scoped>
  .card11{
    a{
      color: #fff;
    }
    .left{
      float: left;
      margin-right: 20px;
      textarea{
        width: 450px;
        height: 700px;
      }
    }
    .right{
      float: left;
    }
    .iframe{
      color: #fff;
      width: 450px;
      height:700px;
      margin: 0 auto;
      background: #0a6aa1;
      text-align: center;
    }
    .iframe iframe{
      width: 375px;
      height: 667px;
      overflow: scroll;
      position: relative;
      top: 50%;
      transform: translate(0,-50%);
    }
  }

</style>

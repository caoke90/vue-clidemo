<template>
  <div class="card markdown" >
    <h2>本地存储storage</h2>
    <h3>#demo</h3>
    <textarea v-model="userText">
    </textarea>
    <button @click="set">设置</button>
    <button @click="clear">清除</button>
  </div>
</template>
<script>

  import storage from '../../utils/storage';

  export default {
    data() {
      return {
        userText:''
      };
    },
    name: "storage",
    props: ['card'],
    computed:{

    },
    methods:{
      set:function () {
        storage.setData('user',this.userText)
      },
      clear:function () {
        storage.removeData('user')
        this.userText=''
      }
    },
    created:function () {
      this.userText=JSON.stringify(storage.getData('user')||{'name':'hello'});
    }
  };
</script>
<style  >
  .card2{
    overflow: hidden;
  }
  .m-auto-list{
    width: 100%;
  }
  .m-auto-box{
    width: 200px;
    height: 200px;
    overflow: hidden;
    float: left;
    padding:10px 20px;
  }
  .m-img-box{

  }
</style>

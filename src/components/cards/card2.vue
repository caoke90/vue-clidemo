<template>
  <div class="card m-panel card2" @click="click1" >
   card2中调用 “获取文件服务”
  </div>
</template>
<script>
  //引入服务
  import Bus from '../servers/file';

  export default {
    data() {
      return {};
    },
    name: "card2",
    props: ['card'],
    components: {
    },
    methods: {
      click1:function () {
        //调用服务
        Bus.$emit("getFile",function (file) {
          console.log(file)
        })
      }
    },
  };
</script>
<style  >

</style>

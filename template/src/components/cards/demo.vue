<template>
  <div class="flex">
    <div class="item p1" :style="itemSyle">{{key}}</div>
    <div class="item" v-for="(item,k) in dataArr" :style="item"></div>
  </div>
</template>
<script>

  function rectTurn(w,h,x,y,dre) {

    var x=0;y=0;
    var r=w
    var b=h
    var l=-1
    var t=-1
    var dre=dre||{
      x:1,y:0
    }
    var cache=[]
    function run(n){
      cache.push([x,y])
      x+=dre.x
      y+=dre.y

      //往右走不符合
      if(x>=r){
        x=x-1//还原
        y=y+1
        dre.x=0
        dre.y=1
        t=t+1
      }
//向下走不符合
      if(y>=b){
        x=x-1
        y=y-1
        dre.x=-1
        dre.y=0
        r=r-1
      }
      //向左走不符合
      if(x<=l){
        x=x+1
        y=y-1
        dre.x=0
        dre.y=-1
        b=b-1
      }
      //向上走不符合
      if(y<=t){
        x=x+1
        y=y+1
        dre.x=1
        dre.y=0
        l=l+1
      }
      if(x>=r){
        console.log("end")
        return;
      }
      if(n==1){
        return;
      }
      return run(n-1)
    }
    return function (n) {
      run(n);
      return cache;
    }
  }

  export default {
    data() {
      return {
        key:1,

        dataArr:[]
      };
    },
    name: "demo",
    props: ['card'],
    computed:{
      itemSyle:function () {
        return this.dataArr[this.key]
      }
    },
    created:function () {
      var w=10
       var h=10
      var run = rectTurn(w,h)
      var arr=run(w*h)
      this.key=0|Math.random()*(w*h);
      this.dataArr=arr.map(function (item) {
        return {
          top:item[1]/h*100+'%',
          left:item[0]/w*100+'%',
          width:1/w*100+"%"
        }
      })
      var dire=1;
     setInterval(()=>{
       if(this.key==(w*h-1)){
         dire=-1
       }
       if(this.key==0){
         dire=1
       }
       this.key+=dire;

     },400)
    }
  };
</script>
<style rel="stylesheet/scss" type="text/css" lang="scss" scoped>

  .flex{
    position: relative;
    width: 400px;
    height: 400px;
    .item{
      height: 0;
      padding-bottom: 10%;
      overflow: hidden;
      border: 1px solid #ddd;
      position: absolute;
    }
    .p1{
      background: #0a6aa1;
      line-height: 40px;
      text-align: center;
      color: #fff;
    }

  }

</style>

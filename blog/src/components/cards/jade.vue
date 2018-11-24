<template>
  <div class="markdown-body" :key="key">
    <div v-html="shtml"></div>
  </div>
</template>

<script>
  import axios from 'axios';
  var jade = require('jade');

  const mdCache={}
  export default {
    name: 'jade',
    props: ['card'],
    data:function(){
      return {
        shtml:'',
        key:0
      }
    },
    created:function () {
      if(!this.card.md_type){return;}
      if(!mdCache[this.card.md_type]){
        axios.get('jade/'+this.card.md_type+'.jade').then((resp) =>{
          mdCache[this.card.md_type]=resp.data
          this.key+=1;
          this.shtml=jade.compile(mdCache[this.card.md_type],{})

        })
      }else{
        this.key+=1;
        this.shtml=jade.compile(mdCache[this.card.md_type],{})

      }


    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style rel="stylesheet/scss" type="text/css" lang="scss" >

</style>

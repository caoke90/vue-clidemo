<template>
  <div class="markdown-body" :key="key">
    <div v-html="shtml"></div>
  </div>
</template>

<script>
  var hljs = require('highlight.js') // https://highlightjs.org/

  // Actual default values
  var md = require('markdown-it')({
    highlight: function (str, lang) {
      if (lang && hljs.getLanguage(lang)) {
        try {
          return '<pre class="hljs"><code>' +
            hljs.highlight(lang, str, true).value +
            '</code></pre>';
        } catch (__) {}
      }

      return '<pre class="hljs"><code>' + md.utils.escapeHtml(str) + '</code></pre>';
    }
  });

  import axios from 'axios';
  // import VueMarkdown from 'vue-markdown';
  var anchorJS = require('anchor-js');

  // var markdown = require( "markdown" ).markdown;

  require('@/directive/highlight')
  const mdCache={}
  export default {
    name: 'md',
    // components: {VueMarkdown},
    props: ['card'],
    data:function(){
      return {
        shtml:'',
        key:0

      }
    },
    created:function () {
      if(!this.card.md_type){return;}
      var anchors = new anchorJS();
      if(!mdCache[this.card.md_type]){
        axios.get('md/'+this.card.md_type+'.md').then((resp) =>{
          this.card.md=resp.data;
          mdCache[this.card.md_type]=this.card.md
          this.key+=1;
          this.shtml=md.render(mdCache[this.card.md_type])
          setTimeout(function () {
            anchors.add();
          },1000)
        })
      }else{
        this.card.md=mdCache[this.card.md_type]
        this.key+=1;
        this.shtml=md.render(mdCache[this.card.md_type])
        setTimeout(function () {
          anchors.add();
        },1000)
      }


    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style rel="stylesheet/scss" type="text/css" lang="scss" >

</style>

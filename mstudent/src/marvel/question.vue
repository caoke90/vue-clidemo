<template>
  <component :is="page_type" :question="question" :cid="this._uid" @change="change"></component>
</template>

<script>
  import questionTypeMap from './api/questionTypeMap';
  //我把它定义成一个业务组件
  const component = require.context('./components', false, /\.vue$/);
  const components = {};
  component.keys().map(component).forEach((card)=>{
    components[card.name]=card;
  })
  export default{
    props:['question'],
    components,
    computed: {
      page_type: function () {
        let type = '';
        if (this.question && this.question.questionType2Id) {
          type=questionTypeMap[this.question.questionType2Id];
          return type;
        }
      }
    },
    methods:{
      change:function (obj) {
        this.$emit('change',obj)
      }
    }
  };

</script>

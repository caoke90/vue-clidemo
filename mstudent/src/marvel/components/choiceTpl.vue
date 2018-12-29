<template>
  <div class="question-main-content main-content-choice">
    <!--题干-->
    <component  :is="contentTpl"></component>
    <!--选项-->
    <component :is="optionsTpl" ref="option"></component>
    <!--解析-->
    <template>
      <component :is="answerTpl"></component>
    </template>
  </div>
</template>

<script>
  //组件通信
  import Bus from '../common.js';

  import answerTpl from './choice/answerBase';
  import optionsTpl from './choice/choiceOptions';
  import contentTpl from './choice/contentBase';

  export default {
<<<<<<< HEAD:mstudent/src/marvel/components/choiceTpl.vue
    name: "choiceTpl",
    props: ['card'],
=======
    name: "choice_text",
    props: ['question'],
>>>>>>> 66f69bb9ab7db71c05d1bd09210a18a4234da807:mstudent/src/marvel/components/choice.vue
    components: {contentTpl, optionsTpl, answerTpl},
    data() {
      return {
        contentTpl: 'contentTpl',
        optionsTpl: 'optionsTpl',
        answerTpl: 'answerTpl'
      }
    }
  }
</script>

<style rel="stylesheet/scss" type="text/css" lang="scss" scoped>

</style>

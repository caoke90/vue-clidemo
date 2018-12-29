<template>
  <div class="answer_warp">
    <div class="answer_list">
      <p class="stander_answer">正确答案:<span>A</span></p>
      <p class="my_answer">我的答案:<span>A</span></p>
    </div>
    <div class="analysis_warp">
      <div class="analysis_title">查看解析<x-icon type="ios-arrow-up" size="18"></x-icon></div>
      <div class="analysis_content">此题是细节理解题。答案出处：第一段第一句话Mr. Miller comes from America. He has two children, Dave and Anna.Miller先生来自美国，他有两个孩子Dave和Anna。</div>
    </div>
  </div>
</template>

<script>
  //组件通信
  import Bus from '../../common.js';

  export default {
    name: "answerBase",
    data() {
      return {
        iconColor:'#0599F6'
      }
    }
  }
</script>

<style rel="stylesheet/scss" type="text/css" lang="scss" scoped>
.answer_warp{
  padding: 0 0.3rem;
  .answer_list{
    margin: 0.32rem 0;
    font-family: PingFangSC-Regular;
    font-size:0.28rem;
    color: #AAAAAA;
    p{
      margin-bottom: 0.16rem;
      span{
        color: #171717;
        margin-left: 0.1rem;
      }
    }
  }
  .analysis_warp{
    margin-top: 0.32rem;
    font-size: 0.28rem;
    .analysis_title{
      color: #0599F6;
    }
    .analysis_content{
      font-size:0.28rem;
      color: #444444;
      margin-top: 0.08rem;
    }
  }
}
</style>
<style rel="stylesheet/scss" type="text/css" lang="scss">
  .answer_warp{
    .vux-x-icon{
       fill: #0599F6;
       vertical-align: top;
    }
  }
</style>
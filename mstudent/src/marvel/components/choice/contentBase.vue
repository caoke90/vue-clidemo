<template>
  <div class="content-wrapper">
    <div class="content-detail">
      <div class="subq-index">第一题</div>
      <div class="content-text">
        <p class="question_title">从下面所给出的A,B,C,D四个选项中,选出可以填入空白处的最佳选择</p>
        <p class="question_cot">there is _____ food in the fridge</p>
        <!--音频-->
        <div>
          <audioBase></audioBase>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  //组件通信
  import Bus from '../../common.js';
  import audioBase from './audioBase'
  export default {
    name: "contentBase",
    components:{audioBase},
    data() { 
      return {}
    }
  }
</script>

<style rel="stylesheet/scss" type="text/css" lang="scss" scoped>
.content-wrapper{
  padding: 0.32rem 0.3rem 0  0.3rem;
  .subq-index{
    font-size: 0.32rem;
    color: #595959;
    margin-bottom: 0.32rem;
  }
  .content-text{
    font-size:0.32rem;
    .question_title{
      color: #171717;
      line-height:0.5rem;
    }
    .question_cot{
      color: #444444;
      margin-top: 0.3rem;
    }
    .audio_cot{
      height: 0.88rem;
      width: 100%;
      background: #ffffff;
      border:1px solid #BFBFBF;
      border-radius: 8px;
      padding: 0 0.24rem;
      position: relative;
      overflow: hidden;
      .audio_warp{
          height: 100%;
          position: relative;
          width: 100%;
          p{
            height: 0.88rem;
            line-height: 0.88rem;
          }
          .audio_btn{
              float: left;
              position: relative;
              top:50%;
              width: 0.6rem;
              height: 0.6rem;
              margin-top: -0.3rem;
              background: url('../../../assets/img/audio.png') no-repeat center center;
              background-size:100% 100%;
              vertical-align: middle;
              z-index: 2;
          }
          .tiwce{
            float: left;
            vertical-align: middle;
            width: 20%;
            position: relative;
            left: 50%;
            margin-left: -20%;
            font-size: 0.28rem;
            color: #AAAAAA;
            z-index: 2;
            span{
              color: #0599F6;
            }
          }
          .timer{
            float: right;
            font-size: 0.28rem;
            color: #AAAAAA;
            z-index: 2;
          }
        }
        .audio_progress{
            position: absolute;
            top: 0;
            left: 0;
            height: 0.88rem;
            background:#F4F4F4;
            width: 30%;
            z-index: 1;
          }
      }
    
  }
}
</style>
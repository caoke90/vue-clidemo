<template>
  <!--音频-->
  <div class="question_cot audio_cot">
    <div class="audio_warp clearfix">
        <p class="audio_btn"></p>
        <p class="tiwce">第<span>1</span>/2遍</p>
        <p class="timer">00:20</p>
    </div>
    <div class="audio_progress"></div>
  </div>
</template>

<script>
  //组件通信
  import Bus from '../../common.js';

  export default {
    name: "audioBase",
    data() { 
      return {}
    }
  }
</script>

<style rel="stylesheet/scss" type="text/css" lang="scss" scoped>
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
</style>
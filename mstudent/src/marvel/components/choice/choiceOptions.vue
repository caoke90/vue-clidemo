<template>
  <div class="options_warp">
    <ul class="option_list">
      <li class="option_item clearfix active">
        <label class="option_index">A</label>
        <p class="option_content">
          <span>none</span>
        </p>
      </li>
      <li class="option_item clearfix right">
        <label class="option_index">B</label>
        <p class="option_content">
          <span>none</span>
        </p>
      </li>
      <li class="option_item clearfix wrong">
        <label class="option_index">C</label>
        <p class="option_content">
          <span>none</span>
        </p>
      </li>
    </ul>
  </div>
</template>

<script>
  //组件通信
  import Bus from '../../common.js';

  export default {
    name: "choiceOptions",
    data() {
      return {}
    }
  }
</script>

<style rel="stylesheet/scss" type="text/css" lang="scss" scoped>
  .options_warp{
    width: 100%;
    padding: 0 0.3rem;
    .option_list{
      width: 100%;
      .option_item{
        box-shadow: 1px 1px 5px #ddd;
        width: 100%;
        padding: 0 0.3rem;
        min-height: 1rem;
        line-height: 1rem;
        background: #ffffff;
        border-radius: 4px;
        font-size: 0.28rem;
        color: #171717;
        margin-top: 0.32rem;
        &.active{
            border:1px solid #0599F6;
            background: rgba(5,153,246,0.10);
            color: #0599F6;
            .option_content{
              border-left: 1px solid #0599F6;
            }
        }
        &.right{
          background: rgba(20,184,87,0.10);
          border:1px solid #14B857;
          color: #14B857;
          .option_content{
              border-left: 1px solid #14B857;
            }
        }
        &.wrong{
          background: rgba(249,72,82,0.10);
          border:1px solid #F94852;
          color: #F94852;
          .option_content{
              border-left: 1px solid #F94852;
            }
        }
        .option_index{
          vertical-align: middle;
          padding-right: 0.2rem;
        }
        .option_content{
            display: inline-block;
            font-size: 0.28rem;
            vertical-align: middle;
            margin-left: 0.2rem;
            max-width: 90%;
            word-break: break-word;
            line-height: normal;
            margin: 0.2rem 0;
            border-left: 1px solid #AAA;
            padding-left: 0.2rem;
            span{
              line-height: 100%;
            }
        }
      }
    }
    
  }

</style>
<template>
  <div class="container">
    <h3>最近更新时间：{{buildTime}}</h3>

    <h2>错题本</h2>
    <ul class="list">
      <li>
        <a href="/mstudent/demo.html" target="_blank">demo</a>
      </li>
      <li>
        <a href="/mstudent/ctb_jqlx.html" target="_blank">假期练习</a>
      </li>
      <li>
        <a href="/mstudent/ctb_dzctlist.html" target="_blank">订正错题列表</a>
      </li>
      <li>
        <a href="/mstudent/ctb_dzctdetail.html" target="_blank">订正错题详情</a>
      </li>
      <li>
        <a href="/mstudent/ctb_tmjx.html" target="_blank">题目解析</a>
      </li>
      <li>
        <a href="/mstudent/ctb_ltgg.html" target="_blank">类题巩固</a>
      </li>
        <li>
            <a href="/mstudent/wrongDetail.html" target="_blank">错题详情</a>
        </li>
    </ul>

  </div>
</template>

<script>
  import { Group, Cell } from 'vux'

  export default {
    name: 'HelloWorld',
    data () {
      return {
        buildTime:process.env.buildTime
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss" type="text/css" rel="stylesheet/scss">
  .container{
    max-width:750px;
    margin: 0 auto;
    color: #666;
    font-size: 0.28rem;
    padding:0 0.4rem;
    h2{
        font-size:0.4rem ;
        margin: 0.2rem 0;
    }
  }
  .list{
    font-size: 0.32rem;
    line-height: 0.3rem;
      li{
          line-height:0.42rem;
          margin-bottom:0.2rem;
      }
  }
</style>

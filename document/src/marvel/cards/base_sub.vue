<template>
  <div class="card card11">
    <div class="btn remove" v-if="card.isselect" @click="toggle">移除</div>
    <div class="btn" v-else @click="toggle">选入</div>

    <div class="top">
      <span class="status" v-if="card.isused">使用过</span>
      <span v-text="card.typetitle"></span>
    </div>
    <!--单词跟读-->
    <div class="main " v-if="card.type==='type1'">
      <div class="img" v-if="card.img" style="margin-bottom: 0.3rem;height: 1.6rem;">
        <img src="#">
      </div>
      <div class="play">
        <span class="playIcon"></span>
        <span>stay up <b>late</b></span>
      </div>
    </div>
    <!--句子跟读-->
    <div class="main " v-if="card.type==='type2'">
      <div class="img" v-if="card.img" style="margin-bottom: 0.3rem;">
        <img src="#">
      </div>
      <div class="play">
        <span class="playIcon"></span>
        <span>stay up late</span>
      </div>
    </div>
    <!--选择题-->
    <div class="main" v-else-if="card.type==='type3'">
      <div class="select">
        <div class="title" v-text="card.title"></div>
        <div class="li" v-for="(item,key) in card.list" :class="{active:card.curindex==key}" :key="key">
          {{selectword[key]}}{{item}}
        </div>
      </div>
    </div>
    <!--单词拼写-->
    <div class="main " v-else-if="card.type==='type4'">
      <div class="img">
        <img src="#">
      </div>
      <div class="word">
        visitor
      </div>
      <div class="wordsplit">
        <span>v</span>
        <span>i</span>
        <span>s</span>
        <span>i</span>
        <span>t</span>
        <span>o</span>
        <span>r</span>
      </div>
    </div>
    <!--句子拼写-->
    <div class="main " v-else-if="card.type==='type5'">
      <div class="sentence">
        <span>I</span>
        <span>want</span>
        <span>go</span>
        <span>to</span>
        <span>school</span>
        <span>by</span>
        <span>bike</span>
        <span>tomorrow.</span>
      </div>
      <div class="sentence2">明天我想起自行车去学校。</div>
      <div class="wordsplit wordsplit2">
        <span>go</span>
        <span>want</span>
        <span>school</span>
        <span>by</span>
        <span>I</span>
        <span>bike</span>
        <span>to</span>
        <span>tomorrow</span>
      </div>
    </div>
    <!--逐句朗读-->
    <div class="main " v-else-if="card.type==='type6'">
      <div class="select">
        <div class="title" v-text="card.title"></div>
        <div class="li2" v-for="(item,key) in card.list" :key="key"><span class="playIcon"></span>{{item}}</div>
      </div>
    </div>
    <!--段落朗读-->
    <div class="main " v-else-if="card.type==='type7'">
      <div class="select">
        <div class="title" v-text="card.title"></div>
        <div class="section">
          <div style="margin-bottom: 0.2rem;"><span class="playIcon"></span></div>
          <p v-html="card.section"></p></div>
      </div>
    </div>
    <!--情景对话-->
    <div class="main" v-else-if="card.type==='type8'" style="padding-top: 0.2rem;">
      <div v-for="item in card.list" class="sayli">
        <div  :class="item.type=='M'?'rmsgbox':'msgbox'">
          <span class="playIcon"></span>
          <div class="msgp">
            <div class="msgli">
              {{item.msg}}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="back">题目反馈</div>
  </div>
</template>

<script>

  export default {
    name: 'card11',

    props: ['card'],
    methods: {
      toggle: function () {
        this.card.isselect = !this.card.isselect;
      }
    },
    data: function () {
      return {
        selectword: ['A.', 'B.', 'C.', 'D.']
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style rel="stylesheet/scss" type="text/css" lang="scss" scoped>
  .card11 {
    background: #FFFFFF;
    padding: 0.4rem;
    position: relative;
    .btn {
      position: absolute;
      top: 0.32rem;
      right: 0.32rem;
      background: rgba(0, 122, 255, 0.05);
      border: 0.02rem solid #007AFF;
      border-radius: 2rem;
      padding: 0 0.26rem;
      font-size: 0.28rem;
      color: #007AFF;
      font-family: PingFangSC-Regular;
      text-align: center;
      line-height: 0.52rem;
      cursor: pointer;
    }
    .btn.remove {
      background: #007AFF;
      border-radius: 2rem;
      color: #fff;
    }
    .back {
      padding-top: 0.1rem;
      font-size: 0.24rem;
      line-height: 0.36rem;
      color: #9D9FA1;
      text-align: right;
    }
    .top {
      line-height: 0.4rem;
      font-size: 0.28rem;
      color: #58595E;
      margin-bottom: 0.2rem;
      overflow: hidden;
      text-overflow:ellipsis;
      white-space: nowrap;
      padding-right: 1rem;
      .status {
        border: 1px solid #4BA0FF;
        border-radius: 0.04rem;
        color: #4BA0FF;
        font-size: 0.22rem;
        line-height: 0.32rem;
        padding: 0 0.09rem;
        display: inline-block;
        margin-right: 0.2rem;
      }

    }
    .main {
      min-height: 0.4rem;
    }
    .img {
      margin-bottom: 0.2rem;
      img {
        width: 2.4rem;
        height: 1.6rem;
      }
    }
    .play {
      font-size: 0.3rem;
      color: #171717;
      line-height: 0.54rem;
      b{
        font-weight: bolder;
      }
    }
    .playIcon {
      width: 0.44rem;
      height: 0.44rem;
      position: relative;
      top: 0.04rem;
      vertical-align: text-bottom;
      display: inline-block;
      margin-right: 0.2rem;
      background: url("../assets/img/play.png") no-repeat;
      background-size: 0.44rem 0.44rem;
    }
    .select {
      .title {
        line-height: 0.54rem;
        margin-bottom: 0.3rem;
        font-family: PingFangSC-Regular;
        font-size: 0.36rem;
        color: #171717;
      }
      .li {
        line-height: 0.4rem;
        font-size: 0.28rem;
        margin-bottom: 0.12rem;
        color: #58595E;
      }
      .li2 {
        margin-bottom: 0.4rem;
        line-height: 0.4rem;
        font-size: 0.28rem;
        color: #58595E;
      }
      .li.active {
        color: #007AFF;
      }
      .section {
        position: relative;
        line-height: 0.45rem;
        font-size: 0.3rem;
      }
    }

    .word {
      font-family: PingFangSC-Regular;
      font-size: 0.36rem;
      color: #171717;
      line-height: 0.54rem;
      margin-bottom: 0.1rem;
    }
    .wordsplit {
      font-size: 0.32rem;
      color: #58595E;
      line-height: 0.34rem;
      span {
        margin-right: 0.08rem;
        background: #FFFFFF;
        border: 1px solid #CCCCCC;
        border-radius: 0.04rem;
        padding: 0 0.1rem;
        min-width: 0.36rem;
        text-align: center;
        display: inline-block;
        margin-bottom: 0.14rem;
      }
    }
    .sentence {
      line-height: 0.54rem;
      font-size: 0.36rem;
      color: #007AFF;
      margin-bottom: 0.4rem;
      span {
        border-bottom: 0.03rem solid #007AFF;
      }
    }
    .sentence2 {
      font-size: 0.28rem;
      color: #58595E;
      line-height: 0.4rem;
      margin-bottom: 0.22rem;
    }
    .wordsplit2 {
      padding-bottom: 0.42rem;
    }

    .sayli{
      margin-bottom: 0.4rem;
        .msgp{
          margin-bottom: 0.1rem;
        }
      .msgbox{
        padding-left: 0.64rem;
        position: relative;
        .playIcon{
          position: absolute;
          top: 0;
          left: 0;
        }
        .msgli{
          display: inline-block;
          min-width: 0.4rem;
          max-width: 5rem;
          background: #F2F8FF;
          color: #58595E;
          border-radius: 0 0.1rem 0.1rem 0.1rem;
          padding: 0.14rem 0.2rem;
        }
      }
      .rmsgbox{
        padding-right: 0.64rem;
        position: relative;
        text-align: right;
        .playIcon{
          position: absolute;
          top: 0;
          right: 0;
          margin-right: 0;
        }
        .msgli{
          display: inline-block;
          min-width: 0.4rem;
          max-width: 5rem;
          background: #007AFF;
          border-radius: 0.1rem 0 0.1rem 0.1rem;
          padding: 0.14rem 0.2rem;
          color: #FFFFFF;
        }
      }
    }
  }

</style>

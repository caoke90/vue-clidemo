<template>
    <div>
        <div class="container" v-if="status==='loaded'">
            <div class="contentbox">
                <div class="title">选择复习内容</div>
                <div class="fxBox" :class="[seleWord? 'selectActive':'']" v-if="pageData.review_content.word_count!=0 && pageData.review_content.word_count" @click="selectType('word')">
                    <div class="content">
                        <div class="boxTitle">单词</div>
                        <div class="text">
                            <p> <label>内容:</label>重点词逐个单元抽查</p>
                            <p> <label>题型:</label>{{pageData.review_content.word_type}}</p>
                        </div>
                    </div>
                    <span class="seletedIcon"></span>
                </div>
                <div class="fxBox" :class="[seleText ? 'selectActive':'']"  v-if="pageData.review_content.text_count!=0 && pageData.review_content.text_count" @click="selectType('text')">
                    <div class="content">
                        <div class="boxTitle">课文</div>
                        <div class="text">
                            <p> <label>内容:</label>共<span>{{pageData.review_content.text_count}}</span>篇重点课文<span class="infoIcon" @click.stop="showUnit"><i class="info" ></i></span></p>
                            <p> <label>题型:</label>{{pageData.review_content.text_type}}</p>
                        </div>
                    </div>
                    <span class="seletedIcon"></span>
                </div>
            </div>
            <div class="contentbox">
                <div class="title">选择复习计划</div>
                <div class="planData clearfix">
                    <div class="dataBox"
                         :class="{dataActive:currPlan==item}"
                         v-for="(item,index) in planData.days" :key="index" @click="selectPlan(item,index)">
                        <p class="data"><span>{{item.day}}</span>天</p>
                        <p class="minutes">{{item.daily_work}}</p>
                    </div>
                </div>
                <p class="caution">提示：学生按顺序开启，自行把握复习进度</p>
            </div>
            <div class="submitWork">
                <button @click="commitHomework">一键发布</button>
            </div>
            <template>
                <Dialog ref="myDialog" :confirmModalOptions="confirmOptions"></Dialog>
            </template>
        </div>
        <template v-else-if="status==='error'">
            <msg style="height: 5rem;" :card="{type:'error'}"></msg>
        </template>
    </div>
</template>

<script>
import Dialog from "../components/cards/dialog.vue";
import {
  showToast,
  updateTitle,
  getInitParams
} from "../common/js/external";
import { forwardPage } from "../common/js/external/teacher";
import msg from "../components/cards/msg.vue";
import ajax from "../api/ajax";
export default {
  name: "consolidate",
  components: {
    Dialog,
    msg
  },
  data() {
    return {
      status: "loading",
      review_type: "",
      seleWord: true,
      seleText: true,
      currPlan: [],
      planData: [],
      pageData: {
        review_content: {},
        review_plan: []
      },
      confirmOptions: {
        title: "课文详情",
        type: "comfirm",
        textAlign: "left",
        btnSubmitText: "我知道了"
      },
      bk_id: ""
    };
  },
  methods: {
    init: function(pageData) {
      this.pageData.review_content = pageData.review_content;
      this.pageData.review_plan = pageData.review_plan;
      if (pageData.review_content.word_count == 0) {
        this.review_type = "text";
      } else if (pageData.review_content.text_count == 0) {
        this.review_type = "word";
      } else {
        this.review_type = "word_text";
      }
      this.changePlan(this.review_type);
    },
    refreshData: async function() {
      const { data } = await ajax.post(
        "/v1/finalReview/basicsConsolidate",
        { bk_id: this.bk_id }
      );
      if (data.result == "success") {
        this.status = "loaded";
        this.init(data.data);
      } else {
        this.status = "error";
      }
    },
    changePlan(reviewType) {
      this.pageData.review_plan.forEach((item, index) => {
        if (item.type == reviewType) {
          this.planData = item;
          item.days.forEach((b, k) => {
            if (reviewType == "word" || reviewType == "word_text") {
              if (b.day == 15) {
                this.currPlan = b;
              }
            } else {
              this.currPlan = item.days[item.days.length - 1];
            }
          });
        }
      });
    },
    showUnit() {
      this.$refs.myDialog.showModel();
      this.confirmOptions.content = this.pageData.review_content.text_info;
    },
    selectType(type) {
      if (type == "word") {
        if (this.seleWord && !this.seleText) {
          showToast("至少选中一种复习内容");
        } else {
          this.seleWord = !this.seleWord;
          this.review_type =
            this.seleWord && this.seleText ? "word_text" : "text";
        }
      } else if (type == "text") {
        if (this.seleText && !this.seleWord) {
          showToast("至少选中一种复习内容");
        } else {
          this.seleText = !this.seleText;
          this.review_type =
            this.seleWord && this.seleText ? "word_text" : "word";
        }
      }
      this.changePlan(this.review_type);
    },
    selectPlan(item, index) {
      this.currPlan = item;
    },
    commitHomework() {
      let daysparams = Object.assign({}, this.currPlan);
      let params = {
        type: "goNewCommitArrangement",
        params: {
          type: 0,
          time: this.currPlan.day,
          days: daysparams
        }
      };
      forwardPage(params);
    }
  },
  created: async function() {
    updateTitle("单词/课文", "", "");
    let params = getInitParams();
    this.bk_id = params.bk_id;
    await this.refreshData();
  }
};
</script>

<style rel="stylesheet/scss" type="text/css" lang="scss" scoped>
    @media screen and (max-width: 375px){
        .container{
            padding-bottom: 1.2rem !important;
        }
    }
.container {
  max-width: 750px;
  margin: 0 auto;
  font-size: 0.28rem;
  padding-bottom: 0.42rem;
  .contentbox {
    padding: 0.2rem 0;
    margin-bottom: 0.2rem;
    width: 100%;
    .title {
      font-size: 0.28rem;
      margin-bottom: 0.23rem;
      color: #58595e;
      padding: 0 0.32rem;
      border-left: 4px solid #007aff;
      line-height: 1;
    }
    .caution {
      font-size: 0.24rem;
      color: #9d9fa1;
      line-height: 0.42rem;
      padding-left:0.32rem;
    }
    .planData {
      margin: 0 0.32rem;
      .dataBox {
        width: calc(50% - 0.16rem);
        float: left;
        margin-right: 0.32rem;
        margin-bottom: 0.32rem;
        height: 1.6rem;
        text-align: center;
        padding: 0.26rem 0;
        border-radius: 5px;
        background: #ffffff;
        box-sizing: border-box;
        -webkit-box-sizing: border-box;
        &:nth-child(even){
             margin-right: 0;
         }
        .data {
          color: #171717;
          font-weight: bold;
          font-size: 0.32rem;
          span {
            font-family: DIN-Medium;
            font-size: 0.6rem;
          }
        }
        .minutes {
          font-size: 0.24rem;
          color: #58595e;
          line-height: 0.36rem;
          span {
            margin: 0 0.08rem;
          }
        }
      }
      .dataActive {
        border:0.02rem solid #007AFF;
        background: #F2F8FF;
        .data {
          color: #007AFF;
        }
        .minutes {
          color: #007AFF;
        }
      }
    }
    .fxBox {
      background: #ffffff;
      border-radius: 5px;
      margin: 0 0.32rem 0.24rem;
      position: relative;
      padding: 0.24rem 0.32rem;
      .seletedIcon {
        position: absolute;
        right: 0.4rem;
        top: 50%;
        margin-top: -0.21rem;
        width: 0.42rem;
        height: 0.42rem;
        background: url("../assets/img/select.png") no-repeat;
        background-size: contain;
      }
      &:last-child {
        margin-bottom: 0;
      }
      .boxTitle {
        font-size: 0.36rem;
        color: #171717;
        margin-bottom: 0.16rem;
        font-weight: bold;
        line-height: 0.48rem;
      }
      .text {
        font-size: 0.24rem;
        color: #58595e;
        p {
          line-height: 0.36rem;
            .infoIcon{
                display: inline-block;
                width: 0.6rem;
                height: 0.6rem;
                vertical-align: middle;
            }
          .info {
            width: 0.32rem;
            height: 0.32rem;
            display: inline-block;
           margin-top: 0.1rem;
            background: url("../assets/img/info.png") no-repeat;
            background-size: contain;
            vertical-align: middle;
          }
          &:first-child {
            margin-bottom: 0.1rem;
          }
          label {
            margin-right: 0.1rem;
          }
          span {
            margin: 0 0.1rem;
          }
        }
      }
    }
    .selectActive {
      .seletedIcon {
        background: url("../assets/img/select_active.png") no-repeat;
        background-size: contain;
      }
    }
  }

@media only screen and (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3){
    .submitWork{
        padding-bottom: 0.54rem !important;
    }
}
  .submitWork {
    max-width: 750px;
    margin: 0 auto;
    width: 100%;
    transform: translate(-50%);
    -webkit-transform: translate(-50%);
    padding: 0.2rem 0;
    position: fixed;
    left: 50%;
    bottom: 0rem;
    background: #ffffff;
    text-align: center;
    button {
      width: 89%;
      border: none;
      outline: none;
      height: 0.8rem;
      line-height: 0.8rem;
      font-size: 0.32rem;
      color: #ffffff;
      background: #007aff;
      text-align: center;
      border-radius: 30px;
      -webkit-user-select: none;
      -moz-user-select: none;
      user-select: none;
      &:active {
        background: #0062d9;
      }
    }
  }
}
@font-face {
    font-family: DIN-Medium;
    src: url('../assets/font/DIN-Medium.otf');
}
@font-face {
    font-family: DIN-Regular;
    src: url('../assets/font/DIN-Regular.otf');
}
</style>
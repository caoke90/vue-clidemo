<template>
    <div>
        <p class="textbook">{{curTextbook}} <span class="changeTextbook" @click="changeTextbook">切换教材 </span></p>
        <template v-if="hasMessage&&BkIdShow">
                <div class="BasicsStrengthen" v-if="basics.title">
                  <h3>基础巩固</h3>  
                  <div class="BasicsStrengthenCover">
                      <div class="BasicsStrengthenContent" @click="enterBasics">
                          <p class="bs_title word" >
                            <span class="coverMask" v-if="(basics.classNum&&basics.waitReleaseClassNum==0)||basics.isOverdue"></span>
                              <span class="title">单词 / 课文</span>
                              <span class="describe">{{basics.content}}</span>
                              <i class="arrowR" v-if="!((basics.classNum&&basics.waitReleaseClassNum==0)||basics.isOverdue)"></i>
                          </p>
                          <p class="hasPublish" v-if="!(basics.isOverdue)&&basics.gradeClassNum&&basics.classNum&&basics.gradeWaitReleaseClassNum!=0&&basics.waitReleaseClassNum!=0">你有{{basics.gradeWaitReleaseClassNum}}个班级待发布</p>
                          <p class="hasPublish" v-if="!(basics.isOverdue)&&basics.gradeClassNum&&basics.classNum&&basics.gradeWaitReleaseClassNum==0&&basics.waitReleaseClassNum!=0">{{curClass}}年级已经全部发布</p>
                          <p class="hasAllPublish" v-if="!(basics.isOverdue)&&basics.classNum&&basics.waitReleaseClassNum==0">所有班级全部发布</p>
                          <p class="hasAllPublish" v-if="basics.isOverdue">基础巩固发布时间已截止</p>
                      </div>               
                  </div>
              </div>
              <div class="difficultPointStrengthen" v-if="difficultPointShow.length>0">
                  <h3>重难点攻克</h3>  
                  <div class="BasicsStrengthenCover">
                      <div class="BasicsStrengthenContent " v-for="(item,index) in difficultPointlist" v-if="item.show==1" :class="{'margB5':index!=0}">
                            <p class="bs_title difficultPoint"  :class="{yufa:item.type=='vacabGrammar',tingli:item.type=='listen',gaopin:item.type=='lessonWrong'}" @click="enterdiffPoint(item)">
                                <span class="title">{{item.title}}</span>
                                <span class="describe">{{item.describe}}</span>
                                <i class="arrowR"></i>
                            </p>
                      </div>
                  </div>
              </div>
              <div class="comprehensiveTesting " >
                  <h3>综合检测</h3>  
                  <div class="BasicsStrengthenCover marB5" v-if="comprehensiveTestingList.length">
                      <div class="overflowHidden">
                          <div class="BasicsStrengthenContent" v-for="(item,index) in comprehensiveTestingList" :class="{'hasBorderTop':index!=0}" @click="enterDetail(item)">
                              <p class="bs_title comprehensive">
                                  <span class="title comprehensiveT">{{item.name}}</span>
                                  <span class="describeLabel" >{{item.type_title}}</span>
                                  <span class="describeLabel"  >{{item.source}}</span>
                                  <i class="arrowR"></i>
                              </p>
                          </div>
                      </div>
                  </div>
              </div>
              <div class="finalArea">
                  <span class="review" @click="enterReview">复习专区</span>
                  <span class="lsp" @click="enterLsp">听说专区</span>
              </div>
        </template>
        <template v-else>
          <div class="noBkId">
              <i class="noBKImg"></i>
              <p class="txt">该教材暂无内容，建议换本教材试试</p>
          </div>
        </template>
    </div>
</template>
<script>
import ajax from "../../api/ajax";
import Cart from "../../api/cart";
import { getInitParams } from "../../common/js/external/index";
import { forwardPage } from "../../common/js/external/teacher";
import { sendLog } from "../../common/js/logger";
export default {
  data() {
    return {
      curTextbook: "人教新目标七年级上", //当前教材
      curClass: 8,
      curBk_id: "BK_20300003526200",
      region_id: "",
      term_id: 1,
      BkIdShow: 1,
      basics: {
        content: "一键发布省心省力",
        title: "单词/课文",
        waitReleaseClassNum: 0,
        classNum: 0,
        gradeWaitReleaseClassNum: 0,
        gradeClassNum: 0,
        isOverdue: false
      },
      difficultPointlist: [
        //重难点强化
        {
          type: "vacabGrammar",
          show: 0,
          title: "词汇语法",
          describe: "重点词汇语法全面覆盖",
          url: "/mteacher/grammarUnitList.html"
        },
        {
          type: "listen",
          show: 0,
          title: "听力",
          describe: "当地中考听力题型专练",
          url: "/mteacher/listenUnitList.html"
        },
        {
          type: "lessonWrong",
          show: 0,
          title: "高频错题",
          describe: "本市高频易错题按周汇总",
          url: "/mteacher/lessonWrongPackageList.html"
        }
      ],
      comprehensiveTestingList: []
    };
  },
  computed: {
    difficultPointShow() {
      let Pointlist = this.difficultPointlist.filter(ele => {
        return ele.show == 1;
      });
      return Pointlist;
    },
    hasMessage() {
      return (
        this.difficultPointShow.length > 0 ||
        this.basics.title ||
        this.comprehensiveTestingList.length > 0
      );
    }
  },
  methods: {
    //更新购题车
    refreshCart: async function(refresh) {
      if (refresh) {
        await Cart.refresh();
      }
    },
    enterdiffPoint: function(value) {
      let data;
      if (value.type == "vacabGrammar") {
        data = {
          url:
            window.location.origin +
            "/mteacher/grammarUnitList.html?bk_id=" +
            this.curBk_id,
          needCart: true
        };
        sendLog("", "", {
          event: "onlineEn_FinalExamReview_ClickModule",
          logData: {
            platformType: "H5",
            proSource: "发布",
            moduleName: "词汇语法"
          }
        });
      } else if (value.type == "listen") {
        data = {
          url:
            window.location.origin +
            "/mteacher/listenUnitList.html?bk_id=" +
            this.curBk_id,
          needCart: true
        };
        sendLog("", "", {
          event: "onlineEn_FinalExamReview_ClickModule",
          logData: {
            platformType: "H5",
            proSource: "发布",
            moduleName: "听力"
          }
        });
      } else if (value.type == "lessonWrong") {
        data = {
          url:
            window.location.origin +
            "/mteacher/lessonWrongPackageList.html?bk_id=" +
            this.curBk_id,
          needCart: true
        };
        sendLog("", "", {
          event: "onlineEn_FinalExamReview_ClickModule",
          logData: {
            platformType: "H5",
            proSource: "发布",
            moduleName: "高频错题"
          }
        });
      }
      forwardPage(data);
    },
    changeTextbook: function() {
      //切换教材
      let data = {
        type: "selectTeacherMaterial",
        params: { selectBookId: this.curBk_id }
      };

      forwardPage(data);
    },
    enterReview: function() {
      //点击复习专区
      let data = {
        type: "junior_revise",
        params: { source: "term_review", showConfirmPop: true },
        needCart: true
      };
      sendLog("", "", {
        event: "onlineEn_FinalExamReview_ClickModule",
        logData: {
          platformType: "H5",
          proSource: "发布",
          moduleName: "复习专区"
        }
      });
      forwardPage(data);
    },
    enterLsp: function() {
      //点击听说专区
      let data = {
        type: "junior_listen_and_speak",
        params: { source: "term_review", showConfirmPop: true },
        needCart: true
      };
      sendLog("", "", {
        event: "onlineEn_FinalExamReview_ClickModule",
        logData: {
          platformType: "H5",
          proSource: "发布",
          moduleName: "听说专区"
        }
      });
      forwardPage(data);
    },
    enterBasics: function() {
      let data;
      if (
        (!this.basics.isOverdue &&
          this.basics.classNum &&
          this.basics.waitReleaseClassNum == 0) ||
        this.basics.isOverdue
      ) {
      } else {
        data = {
          type: "finalReview",
          url:
            window.location.origin +
            "/mteacher/consolidate.html?bk_id=" +
            this.curBk_id,
          needCart: false
        };
        sendLog("", "", {
          event: "onlineEn_FinalExamReview_ClickModule",
          logData: {
            platformType: "H5",
            proSource: "发布",
            moduleName: "单词课文"
          }
        });
        forwardPage(data);
      }
    },
    enterDetail: function(value) {
      let type_title = value.type_title;
      let data = {
        url:
          window.location.origin +
          "/mteacher/finalComprehensiveDetection.html?paper_id=" +
          value.id +
          "&region_id=" +
          this.region_id +
          "&grade_id=" +
          this.curClass +
          "&term_id=1",
        needCart: true
      };
      sendLog("", "", {
        event: "onlineEn_FinalExamReview_ClickModule",
        logData: {
          platformType: "H5",
          proSource: "发布",
          moduleName: "综合检测-" + type_title
        }
      });
      forwardPage(data);
    },
    async getcontent() {
      let params = {};
      params.bk_id = this.curBk_id;
      console.log(params);

      return await ajax.post("/v1/finalReview/index", params);
    },
    async getbkcontent() {
      return await ajax.post("/pc/v1/assign/loadUlTree");
    },
    //获取首页内容
    getindexData: async function() {
      const resp = await this.getcontent();
      Bus.$emit("loading", true);
      if (resp.data.message == "ok") {
        Bus.$emit("event_status", "loaded");
        let resPData = resp.data.data;
        this.region_id = resPData.regionCode;
        this.basics.content = resPData.basics.content;
        this.basics.title = resPData.basics.title;
        this.basics.classNum = resPData.basics.classNum;
        this.basics.gradeClassNum = resPData.basics.gradeClassNum;
        this.basics.waitReleaseClassNum = resPData.basics.waitReleaseClassNum;
        this.basics.isOverdue = resPData.basics.isOverdue;
        this.basics.gradeWaitReleaseClassNum =
          resPData.basics.gradeWaitReleaseClassNum;
        this.comprehensiveTestingList = resPData.colligate;
        this.difficultPointlist.forEach(element => {
          for (let diff in resPData.difficulty) {
            if (element.type == diff) {
              element.show = resPData.difficulty[diff];
            }
          }
        });
      } else {
        Bus.$emit("event_status", "error");
      }

      Bus.$emit("loading", false);
    },
    // 获取教材信息
    getBkData: async function() {
      const resp = await this.getbkcontent();
      Bus.$emit("loading", true);
      if (resp.data.message == "ok") {
        Bus.$emit("event_status", "loaded");
        let respData = resp.data.data;
        this.curTextbook = respData.name;
        this.curClass = respData.clazz_level;
        this.curBk_id = respData._id;
        this.term_id = respData.term_type;
        if (this.curBk_id == "BK_20300003581689") {
          this.BkIdShow = 0;
        } else {
          this.BkIdShow = 1;
        }
      } else {
        Bus.$emit("event_status", "error");
      }
      Bus.$emit("loading", false);
    }
  },
  created: async function() {
    await this.getBkData();
    await this.getindexData();

    Bus.$on("refreshData", () => {
      let params = getInitParams(true);

      if (params.select_book_info) {
        this.curTextbook = params.select_book_info.name;
        this.curClass = params.select_book_info.clazz_level;
        this.curBk_id = params.select_book_info._id;
        this.term_id = params.select_book_info.term_type;
      }
      if (this.curBk_id == "BK_20300003581689") {
        this.BkIdShow = 0;
      } else {
        this.BkIdShow = 1;
      }
      Bus.$emit("loading", true);
      this.getindexData();
    });
    Bus.$on("refreshCart", () => {
      this.refreshCart(true);
    });
    // 如果购题车超出限制不能添加成功需要把select变更为false
    Bus.$on("updateCart", () => {
      this.refreshCart(false);
    });
  }
};
</script>

<style rep="stylesheet/scss" type="text/css" lang="scss" scoped>
.textbook {
  padding: 0 0.32rem;
  width: 100%;
  height: 0.88rem;
  line-height: 0.88rem;
  background: #ffffff;
  font-family: PingFangSC-Regular;
  font-size: 0.28rem;
  color: #171717;
  box-sizing: border-box;
  -webkit-box-sizing: border-box;
  .changeTextbook {
    font-size: 0.24rem;
    color: #007aff;
    letter-spacing: 0;
    width: 1.5rem;
    height: 100%;
    float: right;
    padding-right: 0.3rem;
    text-align: right;
    background: url("../../assets/img/changeTextBookArrow.png") no-repeat center
      right;
    background-size: 0.24rem 0.24rem;
  }
}
.BasicsStrengthen,
.difficultPointStrengthen,
.comprehensiveTesting {
  width: 100%;
  h3 {
    position: relative;
    font-size: 0.28rem;
    color: #58595e;
    letter-spacing: 0;
    height: 0.98rem;
    padding: 0 0.32rem;
    line-height: 0.98rem;
    &::before {
      content: "";
      position: absolute;
      top: 50%;
      left: 0;
      height: 0.24rem;
      width: 0.08rem;
      background: #007aff;
      margin-top: -0.12rem;
    }
  }
  .BasicsStrengthenContent {
    position: relative;
    border-top: 1px solid transparent;
    &.hasBorderTop::before {
      position: absolute;
      content: "";
      width: 6.21rem;
      height: 0.02rem;
      background: #e6e6e6;
      top: 0;
      left: 0.32rem;
      -webkit-transform: scaleY(0.5);
      transform: scaleY(0.5);
    }
    &.noborderR {
      border-radius: 0;
    }
    &.margB5 {
      margin-top: 0.24rem;
    }
    border-radius: 0.12rem;
    background: #ffffff;
    width: 100%;
    .bs_title {
      position: relative;
      .coverMask {
        display: inline-block;
        width: 100%;
        height: 100%;
        z-index: 10;
        opacity: 0.5;
        background: #ffffff;
        position: absolute;
        left: 0;
        top: 0;
      }
      &.word {
        padding: 0.2rem 0.24rem 0.2rem 1.64rem;
        box-sizing: border-box;
        background: url("../../assets/img/word.png") no-repeat 0.24rem center;
        background-size: 1.24rem 1.26rem;
      }
      &.difficultPoint {
        padding: 0.32rem 0.2rem 0.2rem 1.64rem;
        box-sizing: border-box;
        &.yufa {
          background: url("../../assets/img/yufa.png") no-repeat 0.24rem center;
          background-size: 1rem 1rem;
        }
        &.tingli {
          background: url("../../assets/img/tingli.png") no-repeat 0.24rem
            center;
          background-size: 1rem 1rem;
        }
        &.gaopin {
          background: url("../../assets/img/gaopin.png") no-repeat 0.24rem
            center;
          background-size: 1rem 1rem;
        }
      }
      &.comprehensive {
        padding: 0.32rem 0.2rem 0.32rem 0.32rem;
        box-sizing: border-box;
      }
      .title {
        display: inline-block;
        font-weight: 700;
        line-height: 0.6rem;
        padding-right: 0.89rem;
        width: 100%;
        box-sizing: border-box;
        font-family: PingFangSC-Medium;
        font-size: 0.32rem;
        color: #171717;
        letter-spacing: 0;
        &.comprehensiveT {
          height: auto;
          line-height: 0.42rem;
          font-size: 0.28rem;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          font-weight: 500;
        }
      }
      .describe {
        display: inline-block;
        height: 0.5rem;
        width: 100%;
        font-size: 0.24rem;
        line-height: 0.4rem;
        color: #58595e;
      }
      .describeLabel {
        display: inline-block;
        border: 1px solid #007aff;
        margin: 0.16rem 0.1rem 0.1rem 0;
        line-height: 0.32rem;
        padding: 0 0.1rem;
        font-size: 0.22rem;
        color: #007aff;
        letter-spacing: 0;
        border-radius: 0.04rem;
      }
      .arrowR {
        position: absolute;
        height: 0.6rem;
        width: 0.6rem;
        display: inline-block;
        line-height: 0.6rem;
        top: 50%;
        margin-top: -0.3rem;
        right: 0.24rem;
        background: url("../../assets/img/nextArrow.png") no-repeat center;
        background-size: 0.4rem 0.4rem;
      }
    }

    .hasPublish {
      position: relative;
      &:before {
        content: "";
        height: 0.02rem;
        background: #e6e6e6;
        width: 6.86rem;
        position: absolute;
        left: 0;
        top: 0;
        -webkit-transform: scaleY(0.5);
        transform: scaleY(0.5);
      }
      padding: 0 0.32rem;
      height: 0.8rem;
      line-height: 0.8rem;
      font-size: 0.24rem;
      color: #007aff;
      letter-spacing: 0;
    }
    .hasAllPublish {
      position: relative;
      &:before {
        content: "";
        height: 0.02rem;
        background: #e6e6e6;
        width: 6.86rem;
        position: absolute;
        left: 0;
        top: 0;
        -webkit-transform: scaleY(0.5);
        transform: scaleY(0.5);
      }
      padding: 0 0.32rem;
      height: 0.8rem;
      line-height: 0.8rem;
      font-size: 0.24rem;
      color: #00c482;
      letter-spacing: 0;
      padding-left: 0.75rem;
      box-sizing: border-box;
      background: url("../../assets/img/publishover.png") no-repeat 0.32rem
        center;
      background-size: 0.3rem 0.3rem;
    }
  }
}
.BasicsStrengthenCover {
  padding: 0 0.32rem;
  border-radius: 0.12rem;
  //   margin-bottom: 0.2rem;
}
.finalArea {
  padding: 0 0.32rem;
  margin: 0rem 0 0.56rem 0;
  height: 1.3rem;

  span {
    &.lsp {
      margin-left: 2%;
      background: url("../../assets/img/lspzq.png") no-repeat 0.32rem center;
      background-size: 0.8rem 0.8rem;
    }
    &.review {
      margin-right: 2%;
      background: url("../../assets/img/reviewzq.png") no-repeat 0.32rem center;
      background-size: 0.8rem 0.8rem;
    }
    float: left;
    height: 100%;
    line-height: 1.28rem;
    text-align: left;
    display: block;
    background-color: #ffffff !important;
    width: 48%;
    padding-left: 1.44rem;
    box-sizing: border-box;
    border-radius: 0.12rem;
    font-size: 0.32rem;
    color: #171717;
    letter-spacing: 0;
  }
}
.noBkId {
  padding: 1.77rem 0.4rem 0 0.4rem;
  box-sizing: border-box;
  .noBKImg {
    width: 4rem;
    height: 4rem;
    background: url("../../assets/img/noContent.png") no-repeat center center;
    background-size: 4rem 4rem;
    position: relative;
    left: 50%;
    margin-left: -2rem;
    display: inline-block;
  }
  .txt {
    margin-top: 0.32rem;
    font-size: 0.28rem;
    color: #9d9fa1;
    letter-spacing: 0;
    text-align: center;
  }
}
.marB5 {
  margin-bottom: 0.5rem;
}
.noMarT {
  margin-top: 0;
}
.overflowHidden{
  width: 100%;
  position: relative;
  overflow: hidden;
  border-radius:12px;
  background: #FFFFFF;
}
</style>


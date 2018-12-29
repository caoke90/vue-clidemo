<template>
    <div>
        <template v-if="basics.length>0||otherAllCatch.length">
            <div class="BasicsStrengthen" v-if="basics.length>0">
                <h3>基础巩固</h3>  
                <div class="BasicsStrengthenCover" @click="enterFinalConsolidateReport">
                      <div class="BasicsStrengthenContent padN">
                            <p class="bs_title" >
                                <span class="title">{{basics[0]['name']}}</span>
                                <i class="arrowR"></i>
                            </p>
                      </div>               
                </div>
            </div>
            <div class="BasicsStrengthen" v-if="otherAllCatch.length">
                <h3 >重难点/综合  <span class="changeClass" @click="changeClass">{{curGrade}}</span></h3>  
                <div class="BasicsStrengthenCover marb32" v-for="(value,key) in otherAll" v-if="otherAll.length">
                    <div class="BasicsStrengthenContent" >
                        <p class="bs_time">{{value.time}} 星期{{value.week}}</p>
                        <div class="checkListCover">
                            <p class="checkList" v-for="(value1,key1) in value.children" @click="goReportDetail(value1)" :class="{'noBorderTop':key1==0}">
                                <span class="title">{{value1.clazz_name}} <i class="titlePro">{{value1.homeWorkStatus}}</i></span>
                                <span class="desc_title">{{value1.name}}</span>
                                <span class="desc_unit">{{value1.subtitle}}</span>
                                <span class="removeIcon" @touchmove.stop.prevent  @click.stop.prevent="cancelHomework(value1)"></span>
                                <span class="progress">
                                    <span class="overNum"><i class="nowNum">{{value1.finished_count}}</i> / {{value1.student_count}}</span>
                                    <!-- <span class="progressDes">完成进度</span> -->
                                </span>
                            </p>
                        </div>
                    </div>                  
                </div>
                <div class="otherNoClass" v-if="!otherAll.length">
                      本班级暂无此类型的作业~
                </div>
            </div>
        </template> 
        <template v-else>
           <div class="noBkId">
              <i class="noBKImg"></i>
              <p class="txt">您还未发布期末复习计划</p>
          </div>
        </template>
    </div>
</template>
<script>
// 日期时间
import Format from "../../utils/Format.js";
import ajax from "../../api/ajax";
import { getInitParams, setTopBarInfo } from "../../common/js/external/index";
import { forwardPage } from "../../common/js/external/teacher";
import { sendLog } from "../../common/js/logger";
import Bus from "../../marvel/bus";
export default {
  data() {
    return {
      curTextbook: "人教新目标七年级上",
      params: {
        bk_id: ""
      },
      basics: {},
      otherAll: [],
      otherAllCatch: [],
      clazz_list: []
    };
  },
  computed: {
    curGrade: function() {
      return Bus.changeClass.curGrade;
    }
  },
  methods: {
    cancelHomework(value1){
      Bus.$emit('popupVisible',value1)
    },
    enterFinalConsolidateReport() {
      let data = {
        type: "finalReview",
        url: window.location.origin + "/mteacher/finalConsolidateReport.html"
      };
      sendLog("", "", {
        event: "onlineEn_FinalExamReview_ClickModule",
        logData: {
          platformType: "H5",
          proSource: "检查",
          moduleName: "基础巩固"
        }
      });
      forwardPage(data);
    },
    // 去详情
    goReportDetail(reportItem) {
      let params = {
        type: "junior_check_homework",
        params: {
          homework_id: reportItem._id,
          homework_name: reportItem.name,
          close_time: reportItem.close_time,
          student_count: reportItem.student_count,
          finished_count: reportItem.finished_count
        }
      };
      sendLog("", "", {
        event: "onlineEn_FinalExamReview_ClickModule",
        logData: {
          platformType: "H5",
          proSource: "检查",
          moduleName: "其他"
        }
      });
      console.log(params);
      forwardPage(params);
    },
    changeClass: function() {
      Bus.changeClass.select = true;
    },
    async getcontent() {
      return await ajax.post(
        process.env.zxBaseUrl + "mteacher/ReviewHomework/reportList"
      );
    },
    getSortData: function(hw_list) {
      let otherAll = [];
      hw_list.forEach((item, index) => {
        item.time = new Date(item.create_time).Format("MM.dd");
        //判断班级作业状态
        if (item.include_subjective) {
          if (item.wait_crt_count > 0) {
            item.homeWorkStatus = "未批改";
          } else {
            if (item.is_overtime) {
              item.homeWorkStatus = "已结束";
            } else {
              item.homeWorkStatus = "进行中";
            }
          }
        } else {
          if (item.wait_crt_count > 0) {
            item.homeWorkStatus = "待查看";
          } else {
            if (item.is_overtime) {
              item.homeWorkStatus = "已结束";
            } else {
              item.homeWorkStatus = "进行中";
            }
          }
        }
        if (otherAll[item.time] == undefined) {
          otherAll[item.time] = [];
          otherAll[item.time].push(item);
        } else {
          for (let key in otherAll) {
            if (key == item.time) {
              otherAll[item.time].push(item);
            }
          }
        }
      });
      this.otherAll = [];
      console.log(otherAll);
      for (let key in otherAll) {
        let otherAllS = {};
        otherAllS.time = key;
        otherAllS.week = "日一二三四五六".charAt(
          new Date(otherAll[key][0]["create_time"]).getDay()
        );
        otherAllS.children = otherAll[key];
        this.otherAll.push(otherAllS);
      }
    },
    getindexData: async function() {
      const resp = await this.getcontent();
      // Bus.$emit("loading", true);

      if (resp.data.success == true) {
        Bus.$emit("event_status", "loaded");
        let resPData = resp.data.data;
        this.basics = resPData.jc_list;
        Bus.changeClass.clazz_list = [
          { clazz_id: "All", clazz_name: "全部年级" }
        ].concat(resPData.clazz_list); //把年级传到 changeClass 组件
        this.otherAllCatch = resPData.hw_list;
        if (this.otherAllCatch.length > 0) {
          this.getSortData(resPData.hw_list);
        }
      } else {
        Bus.$emit("event_status", "error");
      }
      // Bus.$emit("loading", false);
    },
    // 初始化
    init: async function(params) {
      await this.getindexData(params);
    }
  },
  watch: {
    curGrade: function() {
      let otherAll = [];
      if (this.otherAllCatch.length > 0) {
        this.otherAllCatch.forEach(value => {
          if (value.clazz_id == Bus.changeClass.curGradeId) {
            console.log(value);
            otherAll.push(value);
          } else if (Bus.changeClass.curGradeId == "All") {
            otherAll = this.otherAllCatch;
          }
        });
        this.getSortData(otherAll);
      }
    }
  },
  mounted: async function() {
    let params = getInitParams();
    await this.init(params);
    setTopBarInfo({
      show: true,
      rightText: ""
    });

    Bus.$on("refreshData", () => {
      this.init(params);
    });
  }
};
</script>

<style rep="stylesheet/scss" type="text/css" lang="scss" scoped>
.BasicsStrengthen {
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
    .changeClass {
      font-size: 0.24rem;
      color: #007aff;
      text-align: center;
      height: 0.5rem;
      float: right;
      margin-top: 0.25rem;
      padding-right: 0.4rem;
      padding-left: 0.2rem;
      border-radius: 0.25rem;
      line-height: 0.56rem;
      box-sizing: border-box;
      background: url("../../assets/img/changeClass.png") no-repeat;
      background-position: 93% center;
      background-size: 0.24rem 0.24rem;
      background-color: #ffffff !important;
    }
  }
  .BasicsStrengthenCover {
    &.marb32 {
      margin-bottom: 0.32rem;
    }
    padding: 0 0.32rem;
    border-radius: 0.2rem;
    .BasicsStrengthenContent {
      position: relative;
      border-radius: 0.2rem;
      background: #ffffff;
      width: 100%;
      &.padN {
        padding: 0.29rem 0 0.29rem 0.32rem;
      }
      .bs_time {
        padding: 0.19rem 0 0.19rem 0.76rem;
        font-size: 0.28rem;
        color: #58595e;
        letter-spacing: 0;
        background: url("../../assets/img/timeL.png") no-repeat 0.32rem center;
        background-size: 0.28rem 0.28rem;
        border-bottom: 1px solid #f2f3f4;
      }
      .bs_title {
        position: relative;
        .title {
          display: inline-block;
          // height: 0.6rem;
          line-height: 0.6rem;
          padding-right: 0.89rem;
          width: 100%;
          box-sizing: border-box;
          font-family: PingFangSC-Medium;
          font-size: 0.32rem;
          color: #171717;
          letter-spacing: 0;
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
      .checkList {
        .removeIcon{
          display: inline-block;
          position: absolute;
          width: 0.32rem;
          height: 0.32rem;
          top: 0.32rem;
          right: 0;
          background: url("../../assets/img/cancel.png") no-repeat center;
          background-size: 0.32rem 0.32rem;
        }
        .progress {
          position: absolute;
          right: 0;
          bottom: 0.32rem;
          display: inline-block;
          text-align: right;
          .overNum {
            font-family: DIN-Regular;
            text-align: right;
            font-size: 0.4rem;
            color: #9d9fa1;
            letter-spacing: 0;
            display: block;
            .nowNum {
              color: #171717;
            }
          }
          .progressDes {
            font-size: 0.22rem;
            color: #9d9fa1;
            letter-spacing: 0;
          }
        }
        position: relative;
        .noborderT {
          border-top: 1px solid transparent;
        }
        border-top: 1px solid #f2f3f4;
        padding: 0.41rem 0;
        box-sizing: border-box;
        .title {
          font-size: 0.32rem;
          display: block;
          color: #171717;
          letter-spacing: 0;
          line-height: 0.48rem;
          margin-bottom: 0.1rem;
          .titlePro {
            margin-left: 0.2rem;
            padding: 0 0.1rem;
            height: 0.32rem;
            border: 1px solid #007aff;
            display: inline-block;
            font-size: 0.22rem;
            color: #007aff;
            line-height: 0.32rem;
            text-align: center;
            letter-spacing: 0;
            vertical-align: 0.04rem;
            border-radius: 0.04rem;
          }
        }
        .desc_title,
        .desc_unit {
          display: block;
          font-size: 0.22rem;
          color: #58595e;
          letter-spacing: 0;
          line-height: 0.32rem;
          padding-right: 2rem;
          box-sizing: border-box;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
        }
      }
    }
  }
}
.checkListCover {
  padding: 0 0.32rem;
}
.noBkId {
  padding: 2.76rem 0.4rem 0 0.4rem;
  box-sizing: border-box;
  .noBKImg {
    width: 4rem;
    height: 4rem;
    background: url("../../assets/img/noBK1.png") no-repeat center center;
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
.otherNoClass {
  font-size: 0.28rem;
  color: #58595e;
  text-align: center;
  padding-top: 0.5rem;
}
.noBorderTop {
  border-top: 1px solid transparent !important;
}
@font-face {
    font-family: DIN-Medium;
    src: url('../../assets/font/DIN-Medium.otf');
}
@font-face {
    font-family: DIN-Regular;
    src: url('../../assets/font/DIN-Regular.otf');
}
</style>


<template>
    <div class="final-consolidate-report" >
        <div>
              <div class="sel-class" v-if="classList.length">
                <ul>
                    <li v-for='(classItem,index) in classList' 
                        :key='classItem.clazz_id' 
                        @click='selectClass(index)'
                        :class="{'active':activeIndex==index}">
                            {{classItem.clazz_name}}
                    </li>
                </ul>
            </div>
            <div class="exercise-list">
                <ul>
                    <li v-for='(reportItem,index) in reportList' :key='reportItem._id' v-if='reportItem' @click='goReportDetail(reportItem)'>
                        <div class="info">
                            <div class="title">Day {{index+1}}</div>
                            <div class="content">{{reportItem.subtitle_description_list[0]}} · {{reportItem.subtitle_description_list[1]}}</div>
                        </div>
                        <div class="progress">
                            <p><i>{{reportItem.finished_count}}</i> / {{reportItem.student_count}}</p>
                            <p>完成进度</p>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
        <div v-if="classList.length==0">
            <div class="noBkId">
                <p class="txt">报告生成中，请稍等…</p>
            </div>
        </div>
        <popup
            v-model="popupVisible"
            popup-transition="popup-fade"
            :closeOnClickModal='false'
            style='width:80%'
            class="alert-box">
            <h4>确定删除所有班级任务吗？</h4>
                <p>删除后，学生端任务和已完成记录都将被清空</p>
                <div class="operate">
                    <div class="btn" @click='popupVisible=false'>取消</div>
                    <div class="btn" @click='deleteReport'>确认</div>
                </div>
        </popup>
    </div>
    
</template>

<script>
import { sendLog } from "@/common/js/logger";
import ajax from "../api/ajax";
import {
  updateTitle,
  showToast,
  showLoadingView,
  closeLoading,
  setTopBarInfo,
  externalConfig
} from "../common/js/external/index";
import { forwardPage } from "../common/js/external/teacher";
import popup from "../components/mint/popup/popup.vue";
import { pageQueueBack } from "../common/js/external/pageQueue";
export default {
  data() {
    return {
      hwList: {},
      classList: [], //班级列表
      reportList: [], //展示报告列表
      activeIndex: 0, //当前班级index
      popupVisible: false //确认删除任务对话框
    };
  },
  methods: {
    watchExternalConf() {
      externalConfig({
        confirmOnQuit: "false"
      });
    },
    //获取数据
    async getListDay() {
      let resp = await ajax.post(
         process.env.zxBaseUrl +"mteacher/ReviewHomework/listDay"
      );
      if (resp.data.success == true) {
        let data = resp.data.data;
        if (data.hw_list instanceof Array) {
          this.classList = [];
        } else {
          this.hwList = data.hw_list;
          //获取班级列表
          for (let classItem in this.hwList) {
            this.classList.push({
              clazz_id: classItem,
              clazz_name: this.hwList[classItem][0].clazz_name
            });
          }
          //当前班级list
          let initClassId = Object.keys(this.hwList)[0];
          this.reportList = this.hwList[initClassId];
        }
      }
    },
    //选择班级
    selectClass(index) {
      this.activeIndex = index;
      var classId = this.classList[index].clazz_id;
      this.reportList = this.hwList[classId];
    },
    //删除报告
    async deleteReport() {
      this.popupVisible = false;
      showLoadingView("提交中");
      let resp = await ajax.post(
        process.env.zxBaseUrl + "mteacher/ReviewHomework/reportDelete"
      );
      closeLoading();
      if (resp.data.success) {
        sendLog("", "", {
          event: "onlineEn_FinalExamReview_DeleteHW",
          logData: { functionName: "删除作业" }
        });
        showToast("删除成功");
        setTopBarInfo({
          show: true,
          rightText: ""
        });
        // window.location.href = "/mteacher/finalReview.html#1";
        pageQueueBack({
          url: "/mteacher/finalReview.html#1",
          needReloadPage: true,
          needRefreshData: true
        });
      } else {
        showToast(resp.data.message);
      }
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
          finished_count: reportItem.finished_count,
          hideEndTimeView: true
        }
      };
      forwardPage(params);
    }
  },
  components: {
    popup
  },
  created() {
    updateTitle("单词 / 课文");
    setTopBarInfo({
      show: true,
      rightText: "删除",
      rightTextColor: "171717",
      needCallBack: true
    });
    this.watchExternalConf();
    // 提交按钮回调
    vox.task.setTopBarInfoCallBack = function() {
      this.popupVisible = true;
    }.bind(this);
    this.getListDay();
  }
};
</script>

<style scoped lang='less'>
.final-consolidate-report {
  background-color: #f5f6f7;
  color: #58595e;
  line-height: 1.5;
  .sel-class {
    position: fixed;
    z-index: 10;
    top: 0;
    width: 100%;
    height: 1rem;
    background-color: #fff;
    overflow: hidden;
    white-space: nowrap;
    ul {
      margin-top: 0.2rem;
      padding: 0 0.32rem;
      overflow-x: scroll;
      height: 0.6rem;
      line-height: 0.6rem;
      white-space: nowrap;
      li {
        display: inline-block;
        border-radius: 0.3rem;
        font-size: 0.3rem;
        padding: 0 0.28rem;
        margin: 0 0.04rem;
        &.active {
          background-color: #f2f8ff;
          color: #007aff;
        }
      }
    }
  }
  .exercise-list {
    position: absolute;
    width: 100%;
    top: 1rem;
    background-color: #fff;
    margin-top: 0.18rem;
    ul {
      li {
        padding: 0.38rem 0.4rem 0.36rem;
        border-bottom: 1px solid #e6e6e6;
        display: flex;
        &:nth-last-child(1) {
          border: none;
        }
        .info {
          display: inline-block;
          width: 75%;
          .title {
            font-size: 0.3rem;
            color: #171717;
            margin-bottom: 0.06rem;
          }
          .content {
            font-size: 0.24rem;
            height: 0.36rem;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
        }
        .progress {
          display: inline-block;
          float: right;
          width: 25%;
          color: #9d9fa1;
          text-align: right;
          p:nth-of-type(1) {
            font-family: DIN-Regular;
            font-size: 0.4rem;
            margin-bottom: 0.06rem;
            i {
              color: #171717;
            }
          }
          p:nth-of-type(2) {
            font-size: 0.22rem;
          }
        }
      }
    }
  }
  .alert-box {
    padding: 0.44rem 0.4rem 0.4rem;
    border-radius: 0.08rem;
    h4 {
      font-size: 0.36rem;
      font-weight: bold;
      text-align: center;
      color: #171717;
    }
    p {
      padding: 0.24rem 0 0.4rem;
      font-size: 0.28rem;
    }
    .operate {
      .btn {
        width: 2.46rem;
        height: 0.8rem;
        line-height: 0.8rem;
        text-align: center;
        background: #f5f6f8;
        border-radius: 0.4rem;
        font-size: 0.32rem;
        float: left;
        &:nth-of-type(2) {
          background: #007aff;
          color: #fff;
          float: right;
        }
      }
    }
  }
}
.noBkId {
  padding: 1.77rem 0.4rem 0 0.4rem;
  box-sizing: border-box;
  .txt {
    margin-top: 4rem;
    font-size: 0.28rem;
    color: #9d9fa1;
    letter-spacing: 0;
    text-align: center;
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


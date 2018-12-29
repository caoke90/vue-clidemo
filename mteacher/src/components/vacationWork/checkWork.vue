<template>
    <div class="check-work">
      <template v-if='reportList.length>0'>
        <div class="exercise-list">
            <ul>
                <li v-for='reportItem in reportList'  v-if='reportItem' @click='goReportDetail(reportItem)'>
                    <div class="info">
                        <div class="title">{{reportItem.class_name}}</div>
                        <div class="content">时间：{{reportItem.start_time | formatTime}} - {{reportItem.end_time | formatTime}}</div>
                    </div>
                    <div class="progress">
                        <p><i>{{reportItem.process_type=='going'?reportItem.count_going_students:reportItem.count_finished_students}}</i> / {{reportItem.count_all_students}}</p>
                        <p>{{reportItem.process_type=='going'?'开始进度':'完成进度'}}</p>
                    </div>
                </li>
            </ul>
        </div>
      </template>
      <template v-if='!reportList.length'>
        <div class="no-report-page">
            <div class="img"></div>
            <p>还未发布假期练习</p>
        </div>
      </template>

    </div>

</template>

<script>
import { sendLog } from "@/common/js/logger";
import ajax from "../../api/ajax";
import {showToast,getInitParams} from "../../common/js/external/index";
import { forwardPage } from "../../common/js/external/teacher";
import { localStorageGet, localStorageRemove } from '../../common/js/external/localStorage';
export default {
  filters:{
    formatTime(timestamp){
      let date = new Date(+timestamp);
      if ('Invalid Date' === date.toString()) {
          return false
      }
      let Y = date.getFullYear();
      let M = date.getMonth() + 1 >9?date.getMonth() + 1:`0${date.getMonth() + 1}`;
      let D = date.getDate()>9?date.getDate():`0${date.getDate()}`;
      return Y+'.'+M+'.'+D
    }
  },
  data() {
    return {
      reportList: [] //展示报告列表
    };
  },
  methods: {
    //获取数据
    async getReportList() {
      let resp = await ajax.get(process.env.zxBaseUrl+"Mteacher/vacation/classStatus");
      if (resp.data.success == true) {
        Bus.$emit("event_status", "loaded");
        let reportList=resp.data.data;
        this.reportList=reportList;

      }else{
        Bus.$emit("event_status", "error");
      }
    },
    goReportDetail(item){
      //打点
      sendLog("", "", {
        event: "onlineEn_VacationHomework_CheckClassDetail",
        logData: { homeworkType: "寒假作业"}
      });

      let data={
        title:item.class_name,
        url:`${window.location.origin}/mteacher/studentGroup.html?plan_id=${item.plan_id}`
      }
      forwardPage(data);
    }
  },
  created() {
    Bus.$on("refreshData", () => {
      let data = localStorageGet('studentGroup', 'del');
      if (data.value && data.value.success == true) {
        Bus.$emit('getReleaseInfo');
        showToast('已删除');
        localStorageRemove('studentGroup', 'del');
        this.getReportList();
      }
    });
    Bus.$on('refreshReport',()=>{
      this.getReportList();
    })   
    this.getReportList();
  }
};
</script>

<style scoped lang='less'>
.check-work {
  background-color: #f5f6f7;
  color: #58595e;
  line-height: 1.5;
  overflow-scrolling: touch;
  -webkit-overflow-scrolling: touch;
  .exercise-list {
    width: 100%;
    padding-bottom: 0.24rem;
    // background-color: #fff;
    ul {
      padding: 0 0.32rem;
      li {
        margin-top: 0.24rem;
        background-color: #fff;
        padding: 0.36rem 0.64rem 0.36rem 0.32rem;
        // display: flex;
        overflow: hidden;
        position: relative;
        border-radius: 0.12rem;
        &:nth-last-child(1) {
          border: none;
        }
        &::after{
          content: '';
          display: block;
          position: absolute;
          width: 0.24rem;
          height: 0.24rem;
          background: url('../../assets/img/vacation/guide1.png') no-repeat center;
          background-size: contain;
          right: 0.16rem;
          top: 0.68rem;
        }
        .info {
          width: 74%;
          float: left;
          .title {
            font-size: 0.3rem;
            color: #171717;
            font-weight: bold;
            margin-bottom: 0.06rem;
          }
          .content {
            font-size: 0.24rem;
            height: 0.36rem;
            color:#58595E;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
        }
        .progress {
          width: 24%;
          float: right;
          color: #9d9fa1;
          text-align: right;
          p:nth-of-type(1) {
            font-size: 0.4rem;
            line-height: 1.2;
            margin-bottom: 0.06rem;
            font-family: '17-DIN-Regular';
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
  .no-report-page{
      .img{
          width: 4rem;
          height: 4rem;
          margin: 2.24rem auto 0;
          background: url('../../assets/img/vacation/unrelease.png') no-repeat center;
          background-size: contain;
      }
      p{
          text-align:center;
          color: #9D9FA1;
          font-size: 0.28rem;
          margin-top: 0.32rem;

      }
  }
}
</style>


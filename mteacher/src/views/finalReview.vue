<template>
  <div class="container" id="container">
    <template v-if="status==='loaded'">
      <template>
            <div  class="swiper-pagination tabPos" >
                <ul class="tabList">
                    <li class="releasePractice"  @click="checkoutTab(0)" :class="{'active':curTab==0}" >发布</li>
                    <li class="checkPractice"  @click="checkoutTab(1)"  :class="{'active':curTab==1}" >检查</li>
                </ul>
            </div>
            <div v-if="iosq==0">
              <swiper :options="swiperOption" ref = "mySwiper">
                  <swiper-slide><div @touchmove="bodyTouchMove" class="swiperCon" :style="{height:clientH+'px'}">
                      <releasePractice ref="releasePractice"></releasePractice>
                      </div></swiper-slide>
                  <swiper-slide><div @touchmove="bodyTouchMove" class="swiperCon" :style="{height:clientH+'px'}">
                      <checkPractice ref="checkPractice"></checkPractice>
                      </div></swiper-slide>
              </swiper>
            </div>
            <div v-if="iosq==1">
                  <div v-show="curTab==0" class="swiperCon" :style="{height:clientH+'px'}">
                      <releasePractice ref="releasePractice"></releasePractice>
                  </div>
                  <div v-show="curTab==1" class="swiperCon" :style="{height:clientH+'px'}">
                      <checkPractice ref="checkPractice"></checkPractice>
                  </div>
            </div>
      </template>
    </template>
    <template v-else-if="status==='error'">
      <msg style="height: 5rem;" :card="{type:'error'}"></msg>
    </template>
    <popup
            v-model="popupVisible"
            popup-transition="popup-fade"
            :closeOnClickModal='false'
            style='width:80%'
            class="alert-box">
            <h4>确定删除吗？</h4>
                <p>删除后，学生端练习和已完成记录都将被清空</p>
                <div class="operate">
                    <div class="btn" @click='popupVisible=false'>取消</div>
                    <div class="btn" @click='deleteReport'>确定</div>
                </div>
        </popup>
  </div>
</template>

<script>
import Question from "../models/question/Question";
import Bus from "../marvel/bus";
import ajax from "../api/ajax";
import popup from "../components/mint/popup/popup.vue";
import changeClass from "../components/finalReview/changeClass.vue";
Bus.addModalComponent(changeClass);

//网络异常
import msg from "../components/cards/msg.vue";
import log from "../common/js/utils/logConfig";
import { sendLog } from "../common/js/logger";
//发布练习组件
import checkPractice from "../components/finalReview/checkPractice.vue";
//查看练习组件
import releasePractice from "../components/finalReview/releasePractice.vue";

//购物车
import Cart from "../api/cart";
import {
  getInitParams,
  updateTitle,
  externalConfig,
  closeLoading,
  showLoadingView,
  showToast
} from "../common/js/external/index";
import { forwardPage } from "../common/js/external/teacher";

import { pageQueueBack } from "../common/js/external/pageQueue";
import { platform } from "../common/js/utils/index";
import "swiper/dist/css/swiper.css"; ////这里注意具体看使用的版本是否需要引入样式，以及具体位置。
import { swiper, swiperSlide } from "vue-awesome-swiper";

export default {
  data() {
    return {
      status: "loaded",
      swiperOption: {
        autoplay: 0,
        speed: 500,
        observer: true,
        observeParents: true,
        freeModeMomentumBounceRatio: 0,
        resistanceRatio: 0,
        watchOverflow: true
      },
      curTab: 0,
      iosq: 0, //是否大于ios9，默认为大于ios9
      popupVisible:false,
      curHomeWork:null
    };
  },
  computed: {
    clientH() {
      return (
        document.body.clientHeight || document.documentElement.clientHeight
      );
    },
    changeSendLog() {
      //判断tab是发布还是检查
      return this.curTab;
    },
    iosv() {
      let ver = navigator.appVersion.match(/OS (\d+)_(\d+)_?(\d+)?/);
      ver = parseInt(ver[1], 10);
      return ver;
    }
  },
  components: {
    swiper,
    swiperSlide,
    msg,
    checkPractice,
    releasePractice,
    popup
  },
  methods: {
    //删除报告
    async deleteReport() {
      this.popupVisible = false;
      showLoadingView("提交中");
      let data={
        homework_id:this.curHomeWork._id
      }
      console.log(data)
      let resp = await ajax.post(
        process.env.apiBaseUrl + "zx/teacher/homework/delete",data
      );
      closeLoading();
      if (resp.data.success) {
        showToast("删除成功");
        this.$refs.checkPractice.getindexData() 
        console.log(this.$refs.checkPractice)
      } else {
        showToast(resp.data.message);
      }
    },
    watchExternalConf() {
      externalConfig({
        source: "term_review",
        confirmOnQuit: "true",
        confirmOnQuitMsg: "确定离开期末复习计划吗？",
        confirmLeftTxt: "取消",
        confirmRightTxt: "确定"
      });
    },
    checkoutTab: function(value) {
      if (this.iosq == 0) {
        let swiper = this.$refs.mySwiper.swiper;
        swiper.slideTo(value, 0, false);
      }

      this.curTab = value;
      if (value == 1) {
        window.location.hash = 1;
      } else {
        window.location.hash = 0;
      }
      console.log(window.location.hash);
    },
    checkoutPage: function() {
      if (this.iosq == 0) {
        let swiper = this.$refs.mySwiper.swiper;
        swiper.slideTo(1, 0, false);
      }
      this.curTab = 1;
    },
    bodyTouchMove: function() {
      setTimeout(() => {
        let tabIndex = this.$refs.mySwiper.swiper.activeIndex;
        this.curTab = tabIndex;
        if (tabIndex == 1) {
          window.location.hash = 1;
        } else {
          window.location.hash = 0;
        }
      }, 500);
    },
    sendLogFn: function(value) {
      sendLog("", "", {
        event: "onlineEn_FinalExamReview_clickModule",
        logData: {
          platformType: "H5",
          screenType: value
        }
      });
    },
    // 初始化
    init: async function() {
      await ajax.all([Cart.getCardInfo("review", "term_review")]); //拉购题车数据
    }
  },
  watch: {
    changeSendLog: function(value) {
      console.log(value);
      if (value == 1) {
        this.sendLogFn("检查");
      } else {
        this.sendLogFn("发布");
      }
    }
  },
  mounted: async function() {
    updateTitle("期末复习", "", "");
    this.watchExternalConf();
    let params = getInitParams();
    await this.init();
    if (platform() === "ios") {
      if (this.iosv < 9) {
        this.iosq = 1;
      }
    }
    Bus.$on("event_status", value => {
      if(this.status=='error'){
        return false;
      }
      this.status = value;
    });
    Bus.$on('popupVisible',value=>{
      this.popupVisible = true;
      this.curHomeWork = value;
      console.log(this.curHomeWork)
    })

    if (window.location.hash == "#1") {
      //判断进入哪个tab
      //判断当page为1时，默认进入检查作业页面
      this.checkoutPage();
    } else {
      this.sendLogFn("发布");
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style rel="stylesheet/scss" type="text/css" lang="scss" scoped>
.container {
  max-width: 750px;
  margin: 0 auto;
  font-size: 0.28rem;
}
.box {
  margin-bottom: 0.2rem;
}
.card23 {
  background: #ffffff;
  padding: 0.3rem 0.4rem;
  position: relative;
  font-size: 0.28rem;
  max-width: 750px;
  .btn {
    position: absolute;
    top: 0.22rem;
    right: 0.32rem;
    background: rgba(0, 122, 255, 0.05);
    border: 0.02rem solid #007aff;
    border-radius: 2rem;
    padding: 0 0.26rem;
    font-size: 0.28rem;
    color: #007aff;
    text-align: center;
    line-height: 0.52rem;
    cursor: pointer;
  }
  .btn.remove {
    background: #007aff;
    border-radius: 2rem;
    color: #fff;
  }
}
.buzy {
  text-align: center;
  height: 0.5rem;
  line-height: 0.5rem;
}
.swiperCon {
  width: 100%;
  height: 100%;
  padding: 1rem 0 0;
  box-sizing: border-box;
  -moz-box-sizing: border-box; /* Firefox */
  -webkit-box-sizing: border-box; /* Safari */
  overflow-y: auto;
}
.tabPos {
  z-index: 9 !important;
  max-width: 750px;
  position: fixed;
  top: 0px;
  background: rgb(255, 255, 255);
  width: 100% !important;
  height: 1rem;
  .tabList {
    height: 100%;
    width: 100%;
    position: relative;
    &:before {
      content: "";
      height: 0.02rem;
      background: #e6e6e6;
      width: 7.5rem;
      position: absolute;
      left: 0;
      bottom: 0;
      -webkit-transform: scaleY(0.5);
      transform: scaleY(0.5);
    }
    .releasePractice,
    .checkPractice {
      position: relative;
      height: 100%;
      width: 50%;
      float: left;
      line-height: 1rem;
      font-family: PingFangSC-Regular;
      font-size: 0.32rem;
      color: #171717;
      letter-spacing: 0;
      text-align: center;
      &.active {
        font-family: PingFangSC-Medium;
        font-weight: 700;
      }
      &.active::after {
        content: "";
        position: absolute;
        bottom: 0.15rem;
        left: 50%;
        height: 0.04rem;
        width: 0.32rem;
        background: #007aff;
        margin-left: -0.16rem;
        border-radius: 1px;
      }
    }
    .checkPractice {
      &::before {
        content: "";
        position: absolute;
        top: 50%;
        left: 0;
        height: 0.4rem;
        width: 1px;
        background: #e6e6e6;
        margin-top: -0.2rem;
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
</style>

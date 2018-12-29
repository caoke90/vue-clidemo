<template>
  <div class="vacation-work">
    <template v-if="status==='loaded'">
      <template>
            <div  class="swiper-pagination tabPos" >
                <ul class="tabList">
                    <li class="releasePractice"  @click="checkoutTab(0)" :class="{'active':curTab==0}" >发布</li>
                    <li class="checkPractice"  @click="checkoutTab(1)"  :class="{'active':curTab==1}" >检查</li>
                </ul>
                <div class="modal" v-if='popupStatus'></div>
            </div>
            <div v-if='iosq==0'>
              <swiper :options="swiperOption" ref = "mySwiper">
                <swiper-slide><div @touchmove="bodyTouchMove" class="swiperCon" :style="{height:clientH+'px'}">
                        <release-work @checkoutTab='toTab'></release-work>
                    </div></swiper-slide>
                <swiper-slide><div @touchmove="bodyTouchMove" class="swiperCon" :style="{height:clientH+'px'}">
                        <check-work></check-work>
                    </div></swiper-slide>
              </swiper>
            </div>
            <div v-if='iosq==1'>
               <div v-show="curTab==0" class="swiperCon" :style="{height:clientH+'px'}">
                 <release-work @checkoutTab='toTab'></release-work>
               </div>
               <div v-show="curTab==1" class="swiperCon" :style="{height:clientH+'px'}">
                 <check-work></check-work>
               </div>
            </div>

      </template>
    </template>
    <template v-else-if="status==='error'">
      <msg style="height: 5rem;" :card="{type:'error'}"></msg>
    </template>
  </div>
</template>

<script>
import { sendLog } from "@/common/js/logger";
import Bus from "../marvel/bus";
import ajax from "../api/ajax";
import msg from "../components/cards/msg.vue";//网络异常
import scroller from "../marvel/scroller";
import {platform} from '../common/js/utils/index';
import {updateTitle,externalConfig,getInitParams,showToast,closeLoading} from "../common/js/external/index";
import { forwardPage } from "../common/js/external/teacher";
import "swiper/dist/css/swiper.css"; ////这里注意具体看使用的版本是否需要引入样式，以及具体位置。
import { swiper, swiperSlide } from "vue-awesome-swiper";

import releaseWork from '../components/vacationWork/releaseWork'
import checkWork from '../components/vacationWork/checkWork'

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
        resistanceRatio: 0
      },
      curTab: 0,
      popupStatus:false,
      iosq: 0 //是否大于ios9，默认为大于ios9
    };
  },
  computed: {
    clientH() {
      return (
        document.body.clientHeight || document.documentElement.clientHeight
      );
    },
    iosv() {
      let ver = navigator.appVersion.match(/OS (\d+)_(\d+)_?(\d+)?/);
      ver = parseInt(ver[1], 10);
      return ver;
    },
    changeSendLog() {
      //判断tab是发布还是检查
      return this.curTab;
    },
  },
  components: {
    swiper,
    swiperSlide,
    msg,
    releaseWork,
    checkWork
  },
  watch:{
    changeSendLog:{
      handler:function(val) {
        if(val==1){
            this.logClick('检查');
        }else{
            this.logClick('发布');
        }
      },
      immediate: true
    }
  },
  methods: {
    checkoutTab: function(value) {
      if (this.iosq == 0) {
        let swiper = this.$refs.mySwiper.swiper;
        swiper.slideTo(value, 0, false);
      }
      this.curTab = value;
    },
    toTab(value){
      this.checkoutTab(value);
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
      }, 500);
    },
    logClick(val){
      sendLog("", "", {
        event: "onlineEn_VacationHomework_ClickModule",
        logData: { homeworkType: "寒假作业" , moduleName: val}
      });
    }
  },
  created() {
    let params = getInitParams();
    updateTitle("假期练习", "", "");
    if(platform() ==='ios'){
        if (this.iosv < 9) {
            this.iosq = 1;
        }
    }
    if (window.location.hash == "#1") {
      console.log('go check');
      //判断进入哪个tab
      //判断当page为1时，默认进入检查作业页面
      this.checkoutTab(1);
    }
    externalConfig({
        source: "winter_vacation"
      });
    Bus.$on("event_status", value => {
      if(this.status=='error'){
        return false;
      }
      this.status = value;

    });
    Bus.$on("popupStatus", value => {
      if(value){
        this.popupStatus = value;
        let swiper = this.$refs.mySwiper.swiper;
        swiper.detachEvents();
      }else{
        window.setTimeout(() => {
          this.popupStatus = value;
          let swiper = this.$refs.mySwiper.swiper;
          swiper.attachEvents()
        }, 200);
      }
    });
    Bus.$on('logClick',val => {
      this.logClick(val);
    });
    Bus.$on("refreshData", () => {
      if(this.curTab==1){
            this.logClick('检查');
        }else{
            this.logClick('发布');
        }
    });

  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style rel="stylesheet/scss" type="text/css" lang="scss" scoped>
.vacation-work {
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
  overflow-y: auto;
}
.tabPos {
  // z-index: 9 !important;
  max-width: 750px;
  position: fixed;
  top: 0px;
  background: rgb(255, 255, 255);
  width: 100% !important;
  height: 1rem;
  .tabList {
    height: 100%;
    width: 100%;
    border-bottom: 1px solid #e6e6e6;
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
        font-weight: 600;
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
        background: #E6E6E6;
        margin-top: -0.2rem;
      }
    }
  }
  .modal{
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      opacity: 0.7;
      background: #000;
  }
}
</style>

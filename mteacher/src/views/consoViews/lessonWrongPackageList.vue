<template>
    <div>
        <div class="container" v-if="status==='loaded'">
            <div class="packageType" v-if="isLoaded" >
                <div class="clazz-list" v-for="(item,k) in packageType" :key="k" @click="openPackage(item)">
                    <div class="clazz">
                        <h3 class="title"><span class="text">{{item.name}}</span><span v-if="item.is_used==1" class="isused">已使用</span></h3>
                        <!--<p>错误率-->
                            <!--<template v-if="item.minErrorRate===item.maxErrorRate">-->
                                <!--<span>{{item.minErrorRate}}%</span>-->
                            <!--</template>-->
                            <!--<template v-else>-->
                                <!--<span style="font-family: DIN-Regular;">{{item.minErrorRate}}%-{{item.maxErrorRate}}%</span>-->
                            <!--</template>-->
                        <!--</p>-->
                    </div>
                    <div class="arrow">
                    </div>
                </div>
            </div>
        </div>
        <template v-else-if="status==='error'">
            <msg style="height: 5rem;" :card="{type:'error'}"></msg>
        </template>
    </div>
</template>

<script>
import {
  getInitParams,
  updateTitle,
  externalConfig
} from "../../common/js/external/index";
import ajax from "../../api/ajax";
import Cart from "../../api/cart";
import { forwardPage } from "../../common/js/external/teacher";
import msg from "../../components/cards/msg.vue";
import qs from "qs";
export default {
  name: "lessonWrongPackageList", //高频错题
  data() {
    return {
      isLoaded: false,
      status: "loading",
      packageType: []
    };
  },
  components: {
    msg
  },
  methods: {
    watchExternalConf() {
      externalConfig({
        confirmOnQuit: "false"
      });
    },
    openPackage: function(item) {
      let actionparams = Object.assign({}, item.action.params,{
          id:item.id,
          pageName:item.name
      });
      let data = {
        url: window.location.origin + "/mteacher/packageContent.html",
        params: actionparams,
        type: "packageContent",
        needCart: true
      };
      forwardPage(data);
    }
  },
  created: async function() {
    let params = getInitParams();
    this.watchExternalConf()
    let vm = this;
    vm.paperparams = {
      bk_id: params.bk_id
    };
    updateTitle("高频错题", "", "");
    const [resp] = await ajax.all([
      ajax.get(
        "/v1/finalReview/lessonWrongPackageList?bk_id=" +
          params.bk_id
      ),
      Cart.getCardInfo("review", "term_review")
    ]);
    if (resp.data.message === "ok") {
        vm.packageType=resp.data.data.list.packages
      vm.status = "loaded";
    } else {
      vm.status = "error";
    }
    vm.isLoaded = vm.packageType.length > 0;
  }
};
</script>

<style scoped lang="scss" type="text/css" rel="stylesheet/scss">
.container {
  max-width: 750px;
  margin: 0 auto;
  font-size: 0.28rem;
  .packageType {
    background: #ffffff;
  }
  .clazz-list {
    background: #ffffff;
    position: relative;
    overflow: hidden;
    margin-left: 0.4rem;
    &:after {
      content: "";
      height: 0.02rem;
      background: #e5e5e5;
      width: 7.5rem;
      position: absolute;
      left: 0;
      bottom: 0;
      transform: scaleY(0.5);
    }
    .clazz {
      .title {
        font-size: 0.3rem;
        color: #171717;
        line-height:1.4rem;
        .text {
          max-width: 75%;
          display: inline-block;
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;
          vertical-align: middle;
        }
        .isused {
          display: inline-block;
          padding: 0 0.09rem;
          margin-left: 0.2rem;
          border: 1px solid #007aff;
          border-radius: 0.04rem;
          color: #007aff;
          font-size: 0.22rem;
          line-height: 0.32rem;
        }
      }
      p {
        font-size: 0.24rem;
        color: #58595e;
        line-height: 0.36rem;
        span {
          margin: 0 0.08rem;
        }
      }
    }
    .arrow {
      width: 0.24rem;
      height: 0.24rem;
      position: absolute;
      right: 0.24rem;
      top: 50%;
      margin-top: -0.12rem;
      display: inline-block;
      background: url("../../assets/img/upArrow.png") no-repeat;
      background-size: contain;
      transform: rotate(90deg);
      -webkit-transform:rotate(90deg);
      cursor: pointer;
    }
  }
}
</style>
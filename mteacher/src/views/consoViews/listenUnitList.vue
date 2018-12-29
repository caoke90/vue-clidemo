<template>
    <div>
        <div class="container" v-if="status=='loaded'">
            <div class="packageType" v-if="isLoaded" v-for="(v,k) in packageType" :key="k" @click="openPackage(v)">
                <div class="clazz-list">
                    <div class="clazz">
                        <h3 class="title"><span class="text">{{v.packages.unit_name}}</span><span v-if="v.packages.is_used==1" class="isused">已使用</span></h3>
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
import { getInitParams, updateTitle ,externalConfig} from "../../common/js/external/index";
import { forwardPage } from "../../common/js/external/teacher";
import msg from "../../components/cards/msg.vue";
import Cart from "../../api/cart";
import qs from "qs";
import ajax from "../../api/ajax";
export default {
  name: "listenUnitList", //听力
  data() {
    return {
      isloaded: false,
      status: "loading",
      paramsData: null,
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
      this.paperparams.unit_id = item.packages.unit_id;
        this.paperparams.pageName=item.packages.unit_name;
      let data = {
        url: window.location.origin + "/mteacher/packageContent.html",
        params: this.paperparams,
        type: "packageContent",
        needCart: true
      };
      forwardPage(data);
    }
  },
  created: async function() {
    let params = getInitParams();
    this.watchExternalConf();
    let vm = this;
    updateTitle("听力", "", "");
    const [resp] = await ajax.all([
      ajax.get(
        "/v1/finalReview/listenUnitList?bk_id=" +
          params.bk_id
      ),
      Cart.getCardInfo("review", "term_review")
    ]);
    if (resp.data.message === "ok") {
      vm.packageType = resp.data.data.list;
      vm.paramsData = resp.data.data;
      vm.paperparams = {
        //提包页需要参数
        bk_id: params.bk_id,
        package_type: "REVIEW_LISTENING",
        package_name: "听力",
        class_level: vm.paramsData.class_level
      };
      this.status = "loaded";
    } else {
      this.status = "error";
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
    margin-left: 0.4rem;
    overflow: hidden;
    height: 1.4rem;
    line-height: 1.4rem;
    padding-right: 0.4rem;
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
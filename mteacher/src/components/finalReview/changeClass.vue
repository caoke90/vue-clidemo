<template>
    <div>
        <div class="changeClassCover animated"  v-show="select"  :class="{'slideInUp' : select == true}"  @click="cancel">
            <ul>
                <li :class="{'active':curGradeId==grade.clazz_id}" @click="changeGrade(grade)" v-for="(grade,index) in clazz_list">{{grade.clazz_name}}</li>
            </ul>
        </div>
        <div class="mark" v-show="select" @touchmove.stop.prevent @click="cancel"></div>
    </div>
</template>

<script>
export default {
  data() {
    return {
      select: false,
      curGrade:'全部班级',
      curGradeId:'All',
      clazz_list:[]
    };
  },
  methods: {
    cancel: function() {
      this.select = "";
    },
    changeGrade:function(value){
        this.curGrade = value.clazz_name
        this.curGradeId = value.clazz_id
    }
  },
  created() {
    Bus.changeClass = this;
  }
};
</script>

<style  rel="stylesheet/scss" type="text/css" lang="scss" scoped>
@import "@/common/scss/animate.scss";
.mark {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 10;
  background-color: rgba(0, 0, 0, 0.7);
}
.changeClassCover {
  width: 100%;
  max-height: 5.04rem;
  background: #ffffff;
  padding-left:0.4rem;
  box-sizing: border-box;
  position: fixed;
  bottom: 0;
  z-index: 11;
  overflow-y: auto;
  ul {
    li {
      position: relative;
      height: 1rem;
      line-height: 1rem;
      border-top: 1px solid #eeeeee;
      font-size: 0.28rem;
      color: #58595e;
      letter-spacing: 0;
      &.active {
        color: #007aff;
        background: url("../../assets/img/classOn.png") no-repeat 6.31rem center;
        background-size: 0.48rem 0.48rem;
      }
    }
  }
}
</style>

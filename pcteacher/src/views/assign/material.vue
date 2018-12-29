<template>
  <div class="material">
    <div class="material-container">
      <div class="material-list clearfix">
        <label>教材：</label>
        <div class="material-change-area" @click.stop="showSelect('book')">
          <p class="title">{{bookname}}</p><span :class="{active: curModel==='book'}"></span>
          <smaterial @selectBook="selectBook"  ref="book"></smaterial>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Bus from '@/marvel/bus.js'
  import smaterial from './selectmaterial.vue'
  // 网络请求
  import ajax from '@/api/ajax'

  export default {
    components: {
      smaterial
    },
    data () {
      return {
        BookTree: '',
        curSelect:null,
        bookname:'',
        isUser: false,
        currentBook: {
          version: '',
          material: '',
        },
        isSelect: false,
        curModel:null,
        params: {
          bk_id: '',
          bkc_id: '',
        }
      }
    },
    methods: {
      // 显示选择
      showSelect: function (model){
        if(this.curModel==model){
          this.curSelect.hide()
          this.curSelect=null
          this.curModel=null
          return
        }
        if(this.curSelect){
          this.curSelect.hide()
        }
        if(model=='book'){
          this.curSelect=this.$refs.book
        }
        this.curModel= model
        this.curSelect.show()
      },
      loadUITree: async function(params) {
        const content = await ajax.post('/pc/v1/assign/loadUlTree',params)
        let selectBookName = content.data.data.name
        let selectBookId  = content.data.data._id
        let selectParentId  = content.data.data.parent_id
        let selectClazzLevel = content.data.data.clazz_level

        Bus.$emit('refreshPlan',selectBookId);
        // 设置当前参数
        if(selectBookId && !this.isUser){
          this.params.bk_id = selectBookId
        }
        !this.isUser && (this.params.class_level = selectClazzLevel)

        !this.isUser && await this.$refs.book.init({
          bk_id: selectBookId,
          parent_id: selectParentId,
          class_level: selectClazzLevel,
          name: selectBookName
        })

      },
      selectBook:async function (item){
        this.isUser = true
        this.curSelect=null
        this.curModel=null
        this.bookname=this.$refs.book.currentMaterial.name
        this.params.bk_id =  this.$refs.book.currentMaterial._id
        this.params.class_level =  item.clazz_level
        // 刷新
        Bus.$emit('refreshPlan',this.params.bk_id);
      },     
      init:async function(){
        await this.loadUITree(this.$refs.book.params)
        this.bookname=this.$refs.book.currentMaterial.name
      }
    },
    created:async function() {
      
      let vm = this
      document.addEventListener('click', () => {
        if(this.curSelect){
          this.curSelect.hide()
          this.curSelect = null
          this.curModel = null
          this.isUser = false
          vm.init()
        }
      }, false)
    },
    mounted() {
      this.init();
    },
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style rel="stylesheet/scss" type="text/css" lang="scss" scoped>
  .marginr-46{
    margin-right: 46px;
  }
  .margint-12{
    margin-top: 12px;
  }
  .clearfix::after{
    display: block;
    content:'';
    clear: both;
    height:0;
  }
  .material{
    position: relative;
    margin-bottom: 10px;
    &-container{
      padding: 20px;
      margin-bottom:0;
      border:1px solid #DBE6EE;
      border-top: 0;
      position:relative;
      top: 0px;
      clear: both;
      background-color: #fff;
    }
    &-list{
      clear: both;
      line-height: 16px;
      label{
        float: left;
        font-size: 12px;
        color: #555555;
        font-family: MicrosoftYaHei;
      }
      p{
        line-height: 16px;
        font-size: 12px;
        font-family: MicrosoftYaHei;
        color: #555555;
        max-width: 400px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      p:hover{
        color: #159CFC;
      }
      span{
        width: 10px;
        height: 10px;
        background: url(../../assets/img/tri_normal.png);
        position: absolute;
        top: 50%;
        right: -16px;
        margin-top: -6px;
      }
      span.active{
        background: url(../../assets/img/up_selected.png);
        background-repeat: no-repeat;
        background-position: 0px 2px;
      }

    }
    &-change-area{
      float: left;
      position: relative;
      cursor: pointer;
    }
  }

</style>

<template>
    <div>
        <div class="container" :style="{ paddingTop: isWordPage?'1rem':'0'}">
            <div :style="{height: package_type=='HIGH_FREQUENCY'? '1.17rem' :'2.17rem'}">
                <div class="filterBar-wrap" v-show="card_groupCache.length!==0 && package_type!=='HIGH_FREQUENCY'">
                    <div class="filterBar">
                        <div class="switch">
                            过滤已使用
                            <label><input class="mui-switch" @click="filter_swith" type="checkbox"></label>
                        </div>
                    </div>
                </div>
                <div  v-if="questionsCount">
                    <div class="card23 line card23Box"  :style="{top:package_type=='HIGH_FREQUENCY'? '0' :'1rem'}">
                        共 {{ questionsCount }} 大题，预计 {{ finishedTime }} 分钟
                        <div class="btn remove" v-if="isselect" @click="toggle">全部移除</div>
                        <div class="btn" v-else @click="toggle">全部选入</div>
                    </div>
                    <div style="height: 0.2rem;background: #f5f6f7;"></div>
                </div>
            </div>
            <template v-if="success === 'ok'">
                <scroller :data="card_group" @loadmore="next">
                    <div class="box" slot-scope="props">
                        <question  :question='props.item' :qindex="props.index" ></question>
                    </div>
                </scroller>
                <template v-if="card_group.length===0">
                    <msg style="height: 5rem;" :card="{type:'empty', msg:msg}"></msg>
                </template>
                <div v-if="card_group.length&&!end" class="weui-loadmore">
                    <i class="weui-loading"></i>
                    <span class="weui-loadmore__tips">正在加载更多…</span>
                </div>
                <div v-if="end" class="weui-loadmore weui-loadmore_line">
                    <span class="weui-loadmore__tips">没有更多了</span>
                </div>
            </template>
            <template v-else>
                <msg style="height: 5rem;" :card="{type:'error'}"></msg>
            </template>
        </div>
    </div>
</template>

<script>
    // 导航下拉框
    import Bus from "../../marvel/bus";

    // 网络异常提示信息组件
    import msg from "../../components/cards/msg.vue";
    import scroller from "../../marvel/scroller";

    // 购物车和网络请求已经题目
    import Cart from "../../api/cart";
    import ajax from "../../api/ajax";
    import Question from "../../models/question/Question";

    // 通过路径获取对象属性值
    import { hget } from "../../utils/hobj";

    import {
        getInitParams,
        updateTitle
    } from "../../common/js/external/index";

    export default {
        data() {
            return {
                card_groupCache: [],
                card_group: [], //题目数据
                success: "", // 展示逻辑
                question_list: [], // 增加数据分页功能  全部question
                question_listCache:[],
                isloaded: false, // 数据是否加载完毕
                package_type:'',
                msg:'本地化内容生产中，敬请期待～',
                isWordPage: false,
                isFilter: true,
                catalog_id: null, // 购题车category需要的参数
                group_id:null, //高频错题 购题车 category需要参数
                pageUrl: null,
                buzy: false,
                end: false,
                total_page: 1,
                page: 1
            };
        },
        components: {
            msg,
            scroller
        },
        computed: {
            // 题目数量
            questionsCount: function() {
                return this.question_list.length;
            },

            // 题目全部完成时间
            finishedTime: function() {
                let time = 0;
                let card_list = this.question_list;
                if (card_list.length > 0) {
                    card_list.forEach(function(card) {
                        time += card.seconds || 0;
                    });
                }
                return Math.ceil(time / 60);
            },

            // 全选
            isselect: function() {
                if (this.card_group.length > 0) {
                    return this.card_group.every(function(card) {
                        return card.selected;
                    });
                }
            }
        },

        methods: {
            filter_swith: function () {
                this.isFilter = !this.isFilter;
                this.loadFolter()
            },
            loadFolter:function(){
                if (this.isFilter) {
                    this.msg = '本地化内容生产中，敬请期待～';
                    this.card_group = this.card_groupCache;
                    this.question_list=this.question_listCache;
                } else {
                    this.msg = '全部题目已使用';
                    let arr = [];
                    let ques=[];
                    let vm =this;
                    this.card_groupCache.forEach(function (question) {
                        if (!question.isUsed) {
                            arr.push(question)
                        }
                    });
                    this.question_listCache.forEach(function (question,index) {
                        vm.card_groupCache.forEach(function (item,i) {
                            if(question.id==item.id){
                                question.isUsed= item.isUsed;
                            }
                        });
                        if (!question.isUsed) {
                            ques.push(question)
                        }
                    });

                    this.card_group = arr;
                    this.question_list=ques;
                }
            },
            toggle: function() {
                if (!this.card_group.length) {
                    return;
                }
                let isall = this.isselect;
                for (let i = 0; i < this.card_group.length; i++) {
                    if (!isall) {
                        this.card_group[i].selected = true;
                    } else {
                        this.card_group[i].selected = false;
                    }
                }
                if (isall) {
                    Bus.$emit("Cart", {
                        type: "remove_questions_all",
                        ques:this.question_list
                    });
                } else {
                    Bus.$emit("Cart", {
                        type: "add_questions_all",
                        ques:this.question_list
                    });
                }
            },
            loadmore: async function () {
                //初始化请求页面数据
                let resp = await ajax.post(this.pageUrl,this.resolveJsonParams(this.bagparams));
                if (resp.data.message == "ok" && this.buzy == true) {
                    const pageData = resp.data.data;
                    const allcard_group = [];
                    pageData.question_boxs.forEach(question => {
                        allcard_group.push(this.formatQuesData(question, pageData.category));
                    });
                    this.card_groupCache = this.card_groupCache.concat(allcard_group);
                    if (
                        resp.data.data.page_info.now_page ==
                        resp.data.data.page_info.total_page
                    ) {
                        this.end = true;
                    }
                    this.loadFolter();
                }
            },
            refreshData: async function(status) {
                //初始化请求页面数据
                const [content] = await ajax.all([
                    ajax.post(this.pageUrl, this.resolveJsonParams(this.bagparams)),
                    Cart.getCardInfo('review','term_review')
                ]);
                if (hget(content, "data.message") === "ok" || hget(content, "data.result") === "success") {
                    //修改展示状态
                    this.success = "ok";
                    if(JSON.stringify(content.data.data)==='{}' || !content.data.data){  //兼容高频错题空数据状态
                        this.card_group=[];
                        return;
                    }
                    this.total_page = content.data.data.page_info.total_page;
                    const pageData = content.data.data;
                    const allcard_group = [];

                    pageData.question_boxs.forEach(question => {
                        if (this.has(question, allcard_group) == -1) {
                            allcard_group.push(
                                this.formatQuesData(question, pageData.category)
                            );
                        }
                    });
                    this.card_groupCache = allcard_group;
                    const question_list_temp = [];
                    pageData.question_list.forEach(question => {
                        if (this.has(question, question_list_temp) == -1) {
                            question_list_temp.push(
                                this.formatQuesData(question, pageData.category)
                            );
                        }
                    });
                    this.question_listCache=question_list_temp;
                    this.loadFolter();
                    if(content.data.data.page_info.now_page==content.data.data.page_info.total_page){
                        this.end = true;
                    }
                } else {
                    this.success = "fail";
                }
                this.isloaded = true;
            },
            refreshCart: async function(refresh) {
                if (refresh) {
                    await Cart.refresh();
                }
                this.card_groupCache.forEach(item => {
                    item.selected = Cart.hasQuestion(item);
                });
            },
            has:function(question,card_group){
                let has = -1;
                for (let i =0;i<card_group.length;i++) {
                    if (question.id === card_group[i].id){
                        has= i;
                        break;
                    }
                }
                return has;
            },
            // 格式化参数
            resolveJsonParams: function(params) {
                const data = {};
                for (let k in params) {
                    if (typeof params[k] === "object") {
                        data[k] = JSON.stringify(params[k]);
                    } else {
                        data[k] = params[k];
                    }
                }
                return data;
            },
            // 题目 数据格式
            formatQuesData: function (question,category) {
                // 拼接category
                question.category =  Object.assign({},category,{
                    catalog_id: this.catalog_id || "",
                    group_id:this.group_id || ''
                });
                const ques = new Question(question);
                ques.selected = Cart.hasQuestion(ques);
                return ques;
            },
            //滚动加载数据
            next: async function() {
                if(!this.buzy&&!this.end) {
                    this.page += 1;
                    this.bagparams.page = this.page;
                    this.buzy = true;
                    await this.loadmore();
                    this.buzy = false;
                }
            }
        },
        created: async function () {
            const vm = this;
            // 获取准备参数
            let params = getInitParams();
            vm.catalog_id = params.catalog_id;
            updateTitle(params.pageName,'','');
            this.bagparams={
                bk_id: params.bk_id,
                unit_id: params.unit_id,
                package_name: params.package_name,
                class_level:params.class_level,
                package_type: params.package_type,
                page: 1,
                page_size: 10
            };
            if(params.package_type=='HIGH_FREQUENCY'){ //高频错题
                // let clazz_id=params.clazz_id.split(',');
                let json = {};
                for (let i = 0; i < params.group_id.length; i++) {
                    json[i] = params.group_id[i];
                }
                let groupID = JSON.stringify(json);
                this.bagparams={
                    group_id:groupID,
                    date:params.date,
                    page: 1,
                    page_size: 10
                };
                this.group_id=params.id;
                this.package_type='HIGH_FREQUENCY';
                this.pageUrl='/v1/finalReview/lessonWrongPackageContent'
            }else if(params.package_type=='REVIEW_VOCAB_GRAMMAR'){ //语法,词汇
                this.pageUrl='/v1/finalReview/grammarPackageContent'
            }else if(params.package_type=='REVIEW_LISTENING'){ //听力
                this.pageUrl='/v1/finalReview/listenPackageContent'
            }
            vm.pageType = params.package_type;
            await this.refreshData( vm.pageUrl);
            Bus.$on('refreshCart',  ()=> {
                vm.refreshCart(true);
            });
            Bus.$on('updateCart',  ()=> {
                vm.refreshCart(false);
            });
        }
    };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style rel="stylesheet/scss" type="text/css" lang="scss" scoped>
    .container {
        max-width: 750px;
        margin: 0 auto;
        font-size: 0.28rem;
        -webkit-overflow-scrolling: touch;
        min-height: 100vh;
    }
    .box {
        margin-bottom: 0.2rem;
    }
    .line {
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
    }
    .card23Box{
        position: fixed;
        z-index:1;
        width: 100%;
        max-width: 750px;
        margin: 0 auto;
    }
    .card23 {
        background: #ffffff;
        padding: 0.3rem 0.4rem;
        font-size: 0.28rem;
        -webkit-overflow-scrolling: touch;
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
    .filterBar-wrap {
        height: 1rem;
        width: 100%;
        max-width: 750px;
        margin: 0 auto;
        position: fixed;
        top: 0;
        z-index: 1;
    }
    .filterBar {
        height: 1rem;
        width: 100%;
        background-color: #fff;
        position: relative;
    &:after {
         content: '';
         height: 0.02rem;
         background: #E5E5E5;
         width: 7.5rem;
         position: absolute;
         left: 0;
         bottom: 0;
         transform: scaleY(.5);
     }
    }

    .switch {
        line-height: 1rem;
        padding-right: .42rem;
        color: #58595E;
        text-align: right;
        max-width: 750px;
        font-size: 0.28rem;
    .mui-switch {
        width: 0.76rem;
        height: 0.44rem;
        position: relative;
        left: 0.06rem;
        top: 0.1rem;
        border: 1px solid #dfdfdf;
        background-color: #fdfdfd;
        box-shadow: #dfdfdf 0 0 0 0 inset;
        border-radius: 0.4rem;
        background-clip: content-box;
        display: inline-block;
        -webkit-appearance: none;
        user-select: none;
        outline: none;
    &:before {
         content: '';
         width: 0.4rem;
         height: 0.4rem;
         position: absolute;
         top: 0;
         left: 0;
         border-radius: 0.4rem;
         background-color: #fff;
         box-shadow: 0 0.02rem 0.06rem rgba(0, 0, 0, 0.4);
     }
    &:checked {
         border-color: #007AFF;
         box-shadow: #007AFF 0 0 0 16px inset;
         background-color: #007AFF;
    &:before {
         left: 0.32rem;
     }
    }
    }
    }
</style>



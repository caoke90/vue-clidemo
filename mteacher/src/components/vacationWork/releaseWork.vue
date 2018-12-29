<template>
    <div class="release-vc-work">
        <template v-if='!allAssigned && reviewContent && !overdue'>
            <div class="textbook">{{curTextbook.name}} <span class="changeTextbook" @click="changeTextbook">切换教材 </span></div>
            <ul class="week-list">
                <li v-for='(item,index) in weekList' :key='item.week'>
                    <div class="title">
                        第 {{item.week}} 周<i :class='{"preview":item.contentType!="review"}'>{{item.contentType=='review'?'复习':'预习'}}</i>
                    </div>
                    <p class="guide"  v-show='!item.isFolded'>每周{{item.dayCount}}天，每天内容如下:</p>
                    <div class="unfolded" v-show='!item.isFolded'> 
                        <div class="practice-item" v-for="(practice,key) in reviewContent" :key='key' v-if='item.contentType=="review"'>
                            <div class="subtitle">{{key}}</div>
                            <div class="content">
                                <div class="item" v-for="exercise in practice" :key='exercise.packageType'>
                                    {{exercise.packageType}}
                                    <i :class="{'choosed':exercise.default}">{{exercise.default?'已选':'未选'}}</i>
                                </div>
                            </div>
                        </div>
                        <div class="practice-item" v-for="(practice,key) in previewContent" :key='key' v-if='item.contentType=="preview"'>
                            <div class="subtitle">{{key}}</div>
                            <div class="content">
                                <div class="item" v-for="exercise in practice" :key='exercise.packageType'>
                                    {{exercise.packageType}}
                                    <i :class="{'choosed':exercise.default}">{{exercise.default?'已选':'未选'}}</i>
                                </div>
                            </div>
                        </div>

                        <div class="edit" @click='editPackage' v-if='item.contentType=="review"'><i></i>自选题包</div>
                    </div>
                    <div class="folded" v-show='item.isFolded'>
                        <p v-if="item.contentType=='review'">已选： <span v-for='item in choosedInfo.choosedReviewPackage' :key='item.id'>{{item.packageType}}</span></p>
                        <p v-else>已选： <span v-for='item in choosedInfo.choosedPreviewPackage' :key='item.id'>{{item.packageType}}</span></p>
                    </div>
                    <div class="fold-btn" @click='doFold(index)' :class="{'folded':item.isFolded}">
                        {{item.isFolded?'展开':'收起'}}
                    </div>
                </li>
            </ul>
            <div class="release-left">还有 {{leftClassCount}} 个班级待发布（{{deadline | formatTime}}后不能发布)</div>
            <releaseBar :dayCount='dayCount' :minCount='choosedInfo.minCount' btnText='一键发布' @submit='goPreview'></releaseBar>
        </template>
        <!-- 全部班级已发布 -->
        <template v-if='allAssigned && !overdue'>
            <div class="all-assigned-page blank-page">
                <div class="img"></div>
                <p>所有班级都已经发布，去检查练习吧</p>
            </div>
            
        </template>
        <!-- 超过截止时间 -->
        <template v-if='overdue'>
            <div class="deadline-page blank-page">
                <div class="img"></div>
                <p>很抱歉，发布练习已截止</p>
                <p>发布截止时间为{{deadline | formatTime}}</p>
            </div>
        </template>
        <!-- 该教材无内容 -->
        <template v-if='!allAssigned && !reviewContent && !overdue'>
            <div class="no-content-page blank-page">
                <div class="img"></div>
                <p>该教材没有内容，建议换本教材试试</p>
            </div>
        </template>
        <!-- 复习内容弹层 -->
        <popup
        v-model="reviewVisible"
        position="bottom" 
        style='width:100%'>
            <editContents 
            v-if='reviewVisible'
            contentTitle='统一编辑第1-4周复习内容'
            :contentInfo='reviewContent' 
            @closePopup='closePopup'
            @submit='confirmContent'>
            </editContents>
        </popup>
        <!-- 预习内容弹层 -->
        <!-- <popup
        v-model="previewVisible"
        position="bottom" style='width:100%'>
            <editContents
            contentTitle='统一编辑第5周预习内容'
            :contentInfo='previewContent' 
            @chooseContent='chooseContent' 
            @confirmContent='confirmContent("preview")'>
            </editContents>
        </popup> -->
    </div>   
</template>

<script>
    import { sendLog } from "@/common/js/logger";
    import ajax from '../../api/ajax'
    import { getInitParams } from "../../common/js/external/index";
    import {localStorageSet,localStorageRemove,localStorageGet} from '../../common/js/external/localStorage'
    import {forwardPage} from '../../common/js/external/teacher';
    import popup from '../../components/mint/popup/popup';
    import editContents from '../../components/vacationWork/editContents'
    import releaseBar from '../../components/vacationWork/releaseBar'
    export default{
        filters:{
            formatTime(timestamp){
                let date = new Date(+timestamp*1000);
                if ('Invalid Date' === date.toString()) {
                    return false;
                }
                let Y = date.getFullYear();
                let M = date.getMonth() + 1;
                let D = date.getDate();
                return Y+'年'+M+'月'+D+'日'
            }
        },
        data(){
            return{
                allAssigned:false,//全部已布置
                leftClassCount:0,
                deadline:0,
                overdue:false,//超过截止日期
                curTextbook: {
                    name:"人教新目标七年级上",
                    classLevel:null,
                    id:null,
                    termType:null
                },
                reviewVisible:false,//复习内容弹层
                weekList:[],
                reviewContent:{},
                previewContent:{},
                params:{},
                firstLoading:true
            }
        },
        methods:{
            //切换教材
            changeTextbook(){  
                let data = {
                    type: "selectTeacherMaterial",
                    params: { 
                        selectBookId: this.curTextbook.id,
                        term_types:''
                    }
                };
                forwardPage(data);
            },
            doFold(index){
                // console.log(index);
                if(this.weekList[index].isFolded){
                    this.weekList[index].isFolded=false;
                }else{
                    this.weekList[index].isFolded=true;
                }
            },
            // 获取教材信息
            async getBkData(){
                const resp = await ajax.post(process.env.baseUrl+(process.env.NODE_ENV=='development'?'':'/')+"pc/v1/assign/loadUlTree");
                if (resp.data.message == 'ok') {
                    Bus.$emit("event_status", "loaded");
                    let respData = resp.data.data;
                    this.curTextbook.name=respData.name;
                    this.curTextbook.classLevel=respData.clazz_level;
                    this.curTextbook.id=respData._id;
                    this.curTextbook.termType=respData.term_type;
                    this.getTask(this.curTextbook.id);
                } else {
                    Bus.$emit("event_status", "error");
                }
            },
            //获取是否所有班级都已布置
            async getIsAllAssigned(){
                const resp = await ajax.get(process.env.zxBaseUrl+"Mteacher/vacation/isAllClassesAssigned");
                if (resp.data.success == true) {
                    Bus.$emit("event_status", "loaded");
                    this.allAssigned = resp.data.data.all_assigned;
                    this.deadline=resp.data.data.limit_time;
                    this.leftClassCount=resp.data.data.count_unassigned_classes;
                    if(new Date().getTime()>(this.deadline*1000)){
                        this.overdue=true;
                    }
                    if(this.allAssigned && this.firstLoading){
                        this.$emit('checkoutTab',1);
                        return;
                    }
                    this.firstLoading=false;
                    this.getBkData();
                } else {
                    Bus.$emit("event_status", "error");
                }
            },
            //获取假期计划
            async getTask(bookId){
                console.log(process.env);
                Bus.$emit("loading", true);
                const resp = await ajax.get(process.env.baseUrl+(process.env.NODE_ENV=='development'?'':'/')+"v1/vacation/bookPlan",{params:{bookId}});
                if (resp.data.message == 'ok') {
                    Bus.$emit("event_status", "loaded");
                    let respData = resp.data.data;
                    console.log(respData);
                    let weekList=respData.weekList;
                    //处理展开收起
                    weekList.forEach((item,index) => {
                        if(index==0){
                            item.isFolded=false;
                        }else{
                            item.isFolded=true;
                        }
                    });
                    this.weekList=weekList;
                    //处理展示数据
                    let review=respData.contentList.review;
                    let preview=respData.contentList.preview;
                    let assignData=localStorageGet('vacation_homework','assignData').value;
                    if(assignData && review){    
                        let choosedReviewPackage=assignData.choosedInfo.choosedReviewPackage; 
                        choosedReviewPackage.forEach(item=>{
                            review.find(element => {
                                if(element.id==item.id){
                                    element.default=true;
                                }
                            });
                        })    
                    }
                    if(assignData && preview){
                        let choosedPreviewPackage=assignData.choosedInfo.choosedPreviewPackage;
                        choosedPreviewPackage.forEach(item=>{
                            preview.find(element => {
                                if(element.id==item.id){
                                    element.default=true;
                                }
                            });
                        })
                    } 
                    if(review){
                        let reviewContent={};
                        review.forEach(item => {
                            if(!reviewContent[item.sceneName]){
                                reviewContent[item.sceneName]=[];
                            }
                            reviewContent[item.sceneName].push(item);
                            
                        });
                        this.reviewContent=reviewContent;
                    }
                    if(preview){
                        let previewContent={};
                        preview.forEach(item => {
                            if(!previewContent[item.sceneName]){
                                previewContent[item.sceneName]=[];
                            }
                            previewContent[item.sceneName].push(item);
                            
                        });
                        this.previewContent=previewContent;
                    }
                    
                } else {
                    Bus.$emit("event_status", "error");
                }
                Bus.$emit("loading", false);
            },
            
            closePopup(){
                this.reviewVisible=false;
            },
            //提交编辑后的题包
            confirmContent(contentInfo){
                this.reviewContent=contentInfo;
                this.reviewVisible=false;   
            },
            //去预览练习
            goPreview(){
                let _this=this;
                //处理传给预览页的数据
                let storageData={
                    weekList:_this.weekList,
                    dayCount:_this.dayCount,
                    choosedInfo:_this.choosedInfo,
                    curTextbook:_this.curTextbook
                }
                localStorageSet('vacation_homework','assignData',storageData);
                //打点
                sendLog("", "", {
                    event: "onlineEn_VacationHomework_GoRelease",
                    logData: { homeworkType: "寒假作业" }
                });
                //跳转
                let urlData={
                    title:'预览练习',
                    url:`${window.location.origin}/mteacher/previewRelease.html?from_preview=1`
                }
                forwardPage(urlData);
            },
            //自选题包
            editPackage(){
                this.reviewVisible=true;
                Bus.$emit('logClick',"自选题包");
            }
        },
        components:{
            popup,editContents,releaseBar
        },
        computed:{
            dayCount(){
                let dayCount=0;
                this.weekList.forEach(item=>{
                    dayCount+=item.dayCount;
                })
                return dayCount;
            },
            choosedInfo(){//选取题包后的信息
                let minCount=0;
                let choosedReviewPackage=[];
                let choosedPreviewPackage=[];
                for(let key in this.reviewContent){
                    this.reviewContent[key].forEach(item=>{
                        if(item.default){
                            minCount+=item.minutes;
                            choosedReviewPackage.push(item);
                        }   
                    })
                }
                for(let key in this.previewContent){
                    this.previewContent[key].forEach(item=>{
                        if(item.default){
                            choosedPreviewPackage.push(item);
                        }
                    })
                }
                minCount=Math.ceil(minCount/4);
                return {minCount,choosedReviewPackage,choosedPreviewPackage};
            }
        },
        watch:{
            reviewVisible(){
                Bus.$emit('popupStatus',this.reviewVisible);
            }
        },
        created(){
            this.getIsAllAssigned();        
            Bus.$on("refreshData", () => {
                let params = getInitParams(true);
                if (params.select_book_info && this.curTextbook.id !=params.select_book_info._id) {
                    console.log(params);
                    this.curTextbook.name = params.select_book_info.name;
                    this.curTextbook.classLevel = params.select_book_info.clazz_level;
                    this.curTextbook.id = params.select_book_info._id;
                    this.curTextbook.termType = params.select_book_info.term_type;
                    this.getTask(this.curTextbook.id);
                }
            });
            Bus.$on('getReleaseInfo',() => {
                this.getIsAllAssigned();
            });
        },
        mounted() {
            var _this=this;
            vox.task.reloadVacationIndex=function(params){
                _this.getIsAllAssigned();
                Bus.$emit('refreshReport');
                var param=JSON.parse(params);
                if(param.tabIndex==1){
                    _this.$emit('checkoutTab',1);  
                }
            }
        }
    }
</script>

<style lang="less" scoped>
    .release-vc-work{
        line-height: 1.5;
        background-color: #f5f6f7;
        overflow-scrolling: touch;
        -webkit-overflow-scrolling: touch;
        .textbook {
            padding: 0 0.32rem;
            width: 100%;
            height: 0.88rem;
            line-height: 0.88rem;
            background: #fff;
            font-family: PingFangSC-Regular;
            font-size: 0.28rem;
            color: #171717;
            .changeTextbook {
                font-size: 0.24rem;
                color: #007aff;
                letter-spacing: 0;
                width: 1.5rem;
                height: 100%;
                float: right;
                padding-right: 0.3rem;
                text-align: right;
                background: url("../../assets/img/vacation/guide2.png") no-repeat center right;
                background-size: 0.24rem 0.24rem;
            }
        }
        .week-list{
            margin-bottom: 1.8rem;
            li{
                margin: 0.24rem 0.32rem 0;
                padding: 0.32rem;
                background-color: #fff;
                position: relative;
                border-radius: 0.12rem;
                .title{
                    font-weight: bold;
                    font-size: 0.32rem;
                    margin-bottom: 0.12rem;
                    i{
                        font-weight: normal;
                        margin-left: 0.2rem;
                        margin-top: -0.04rem;
                        vertical-align: middle;
                        line-height: 1;
                        display: inline-block;
                        padding: 0.05rem 0.11rem;
                        font-size: 0.22rem;
                        color:#fff;
                        background: #007AFF;
                        border-radius: 0.04rem;
                        &.preview{
                            background-color: #00C482;
                        }
                    }
                }
                .guide{
                    font-size: 0.24rem;
                    color: #58595E;
                }
                .unfolded{
                    background: #fff;
                    border-radius: 0.12rem;
                    .practice-item{
                        margin-top: 0.24rem;
                        background: #f9f9f9;
                        padding: 0.18rem 0.24rem;
                        border-radius: 0.04rem;
                        .subtitle{
                            font-size:0.24rem;
                            margin-bottom: 0.12rem;
                            color: #58595E;
                        }
                        .content{
                            font-size: 0.3rem;
                            overflow: hidden;
                            .item{
                                float: left;
                                margin-right: 0.72rem;
                                font-size: 0.3rem;
                                i{
                                    font-size: 0.2rem;
                                    padding: 0.03rem 0.08rem;
                                    background-color: #fff;
                                    color:#C8C8C8;
                                    border-radius: 0.04rem;
                                    margin-left: 0.12rem;
                                    position: relative;
                                    top: -0.02rem;
                                    &.choosed{
                                        color: #007AFF;
                                    }
                                }
                            }
                            
                        }
                    }
                    .edit{
                        font-size: 0.24rem;
                        text-align:center;
                        margin-top: 0.32rem;
                        color: #007AFF;
                        i{  
                            display: inline-block;
                            margin-top: 0.08rem;
                            width: 0.2rem;
                            height: 0.2rem;
                            background: url('../../assets/img/vacation/edit.png') no-repeat center;
                            background-size:contain;
                            margin-right: 0.14rem;
                        }
                    }
                }
                .folded{
                    p{
                        font-size: 0.24rem;
                        color: #58595E;
                        span{
                            display: inline-block;
                            padding: 0.02rem 0.12rem;
                            margin-right:0.12rem ;
                            margin-top: 0.12rem;
                            background-color: #F5F6F7;
                            border-radius: 0.04rem;
                        }
                    }
                }
                .fold-btn{
                    padding: 0 0.24rem;
                    height: 0.48rem;
                    line-height: 0.48rem;
                    font-size: 0.24rem;
                    color: #58595E;
                    position: absolute;
                    right: 0.32rem;
                    top: 0.24rem;
                    border:1px solid #E6E6E6;
                    border-radius: 0.24rem;
                    &::after{
                        content:'';
                        float: right;
                        width: 0.18rem;
                        height: 0.18rem;
                        margin-top: 0.15rem;
                        margin-left: 0.08rem;
                        background: url('../../assets/img/vacation/unfold.png') no-repeat center;
                        background-size: contain;
                        transform: rotate(180deg);
                    }
                    &.folded::after{
                        transform: rotate(0);
                    }
                }
            }
        }
        .release-left{
            position: fixed;
            bottom: 1rem;
            width: 100%;
            height: 0.56rem;
            line-height: 0.56rem;
            font-size: 0.24rem;
            color: #FFA400;
            background-color: #FFF1D2;
            text-align: center;
        }
        .all-assigned-page .img{
            background: url('../../assets/img/vacation/all_release.png') no-repeat center;
        }
        .deadline-page .img{
            background: url('../../assets/img/vacation/deadline_date.png') no-repeat center;
        }
        .no-content-page .img{
            background: url('../../assets/img/vacation/blank.png') no-repeat center;
        }
        .blank-page{
            .img{
                width: 4rem;
                height: 4rem;
                margin: 2.24rem auto 0.32rem;
                background-size: contain;
            }   
            p{
                text-align:center;
                color: #9D9FA1;
                font-size: 0.28rem;
                margin-bottom:0.08rem;

            } 
        }
    }
</style>
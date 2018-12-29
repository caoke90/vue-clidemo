<template>
    <div style="position: absolute;width: 100%;height: 100%;">
        <m-header></m-header>
        <div class="assign-vc-work" :class="{'deadline-hide':!deadlineShow}">
            <div class="page-crumb">
                <m-crumb :pageInfo="pageInfo"></m-crumb>
            </div>   
            <material ref='book'></material>
            <div v-show="isLoading" style="height: 500px; background-color: white; width: 100%;position: relative;">
                <img src="../assets/img/loading.gif" style="width: 144px;height: 147px;position: absolute;top: 50%;left: 0;right: 0;margin: -74px auto 0;"/>
            </div>
            <div class="review section" v-if='reviewContent' v-show='!isLoading'>
                <div class="title">
                    复习 · 第 1 - {{reviewWeekCount}} 周<i>每周{{reviewDayPerWeek}}天，每天练习内容如下：</i>
                    <div class="btn" @click='editContent'>自选题包</div>
                </div>
                <div class="unfolded"> 
                    <div class="practice-item" v-for="(practice,key) in reviewContent" :key='key'>
                        <div class="subtitle">{{key}}</div>
                        <div class="content">
                            <div class="item" v-for="exercise in practice" :key='exercise.packageType'>
                                <div class="package" :class="{'choosed':exercise.default}">
                                    {{exercise.packageType}}<i :class="{'choosed':exercise.default}">{{exercise.default?'已选':'未选'}}</i>
                                    <p>{{exercise.size/4}}题 · {{exercise.minutes/4}}分钟 · {{exercise.questionSubtype}}</p>
                                </div>
                                
                            </div>
                        </div>
                    </div>
                </div> 
            </div>
            <div class="preview section" v-if='hasPreview && previewContent' v-show='!isLoading'>
                <div class="title">
                    预习 · 第 {{previewWeekIndex}} 周<i>每周{{previewDayPerWeek}}天，每天练习内容如下：</i>
                </div>
                <div class="unfolded"> 
                    <div class="practice-item" v-for="(practice,key) in previewContent" :key='key'>
                        <div class="subtitle">{{key}}</div>
                        <div class="content">
                            <div class="item" v-for="exercise in practice" :key='exercise.packageType'>
                                <div class="package">
                                    {{exercise.packageType}}<i :class="{'choosed':exercise.default}">{{exercise.default?'已选':'未选'}}</i>
                                    <p>{{exercise.size/4}}题 · {{exercise.minutes/4}}分钟 · {{exercise.questionSubtype}}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div> 
            </div>
            <div class="operate-bar" ref='operate'>
                <div class="deadline-info" v-if='deadlineShow'>{{deadline | formatDate}}后不能发布<i class="close-icon" @click='deadlineShow=false'></i></div>
                <div class="main-operate">
                    <div class="btn"  @click='goAssign' :class="{'disable':overdue || allAssigned}">{{overdue?'发布时间已截止':allAssigned?'所有班级已发布':'一键发布'}}</div>
                    <div class="text">共{{dayCount}}天，预计每天 <i>{{choosedInfo.minCount}}</i> 分钟内</div>
                </div>
            </div>
        </div>
        
        <!-- 自选题包 -->
        <choosePackage :contentInfo='reviewContent' 
        :choosePackageShow='choosePackageShow'
        @submit='confirmContent' 
        @closeChoosePackage='closeChoosePackage' 
        v-if='choosePackageShow' 
        :hasPreview='hasPreview'>
        </choosePackage>
        <!-- 发布 -->
        <assignWork :assignWorkShow='assignWorkShow' 
        :assignInfo='assignInfo'
        @submit="submitAssign"
        @closeAssignWork='closeAssignWork' 
        v-if='assignWorkShow' 
        :hasPreview='hasPreview'>
        </assignWork>        
    </div>
    
</template>

<script>
    import '../utils/Format';
    import Bus from '@/marvel/bus.js';
    import ajax from '@/api/ajax';
    import sendSaLog from '@/utils/sa';
    import choosePackage from'./vacation/choosePackage.vue'
    import assignWork from './vacation/assignWork.vue'
    export default{
        data(){
            return {
                isLoading:true,
                pageInfo:[{name:"首页",selectd:true,url:window.zxbaseURL+"/"},{name:"发布假期练习",selectd:false}],
                weekList:[],
                hasPreview:true,
                reviewWeekCount:4,//复习周数
                previewWeekIndex:5,//预习周index
                reviewDayPerWeek:4,
                previewDayPerWeek:4,
                reviewContent:null,
                previewContent:null,
                deadlineShow:true,//底部显示截止时间
                allAssigned:false,
                deadline:0,
                overdue:false,//过期
                choosePackageShow:false,
                assignWorkShow:false,
                assignInfo:{}
            }
        },
        methods:{
            loadIsAllAssigned:async function(){
                let content = await ajax.get(process.env.zxbaseURL+'/teacher/vacation/isAllClassesAssigned');
                if(content.data.success == true){
                    this.allAssigned = content.data.data.all_assigned;
                    this.deadline=content.data.data.limit_time;
                    if(new Date().getTime()>(this.deadline*1000)){
                        this.overdue=true;
                    }
                }    
            },
            loadData:async function(bookId){
                let content = await ajax.get('/pc/v1/vacation/bookPlan',{params:{bookId}});
                if(content.data.message == 'ok'){
                    let respData = content.data.data;
                    let weekList=respData.weekList;
                    this.weekList=weekList;
                    //处理复习预习周与天数
                    let reviewWeekCount=0;
                    let previewWeekIndex=-1;
                    weekList.forEach(item=>{
                        if(item.contentType=='review'){
                            reviewWeekCount++;
                        }else  if(item.contentType=='preview'){
                            previewWeekIndex=item.week;
                        }
                    })
                    if(previewWeekIndex < 0){
                        this.hasPreview=false;
                    }else{
                        this.hasPreview=true;
                        this.previewWeekIndex=previewWeekIndex;
                        this.previewDayPerWeek=weekList[previewWeekIndex-1].dayCount;
                    }
                    this.reviewWeekCount=reviewWeekCount;
                    this.reviewDayPerWeek=weekList[0].dayCount;
                    //处理展示数据
                    let review=respData.contentList.review;
                    let preview=respData.contentList.preview;
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
                }
                this.isLoading=false;
            },
            //自选题包
            editContent(){
                this.choosePackageShow=true
                //打点
                sendSaLog('onlineEn_VacationHomework_ClickModule', {
                    homeworkType:"寒假作业",
                    moduleName:"自选题包"
                },true);      
            },
            closeChoosePackage(){
                this.choosePackageShow=false;
            },
             //提交选择后的题包
            confirmContent(contentInfo){
                this.choosePackageShow=false;
                this.reviewContent=contentInfo;
            },
            goAssign(){
                if(this.overdue || this.allAssigned){
                    return false;
                }
                let packageArr=[];
                this.choosedInfo.choosedReviewPackage.forEach(item=>{
                    packageArr.push(item.id);
                });
                this.choosedInfo.choosedPreviewPackage.forEach(item=>{
                    packageArr.push(item.id);
                })
                let packages=packageArr.join(',');
                this.assignInfo={
                    minCount:this.choosedInfo.minCount,
                    bookName:this.$refs.book.bookname,
                    bookId:this.$refs.book.params.bk_id,
                    packages:packages
                }    
                this.assignWorkShow=true;
                //打点
                sendSaLog('onlineEn_VacationHomework_GoRelease', {homeworkType:"寒假作业"},true);          
            },
            closeAssignWork(){
                this.assignWorkShow=false;
            },
            // 布置成功后
            submitAssign(){
                this.loadIsAllAssigned();
            },
            setTop() {
                //获取可视窗口高度
                let y=this.deadlineShow?92:60;
                var top =document.documentElement.offsetHeight || document.body.offsetHeight;
                var oTop = top-y;
                //设置初始高度
                var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
                var h = oTop+scrollTop;         
                //  监听滚动条动态定位
                this.$refs.operate.style.top=h+'px';
            }
        },
        watch:{
            deadlineShow(){
                this.setTop();
            }
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
        created() {
            this.isLoading=true;
            this.loadIsAllAssigned();
            Bus.$on('refreshPlan',val =>{
                this.isLoading=true;
                this.loadData(val);
            })
            //打点
            sendSaLog('onlineEn_VacationHomework_Load', {
                homeworkType:"寒假作业",
                screenType:'发布'
            },true);
            
        },
        mounted() {
            let _this=this;
            _this.setTop();
            window.onresize=function(){
                _this.setTop();
            }
            window.onscroll=function(){
                _this.setTop();
            }
        },
        components:{
            'm-header':require('./common/mheader.vue'),
            'm-crumb':require('./common/crumb.vue'),
            'material':require('./assign/material.vue'),
            'modal':require('../components/modal.vue'),
            choosePackage,
            assignWork
        },
        filters:{
             formatDate(timestamp){
                let date = new Date(+timestamp*1000);
                return date.Format('yyyy年M月d日');
            }
        }
    }
</script>

<style lang="scss">
    @import '../assets/css/assign.css';
    .assign-vc-work{
        color: #333;
        width: 1000px;
        margin: 0 auto;
        padding-bottom:102px;
        &.deadline-hide{
            padding-bottom: 70px;
        }
        i{
             font-style: normal;
        }
        .page-crumb{
            padding-top: 14px;
            padding-bottom: 4px;
        }
        .section{
            background-color: #fff;
            border: 1px solid #DBE6EE;
            margin-top: 10px;
            .title{
                padding: 0 20px;
                height: 56px;
                line-height: 56px;
                font-size: 18px;
                font-weight: bold;
                border-bottom: 1px solid #DBE6EE;
                i{
                    vertical-align: middle;
                    font-size: 12px;
                    font-weight: normal;
                    margin-left: 12px;
                }
                .btn{
                    float: right;
                    margin-top: 12px;
                    width: 80px;
                    height: 30px;
                    font-size: 14px;
                    line-height: 30px;
                    text-align:center;
                    border:1px solid #159CFC;
                    border-radius: 2px;
                    font-weight: normal;
                    color:#159CFC;
                    cursor: pointer;
                    &:hover{
                        background:#F5FBFF;
                        border:1px solid #159CFC;
                    }
                }
            }
            .unfolded{
                overflow: hidden;
                .practice-item{
                    float: left;
                    width: 25%;
                    height: 254px;
                    border-right: 1px solid #E6EDF3;
                    &:nth-of-type(4n){
                        border-right: 0;
                    }
                    .subtitle{
                        margin-top:20px;
                        width: 90px;
                        height: 28px;
                        line-height: 28px;
                        border-radius: 0 14px 14px 0;
                        text-align: center;
                        background: #F4F5F8;
                        color: #555;
                    }
                    .content{
                        padding: 0 20px;
                        .item{
                            &:nth-last-child(1) .package{
                                border-bottom:0;
                            }
                            .package{
                                padding:24px 0;
                                font-size: 14px;
                                font-weight: bold;
                                border-bottom: 1px dashed #DBE6EE;
                                color: #7e7e7e;
                                &.choosed{
                                    color: #333;
                                }
                                i{
                                    vertical-align: middle;
                                    display: inline-block;
                                    padding: 0 5px;
                                    font-size: 12px;
                                    border:1px solid #E6E6E6;
                                    line-height: 18px;
                                    color: #ACACAC;
                                    text-align: center;
                                    margin-left: 8px;
                                    border-radius: 2px;
                                    font-weight: normal;
                                    &.choosed{
                                        border:1px solid #159CFC;
                                        background: #159CFC;
                                        color: #fff;
                                    }
                                }
                                p{
                                    margin-top: 12px;
                                    font-size: 12px;
                                    color: #7F7E7E;
                                    font-weight: normal;
                                    white-space: nowrap;
                                    overflow: hidden;
                                    text-overflow: ellipsis;
                                }
                            }
                
                        }
                    }
                }
            }
        }
        .operate-bar{
            width:1000px;
            margin: 0 auto;
            // position: fixed;
            // bottom: 0;
            position: absolute;
            overflow: auto;
            .deadline-info{
                text-align: right;
                padding: 0 20px;
                background:#FFF1D2;
                height: 32px;
                line-height: 32px;
                font-size: 14px;
                color: #FF9747;
                .close-icon{
                    margin-left: 12px;
                    margin-top: -4px;
                    display: inline-block;
                    vertical-align: middle;
                    width: 16px;
                    height: 16px;
                    background: url('../assets/img/vacation/close.png') no-repeat center center;
                    background-size: cover;
                    cursor: pointer;
                }
            }
            .main-operate{
                width: 100%;
                padding: 0 20px;
                background-color: #fff;
                height: 60px;
                line-height: 60px;
                // background: url('../assets/img/vacation/bot_bg.png') no-repeat center center;
                // background-size: cover;
                overflow: hidden;
                .text{
                    float:right;
                    margin-right: 20px;
                    i{
                        font-size: 24px;
                    }
                }
                .btn{
                    float: right;
                    height: 40px;
                    line-height: 40px;
                    padding: 0 22px;
                    background:  #159CFC;
                    margin-top: 10px;
                    color: #fff;
                    font-weight: bold;
                    cursor: pointer;
                    position: relative;
                    &.disable{
                        padding: 0 12px;
                        opacity: 0.4;
                    }
                    &:hover{
                        background: #5CBBFF;
                    }
                }
            }
        }
    }
</style>
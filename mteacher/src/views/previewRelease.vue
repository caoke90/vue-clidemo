<template>
    <div class="preview-release">
        <div class="text-book">已选教材：{{curTextbook.name}}</div>
        <ul class="release-list">
            <li v-for='weekItem in weekList' :key='weekItem.week'>
                <div class="title">第{{weekItem.week}}周 · {{weekItem.contentType=='review'?'复习':'预习'}}<span>(共{{weekItem.dayCount}}天练习，每天内容如下)</span></div>
                <ul class="content">
                    <li v-for="exercise in choosedReviewPackage" :key='exercise.id' v-if='weekItem.contentType=="review"'>
                        <div class="subtitle">{{exercise.packageType}}</div>
                        <p class="detail">{{Math.ceil(+exercise.size/4)}}题 · {{Math.ceil(+exercise.minutes/4)}}分钟 · {{exercise.questionSubtype}}</p>
                    </li>
                    <li v-for="exercise in choosedPreviewPackage" :key='exercise.id' v-if='weekItem.contentType=="preview"'>
                        <div class="subtitle">{{exercise.packageType}}</div>
                        <p class="detail">{{Math.ceil(+exercise.size/4)}}题 · {{Math.ceil(+exercise.minutes/4)}}分钟 · {{exercise.questionSubtype}}</p>
                    </li>
                </ul>
            </li>
        </ul>
        <releaseBar :dayCount='dayCount' :minCount='minCount' btnText='确定' @submit='release'></releaseBar>

    </div>
</template>

<script>
    import { sendLog } from "@/common/js/logger";
    import {localStorageGet} from '../common/js/external/localStorage'
    import releaseBar from '../components/vacationWork/releaseBar'
    import {updateTitle} from "../common/js/external/index";
    import {forwardPage} from "../common/js/external/teacher"
    export default{
        data(){
            return {
                weekList:[],
                dayCount:0,
                curTextbook:{},
                minCount:0,
                choosedReviewPackage:[],
                choosedPreviewPackage:[]
            }
        },
        methods:{
            //发布
            release(){
                //打点
                sendLog("", "", {
                    event: "onlineEn_VacationHomework_FirmPreview",
                    logData: { homeworkType: "寒假作业" }
                });

                let _this=this;
                let typesArr=[];
                this.choosedReviewPackage.forEach(item=>{
                    typesArr.push(item.id);
                });
                this.choosedPreviewPackage.forEach(item=>{
                    typesArr.push(item.id);
                })
                let types=typesArr.join(',');
                let params = {
                    type: "goNewCommitArrangement",
                    params: {
                        source:"winter_vacation",
                        book_id:_this.curTextbook.id,
                        book_name:_this.curTextbook.name,
                        types
                    }
                };
                forwardPage(params);
            }
        },
        components:{
            releaseBar
        },
        created() {
            updateTitle("预览练习", "", "");
            let assignData=localStorageGet('vacation_homework','assignData').value;
            this.curTextbook= assignData.curTextbook;
            this.weekList=assignData.weekList;
            this.dayCount=assignData.dayCount;
            this.minCount=assignData.choosedInfo.minCount;
            this.choosedReviewPackage=assignData.choosedInfo.choosedReviewPackage;
            this.choosedPreviewPackage=assignData.choosedInfo.choosedPreviewPackage;
            console.log(assignData);
            console.log(this.choosedPreviewPackage);

        }
    }
</script>

<style lang="less" scoped>
    .preview-release{
        color: #171717;
        line-height: 1.5;
        background-color: #f5f6f7;
        overflow-scrolling: touch;
        -webkit-overflow-scrolling: touch;
        .text-book{
            position: relative;
           height: 0.88rem;
           line-height: 0.88rem;
           font-size: 0.28rem;
           padding: 0 0.32rem 0 0.92rem;
           margin: 0.32rem 0.32rem 0;
           background-color: #fff;
           border-radius: .12rem;
           &:before {
                position: absolute;
                content: '';
                top: 0; bottom: 0;
                left: 0.32rem;
                height: 0.44rem;
                margin: auto;
                width: 0.44rem;
                background: url('../assets/img/vacation/text-book.png') no-repeat;
                background-size: cover;
           }
        }
        .release-list{
            padding: 0 0.32rem 1.32rem;
            .title{
                margin-top: 0.32rem;
                margin-bottom: 0.24rem;
                font-size: 0.28rem;
                height: 0.42rem;
                line-height: 0.42rem;
                color: #58595E;
                position: relative;
                span{
                    font-size: 0.24rem;
                    color: #9D9FA1;
                    margin-left: 0.24rem;
                }
                &::after{
                    content:'';
                    display: block;
                    width: 0.08rem;
                    height: 0.24rem;
                    background-color: #007AFF;
                    position: absolute;
                    top: 0.08rem;
                    left: -0.32rem;
                }
            }
            .content{
                background-color: #fff;
                padding-left:0.32rem;
                border-radius: .12rem;
                li{
                    width: 100%;
                    height: 1.1rem;
                    line-height: 1.1rem;
                    border-bottom: 1px solid #E6E6E6;
                    overflow: hidden;
                    display: flex;
                    &:nth-last-child(1){
                        border-bottom: 0;
                    }
                    .subtitle{
                        font-size: 0.32rem;
                    }
                    p.detail{
                        font-size: 0.24rem;
                        color: #58595E;
                        padding-left: 0.4rem;
                        flex: 1;
                        overflow: hidden;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                    }
                }
            }
        }
    }
</style>

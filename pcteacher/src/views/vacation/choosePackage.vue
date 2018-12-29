<template>
    <div class="choose-package">
        <modal :isshow='choosePackageShow' @close='closeChoose'>
            <template slot='title'> 
                <div class="title">自选题包<span>(统一编辑1-{{hasPreview?4:5}}周复习题包)</span></div>
            </template>
            <template slot='content'> 
                <div class="content">
                    <ul class="exercises">
                        <li v-for='(practice,key) in showContent' :key='key'>
                            <div class="practice-title">{{key}}：</div>
                            <div class="practice-content">
                                <div class="item" 
                                :class="{'checked':exercise.default,'required':exercise.required}"
                                v-for='exercise in practice' 
                                :key='exercise.packageType' 
                                @click='chooseContent(key,exercise)'>
                                    <i class="check-box"></i>
                                    {{exercise.packageType}} <span v-if='exercise.required'>(必选)</span>
                                </div>
                            </div>
                        </li>
                    </ul>
                    <div class="min-count">
                        <i class="time-icon"></i>预计每天用时 <span>{{choosedInfo.minCount}}</span> 分钟内
                    </div>
                    <div class="operate">
                        <div class="btn-left btn" @click='closeChoose'>取消</div>
                        <div class="btn-right btn" @click='confirmContent'>确认</div>
                    </div>
                </div>
            </template>
        </modal>
    </div>
</template>

<script>
    export default{
        data(){
            return {
                showContent:{},
                oldContentId:'',//自选前题包id
            }
        },
        methods:{
            closeChoose(){
                this.$emit('closeChoosePackage');
            },
            chooseContent(key,exercise){
                if(exercise.required){
                    return false;
                }else{
                    exercise.default=!exercise.default;
                }
            },
            confirmContent(){
                this.$emit('submit',this.showContent);
                if(this.oldContentId==this.choosedInfo.newContentId){
                    return false;
                }
                this.$message({
                    message: '编辑成功',
                    type: 'success'
                });
            }
        },
        watch:{
            contentInfo:{
                handler:function(){
                    this.showContent=JSON.parse(JSON.stringify(this.contentInfo));
                    let oldContentId=[];
                    for(let key in this.contentInfo){
                        this.contentInfo[key].forEach(item=>{
                            if(item.default){
                                oldContentId.push(item.id);  
                            }  
                        })
                    }
                    this.oldContentId=oldContentId.join(',');
                },
                immediate:true
            },
        },
        computed:{
            choosedInfo(){
                let minCount=0;
                let newContentId=[];
                for(let key in this.showContent){
                    this.showContent[key].forEach(item=>{
                        if(item.default){
                            minCount+=item.minutes;
                            newContentId.push(item.id);  
                        }   
                    })
                }
                newContentId=newContentId.join(','); 
                minCount=Math.ceil(minCount/4);
                return {minCount,newContentId}
            }
        },
        components:{
            'modal':require('../../components/modal.vue'),
        },
        props:['choosePackageShow','contentInfo','hasPreview']
    }
</script>

<style lang="scss" scoped>
    .choose-package{
        color: #555;
        .title{
            font-weight: bold;
            span{
                font-weight: normal;
                font-size: 14px;
                color:#252525;
                position: relative;
                top: -2px;
                left:14px;
            }
        }
        .content{
            width: 500px;
            padding-bottom: 40px;
            .exercises{
                margin: 40px 0 30px 120px;
                li{
                    height: 20px;
                    line-height: 20px;
                    margin-bottom: 20px;
                    .practice-title{
                        margin-right: 8px;
                        color: #7F7E7E;
                        float: left;
                    }
                    .practice-content{
                        overflow: hidden;
                        .item{
                            cursor: pointer;
                            width: 120px;
                            color:#555;
                            float: left;
                            .check-box{
                                margin-top: 3px;
                                vertical-align: middle;
                                float: left;
                                width: 14px;
                                height: 14px;
                                border: 1px solid #CBD8E1 ;
                                margin-right:8px;
                            }
                            &.checked{
                                .check-box{
                                    border: 1px solid #189CFB;
                                    background: url(../../assets/img/teacher/list-select-logo.png) no-repeat center center;
                                    background-size: contain;
                                }
                            }
                            &.required{
                                opacity: 0.4;
                            }
                        }
                    }
                }
            }
            .min-count{
                height: 28px;
                line-height: 28px;
                text-align: center;
                color: #F97051;
                .time-icon{
                    display: inline-block;
                    width: 14px;
                    height: 14px;
                    background:url('../../assets/img/vacation/time.png') no-repeat center center;
                    background-size: cover;
                    margin-right: 10px;
                    vertical-align: middle;

                }
                span{
                    font-size: 20px;
                }
            }
            .operate{
                width: 240px;
                margin:30px auto 0;
                overflow: hidden;
                .btn{
                    width: 100px;
                    height:40px;
                    line-height: 40px;
                    text-align: center;
                    color: #fff;
                    cursor: pointer;
                    &.btn-left{
                        float: left;
                        background: #30BD9B;
                    }
                    &.btn-right{
                        float: right;
                        background: #159CFC;
                    }
                }
            }
        }
    }
</style>
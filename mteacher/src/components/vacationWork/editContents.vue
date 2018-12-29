<template>
    <div class="edit-content">
        <h3>
            <span>{{contentTitle}}</span>
            <i class="close" @click='closeModal'></i>
        </h3>
        <ul class="exercises">
            <li v-for='(practice,key) in showContent' :key='key'>
                <div class="title">{{key}}</div>
                <div class="content">
                    <div class="item" 
                    :class="{'choosed':exercise.default}"
                    v-for='exercise in practice' 
                    :key='exercise.packageType' 
                    @click='chooseContent(key,exercise)'>
                        {{exercise.packageType}} <span v-if='exercise.required'>(必选)</span>
                    </div>
                </div>
            </li>
        </ul>
        <div class="bottom">
            <p class="time">预计每天 {{minCount}} 分钟内</p>
            <div class="btn" @click='confirmContent'>确定</div>
        </div>  
    </div> 
</template>

<script>
    import {showToast} from "../../common/js/external/index";
    export default{
        data(){
            return{
                showContent:{},
                oldContentId:'',//自选前题包id
                newContentId:''//自选后题包id
            }
        },
        methods:{
            closeModal(){
                this.$emit('closePopup');
            },
            //选择题包
            chooseContent(key,exercise){//key:基础巩固 exerciese:每个item
                if(exercise.required){
                    showToast('必选内容不支持取消')
                }else{
                    exercise.default=!exercise.default;
                }
            },
            //提交编辑
            confirmContent(){
                this.$emit('submit',this.showContent);
                if(this.newContentId==this.oldContentId){
                    return false;
                }
                showToast('编辑成功');
            }
        },
        computed:{
            minCount(){
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
                this.newContentId=newContentId.join(','); 
                return Math.ceil(minCount/4);
            }
        },
        props:['contentTitle','contentInfo'],
        mounted() {
            this.showContent=JSON.parse(JSON.stringify(this.contentInfo));
            console.log(this.showContent);
            let oldContentId=[];
            for(let key in this.contentInfo){
                this.contentInfo[key].forEach(item=>{
                    oldContentId.push(item.id); 
                })
            }
            this.oldContentId=oldContentId.join(',');
        }
    }
</script>

<style lang="less" scoped>
    .edit-content{
        color: #171717;
        line-height:1.5;
        h3{
            height: 1rem;
            line-height: 1rem;
            text-align: center;
            font-size: 0.32rem;
            font-weight: bold;
            border-bottom: 1px solid #E6E6E6;
            position: relative;
            .close{
                display: block;
                width: 0.48rem;
                height: 0.48rem;
                background: url('../../assets/img/vacation/close.png') no-repeat center;
                background-size: contain;
                position: absolute;
                top: 0.26rem;
                right: 0.32rem;
            }   
        }
        ul.exercises{
            padding:0.32rem 0.4rem 0;
            li{
                margin-bottom:0.4rem;
                .title{
                    font-size: 0.28rem;
                    color: #58595E;
                    margin-bottom: 0.24rem;
                }
                .content{
                    overflow: hidden;
                    .item{
                        width: 3.2rem;
                        height: 0.6rem;
                        text-align: center;
                        line-height: 0.6rem;
                        color: #58595E ;
                        background-color: #F5F6F7;
                        border: 1px solid #F5F6F7;
                        font-size: 0.24rem;
                        border-radius: 0.04rem;
                        &:nth-of-type(2n-1){
                            float: left;
                        }
                        &:nth-of-type(2n){
                            float: right;
                        }
                        &.choosed{
                            background-color:#F2F8FF;
                            border: 1px solid #007AFF;
                            color: #007AFF;
                        }
                    }
                }
            }
            
        }
        .bottom{
            border-top: 1px solid #E6E6E6;
            .time{
                height: 0.74rem;
                line-height: 0.74rem;
                text-align:center;
                font-size: 0.28rem;
                color: #58595E;
            }
            .btn{
                width: 6.7rem;
                height: 0.8rem;
                line-height: 0.8rem;
                text-align:center;
                background-color: #007AFF;
                color: #fff;
                border-radius: 0.4rem;
                margin: 0 auto 0.2rem;
            }
        }
    }
</style>
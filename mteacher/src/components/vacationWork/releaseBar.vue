<template>
    <div class="release-bar">
        <div class="text">
            <i class="icon"></i>
            <span>{{dayCount}}天，预计每天 <i>{{minCount}}</i> 分钟内</span>
        </div>
        <div class="btn" @click='submit'>{{btnText}}</div>
    </div>
</template>

<script>
    export default{
        data(){
            return {
            
            }
        },
        methods:{
            submit(){
                this.$emit('submit')
            }
        },
        props:['dayCount','minCount','btnText']
    }
</script>

<style lang="less" scoped>
    .release-bar{
        width: 100%;
        position: fixed;
        bottom: 0;
        left: 0;
        height: 1rem;
        line-height: 1rem;
        overflow: hidden;
        padding-left: 0.32rem;
        background-color: #FAFAFA;
        .text{
            float: left;
            font-size: 0.28rem;
            color: #58595E ;
            .icon{
                display: inline-block;
                width: 0.32rem;
                height: 0.32rem;
                background:url('../../assets/img/vacation/time.png') no-repeat center;
                vertical-align: middle;
                background-size: contain;
                margin-top: -0.02rem;
                margin-right: 0.1rem;
                
            }
            i{
                color:#007AFF;
                font-size: 0.32rem;
            }
        }
        .btn{
            float: right;
            width: 2.08rem;
            background-color: #007AFF;
            font-size: 0.3rem;
            color: #fff;
            line-height: 1rem;
            text-align: center;
        }
    }
</style>
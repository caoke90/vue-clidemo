<template>
    <div class="warp" v-show="isShowDialog">
        <div class="dialogBox">
            <div class="diaTitle">
                <h3>{{confirmModalOptions.title || '提示'}}</h3>
            </div>
            <div class="diaContent">
                <p class="content_p"
                   :class="[confirmModalOptions.textAlign=='center' ? 'textCenter':'']"
                   :key="index"
                   v-for="(item,index) in confirmModalOptions.content"
                   v-if="Array.isArray(confirmModalOptions.content)">{{index+1}}.{{item}}</p>
                <p class="content_p"  :class="[confirmModalOptions.textAlign=='center' ? 'textCenter':'']" v-else>{{confirmModalOptions.content}}</p>
            </div>
            <div class="diaFooter" @click="confirmSubmit()">
                <button> {{confirmModalOptions.btnSubmitText || "确定"}}</button>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "Dialog",
        props:['confirmModalOptions'],
        data (){
            return{
                isShowDialog:false
            }
        },
        methods:{
            closeModel: function () {
                this.isShowDialog = false;
            },
            showModel: function () {
                this.isShowDialog = true;
            },
            confirmSubmit: function () {
                this.isShowDialog = false;
                if(typeof (this.confirmModalOptions.btnSubmitFunction)==='function'){
                    this.confirmModalOptions.btnSubmitFunction()
                }
            }
        }
    }
</script>

<style scoped lang="scss" type="text/css" rel="stylesheet/scss">
    .warp{
        width: 100%;
        height: 100%;
        position: fixed;
        top:0;
        left: 0;
        background:rgba(51, 51, 51,0.8);
        z-index: 2;
        .dialogBox{
            width: 85%;
            padding:0.4rem;
            min-height: 2rem;
            background: #FFFFFF;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate3d(-50%, -50%, 0);
            -ms-transform:  translate3d(-50%, -50%, 0);
            -moz-transform:  translate3d(-50%, -50%, 0);
            -webkit-transform:  translate3d(-50%, -50%, 0);
            -o-transform:  translate3d(-50%, -50%, 0);
            transition: .2s ease-out;
            backface-visibility: hidden;
            border-radius: 5px;
            .diaTitle{
                position: relative;
                width:100%;
                h3{
                    font-size: 0.36rem;
                    color: #171717;
                    text-align: center;
                    line-height:0.54rem;
                    margin-bottom: 0.24rem;
                }
            }
            .diaContent{
                max-height: 5.6rem;
                overflow-y: scroll;
                .textCenter{
                    text-align: center;
                }
                .content_p{
                    font-size: 0.28rem;
                    color: #58595E;
                    line-height:0.42rem;
                    margin-bottom: 0.16rem;
                    text-overflow: ellipsis;
                    overflow: hidden;
                }
            }
            .diaFooter{
                padding-top: 0.24rem;
                width: 100%;
                button{
                    width: 100%;
                    height: 0.8rem;
                    line-height: 0.8rem;
                    background: #007AFF;
                    color: #FFFFFF;
                    border: none;
                    outline: none;
                    text-align: center;
                    border-radius: 30px;
                    font-size: 0.32rem;
                }
            }
        }
    }
</style>
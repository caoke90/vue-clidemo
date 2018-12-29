<template>
    <!-- 写评语 -->
    <div class="ui-comment" v-if="showComment" role="dialog">
        <div class="modal-dialog" :class="{'min': showTips}">
            <div class="modal-header">
                <span class="title">{{viewComment?'查看评语':'写评语'}}</span>
                <div class="close" @click="hide">x</div>
            </div>
            <template v-if="showTips">
                <div  class="modal-body" v-if="viewComment">
                    <p class="modal-tips">{{viewComment}}</p>
                </div>
                <div class="modal-body" v-else>
                    <p class="modal-tips" v-if="wordLeft<0">您发送的评语内容超过了100字</p>
                    <p class="modal-tips" v-else>填写您要发送的评语内容</p>
                </div>
                <div class="modal-footer">
                    <div v-if="viewComment" class="center" @click="hide">确定</div>
                    <div v-else class="center" @click="tipsFn(false)">确定</div>
                </div>
            </template>
            <template v-else>
                <div class="modal-body">
                    <div class="modal-group">
                        <label>给：</label>
                        <div>{{to}}</div>
                    </div>
                    <div class="modal-group">
                        <label>评语：</label>
                        <div>
                            <select v-model="selectTxt">
                                <option value="">请选择</option>
                                <option v-for="c in ComArr" :value="c">{{c}}</option>
                            </select>
                            <textarea v-model="comment"></textarea>
                            <p class="help-block error" v-if="wordLeft<0">已超出{{0-wordLeft}}个字</p>
                            <p class="help-block" v-else>还可以输入{{wordLeft}}个字</p>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <div class="left" @click="hide">取消</div>
                    <div class="right" @click="confirm">提交</div>
                </div>
            </template>
        </div>
    </div>
</template>
<script>
    import Bus from '../../marvel/bus';
    const ComArr = [
        '完成得不错！',
        '恭喜你，你已经取得了很大的进步！',
        '有些小错误，下次要多加注意。',
        '如果你更加努力的话，我相信你会做得更好！',
        '如果能把所有练习都按时完成，你会进步得很快！',
        'Wonderful!',
        'Excellent!',
        'Nice work!',
        'I think you can do better if you try harder.',
        'I’m glad to see you are making progress.'
    ];
    export default {
        data() {
            return {
                to: '',
                ComArr,
                comment: '',
                selectTxt: '',
                viewComment: '',
                showTips: false,
                showComment: false
            }
        },
        computed: {
            wordLeft() {
                let txt = this.comment || '';
                let len = txt.length;
                return 100 - len;
            }
        },
        watch: {
            'selectTxt': {
                handler: function (n, o) {
                    if (n !== o) {
                        let txt = this.comment || '';
                        txt += this.selectTxt;
                        this.comment = txt;
                    }
                }
            }
        },
        methods: {
            modalFn(show) {
                this.$nextTick(() => {
                    this.showComment = Boolean(show);
                })
            },
            tipsFn(show) {
                this.showTips = Boolean(show);
            },
            confirm() {
                // 没写评语
                if (!this.comment) {
                    this.tipsFn(true);
                    return;
                }
                // 超出100
                if (this.wordLeft < 0) {
                    this.tipsFn(true);
                    return;
                }
                Bus.$emit('write_comment', this.comment)
            },
            show(conf) {
                conf = conf || {};
                this.to = conf.to || '';
                this.viewComment = conf.comment || '';
                this.showTips = !!conf.comment;
                this.comment = '';
                this.selectTxt = '';
                if (conf.comArr) {
                    this.comArr = conf.comArr;
                }
                this.modalFn(true);
            },
            hide() {
                this.modalFn(false);
            }
        },
        created() {
            Bus.Comment = this;
        }
    }
</script>
<style lang="scss">
    .ui-comment {
        position: fixed;
        height: 100%;
        width: 100%;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 99;
        background: rgba(119,119,119,0.60);
        .modal-dialog {
            position: absolute;
            top: 0; bottom: 0;
            left: 0; right: 0;
            margin: auto;
            height: 400px;
            width: 500px;
            background: #fff;
            border-radius: 5px;
            &.min { height: 300px; }
            .modal-header {
                .title {
                    position: relative;
                    display: inline-block;
                    height: 46px;
                    width: 100%;
                    font-family: 'PingFangSC-Medium';
                    padding-left: 20px;
                    font-size: 18px;
                    color: #555555;
                    line-height: 46px;
                    border-bottom: 1px solid #DAE6EF;
                    width: calc(100% - 46px);
                }
                .close {
                    float: right;
                    display: inline-block;
                    width: 46px;
                    height: 46px;
                    line-height: 46px;
                    text-align: center;
                    border-bottom: 1px solid #DAE6EF;
                    border-left: 1px solid #DAE6EF;
                    color: #000000;
                    font-size: 20px;
                    cursor: pointer;
                }
            }
            .modal-body {
                padding: 15px;
                .modal-group {
                    font-family: 'PingFangSC-Regular';
                    font-size: 14px;
                    color: #7F7E7E;
                    text-align: right;
                    margin: 15px 0;
                    min-height: 20px;
                    label {
                        padding-right: 10px;
                        float: left;
                        text-align: right;
                        width: 20%;
                    }
                    div {
                        float: left;
                        display: inline-block;
                        text-align: left;
                        width: 80%;
                        select {
                            float: left;
                            height: 25px;
                            width: 150px;
                            background-color: #fff;
                            border: 1px solid #dedede;
                            color: #555;
                            padding: 2px 9px;
                            line-height: 19px;
                            vertical-align: middle;
                            margin-bottom: 10px;
                        }
                        textarea {
                            float: left;
                            width: 324px;
                            height: 113px;
                            outline: none;
                            resize: none;
                            border: 1px solid #dedede;
                        }
                        .help-block {
                            font-family: 'PingFangSC-Regular';
                            font-size: 12px;
                            color: #7F7E7E;
                            float: left;
                            margin-top: 4px;
                            width: 324px;
                            text-align: right;
                            &.error {
                                color: #ff1100;
                            }
                        }
                    }
                }
                .modal-tips {
                    height: 150px;
                    padding-top: 50px;
                    text-align: center;
                }
            }
            .modal-footer {
                text-align: center;
                div {
                    cursor: pointer;
                    position: absolute;
                    bottom: 30px;
                    height: 40px;
                    width: 100px;
                    font-family: 'PingFangSC-Medium';
                    font-size: 14px;
                    color: #FFFFFF;
                    line-height: 40px;
                }
                .center {
                    left: 0; right: 0;
                    background: #159CFC;
                    margin: 0 auto;
                }
                .left {
                    background: #30BD9B;
                    left: 130px;
                }
                .right {
                    background: #159CFC;
                    right: 130px;
                }
            }
        }
    }
</style>

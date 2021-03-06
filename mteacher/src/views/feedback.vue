<template>
    <div class="container" :style="{ height: clientHeight + 'px' }">
        <template v-if="success === 'ok'">
            <!-- 系统评分 -->
            <div class="score-sys">
                <div class="score-sys-t">本题系统打分{{level}} ({{score}}分)，您认为该分数：</div>
                <div class="flex-item">
                    <div class="score-sys-b left" @click="selectSys(2)" :class="{'active': feedback_grade == 2}">偏低</div>
                    <div class="score-sys-b center" @click="selectSys(1)" :class="{'active': feedback_grade == 1}">正常</div>
                    <div class="score-sys-b right" @click="selectSys(3)" :class="{'active': feedback_grade == 3}">偏高</div>
                </div>
            </div>
            <!-- 期望分数 -->
            <div class="score-exp">
                <div class="score-exp-t">您的期望分数为（选填）</div>
                <input type="number" placeholder="未填写" @keydown="preventNotNumber" name="feedback_score" v-model="feedback_score" @blur="scrollIntoView(0)" @focus="scrollIntoView(50)" @touchstart="showKeyboard">
            </div>
            <!-- 补充信息 -->
            <div class="exteral-txt">
                <div class="exteral-txt-t">补充信息（选填）</div>
                <textarea class="__show-scrollbar__" placeholder="输入反馈内容..." v-model="feedback_text" name="feedback_text" @blur="scrollIntoView(0)" @focus="scrollIntoView(50)" @touchstart="showKeyboard"></textarea>
            </div>
            <!-- toast -->
            <div class="toast" v-if="!!toastMsg">{{ toastMsg }}</div>
        </template>
        <!-- error -->
        <template v-else>
            <msg :card="{ type: 'error' }"></msg>
        </template>
    </div>
</template>
<script>
    // ajax请求
    import ajax from '../api/ajax';
    import Bus from '../marvel/bus';

    // 网络异常
    import msg from '../components/cards/msg.vue';

    // log
    import { sendLog } from '../common/js/logger';
    import log from '../common/js/utils/logConfig';

    // util
    import { hget, vExtend }  from '../utils/hobj';
    import {
        externalConfig,
        setTopBarInfo,
        getInitParams,
        updateTitle,
        showToast
    } from '../common/js/external/index';

    // 本地存储
    import {
        localStorageSet,
        localStorageGet,
        localStorageRemove
    } from '../common/js/external/localStorage';

    import {pageQueueBack} from '../common/js/external/pageQueue';

    export default {
        data() {
            return {
                level: '',
                score: '',
                success: '',
                toastMsg: '',
                clientHeight: 0,
                feedback_text: '',
                feedback_grade: 0,
                feedback_score: ''
            }
        },
        components: { msg },
        watch: {
            'feedback_grade': {
                handler: function (n, o) {
                    if (n !== o) {
                        setTopBarInfo({
                            show: true,
                            rightText: '提交',
                            needCallBack: true,
                            rightTextColor: '007AFF',
                            nextAction: this._params.historyPageUrl
                        });
                    }
                }
            },
            'feedback_text': {
                handler: function (n, o) {
                    if (n !== o) {
                        this.watchExternalConf();
                    }
                }
            },
            'feedback_score': {
                handler: function (n, o) {
                    if (n !== o) {
                        this.watchExternalConf();
                    }
                }
            }
        },
        methods: {
            isBackspace(keyValue) {
                return keyValue === 8;   // Backspace
            },
            isDot(keyValue) {
                return (keyValue === 190 || keyValue === 110);  // . 非数字键盘 数字键盘
            },
            isNumber(keyValue) {
                return (keyValue >= 48 && keyValue <= 57);  // [0-9]
            },
            preventNotNumber(event) {
                var keyValue = window.event ? event.keyCode : event.which;
                if (!this.isBackspace(keyValue) && !this.isDot(keyValue) && !this.isNumber(keyValue)) {
                    // 其他按键
                    event.preventDefault();
                    event.stopPropagation();
                    return false;
                }
            },
            watchExternalConf() {
                let confirmOnQuit = !!(this.feedback_score || this.feedback_text);
                let confirmOnQuitMsg = '保留此次补充信息？';

                // 缓存里有记录 用户手动删除输入内容 同时删除缓存记录
                if (this.hasCacheData && !this.feedback_score && !this.feedback_text) {
                    this.localDataFn('remove');
                }
                externalConfig({
                    confirmOnQuit,
                    confirmOnQuitMsg,
                    confirmLeftTxt: '不保留',
                    confirmRightTxt: '保留',
                    confirmLeftNeedCallBack: 'vox.task.feedbackCancel',
                    confirmRightNeedCallBack: 'vox.task.feedbackSave'
                });
            },
            localDataFn(type) {
                // 一条音频对应一条反馈记录，以url作为key本地缓存
                let key = this._params.user_audio_url;
                let data = {};

                switch(type) {
                    case 'get':
                        data = localStorageGet('feedback', key);
                        data = data.value;
                        break;
                    case 'set':
                        data = localStorageSet('feedback', key, {
                            feedback_text: this.feedback_text,
                            feedback_score: this.feedback_score,
                            feedback_grade: this.feedback_grade
                        });
                        break;
                    case 'remove':
                        data = localStorageRemove('feedback', key);
                        break;
                    default:
                        throw new Error('type error.');
                }
                return data;
            },
            initData: async function () {
                let url = 'mteacher/page/feedbackDetail';
                if (this._params.historyDomain) {
                    url = this._params.historyDomain + url;
                } else {
                    url = '/v1/' + url;
                }

                let content = await ajax.get(url, { params: vExtend({
                    score: '',
                    student_id: '',
                    homework_id: '',
                    question_id: '',
                    action_name: '',
                    practice_type: '',
                    user_audio_url: '',
                    content_type_ids: ''
                }, this._params)});

                if (hget(content, 'data.success') === true) {
                    let data = hget(content, 'data.data', {});
                    let subjectData = data.subject_data || {};

                    // 口语不展示 级别
                    if (this._params.practice_type !== 'oral') {
                        this.level = subjectData.level || '';
                        this.score = subjectData.score || 0;
                    } else {
                        this.score = subjectData.localize_score_get || subjectData.score || 0;
                    }

                    // 这里处理返回的数据 提交时用到的字段
                    // 教研需要看具体题目详情 反馈提交增加
                    // 使用try{}catch(){}以免影响反馈页面
                    try {
                        this.getQuestionData(data);
                    } catch (e) {
                        console.log('反馈取值异常：['+e+']')
                    }

                    // 读取保存local里的数据
                    let cacheData = this.localDataFn('get');
                    if (cacheData) {
                        this.hasCacheData = !!(cacheData.feedback_text || cacheData.feedback_score); // 标记有缓存数据

                        this.feedback_text = cacheData.feedback_text;
                        this.feedback_score = cacheData.feedback_score;
                        this.feedback_grade = cacheData.feedback_grade;
                    }

                    this.success = 'ok';
                } else {
                    this.success = 'faild';
                }
            },
            showToastFn(msg) {
                this.toastMsg = msg;
                setTimeout(function () {
                    this.toastMsg = '';
                }.bind(this), 2000);
            },
            submit: async function() {
                // 收起键盘
                this.hideKeyboard();
                if (this.validate()) return false;

                let url = 'mteacher/page/feedbackSubmit';
                if (this._params.historyDomain) {
                    url = this._params.historyDomain + url;
                } else {
                    url = '/' + url;
                }
                let content = await ajax.post(url , vExtend({
                        seq: 0,
                        content: '',
                        sub_score: 0,
                        student_id: '',
                        homework_id: '',
                        question_id: '',
                        action_name: '',
                        practice_type: '',
                        engine_version: '000',
                        user_audio_url: '',
                        voice_texts_new: '',
                        content_type_ids: '',
                        new_content_subtype_id: '',
                        feedback_grade: this.feedback_grade,
                        feedback_score: this.feedback_score,
                        feedback_text: this.feedback_text
                    }, this._params)
                );

                // 提交打点
                sendLog('', '', {
                    event: log.op.feedback_submit,
                    logData: {
                        Supplement: this.feedback_text || "",
                        ExpectScore: this.feedback_score || "",
                        StudentID: this._params.student_id || "",
                        questionID: this._params.question_id || "",
                        FeedbackResult: ['','正常','偏低','偏高'][this.feedback_grade]
                    }
                });

                if (hget(content, 'data.success') === true) {
                    // 清除一下缓存
                    this.localDataFn('remove');

                    this.backCtrlFn(true);
                    return true;
                } else {
                    showToast(hget(content, 'data.message', '反馈失败！'));
                    return false;
                }
            },
            backCtrlFn(isShow) {
                if (isShow) {
                    localStorageSet('feedback', 'toast', { showToast: true });
                    // showToast('感谢您的反馈，我们会持续优化！');
                }
                pageQueueBack({
                  step: 1,
                  needReloadPage: true,
                  needRefreshData: true
                });
            },
            validate() {
                // 未选择系统评分
                if (this.feedback_grade == 0) {
                    return true;
                }
                // 字数超出限制
                if (this.feedback_text.length > 1000) {
                    this.showToastFn('字数超过最大限制，最多可输入1000字');
                    return true;
                }
                return false;
            },
            selectSys(num) {
                this.feedback_grade = num;
            },
            scrollIntoView(num) {
                let $dom = event.target || {};
                // this.clientHeight = this.clientHeightBak + num;
                this.$nextTick(function () {
                    $dom.scrollIntoView(false);
                }.bind(this))
            },
            showKeyboard(event) {
                let $dom = event.target || {};
                $dom.focus();
            },
            hideKeyboard() {
                let $input = document.querySelector('input');
                let $textarea = document.querySelector('textarea');
                $input.blur();
                $textarea.blur();
            },
            getQuestionData(data) {
                let seq = 0;
                let content = '';
                let sub_score = 100;
                let totalScore = 100;
                let studentData = [];
                let voice_texts_new = '';
                let content_type_ids = '';
                let sc_index = this._params.sc_index || 0; // 查询题目详情小题的索引
                let fd_index = this._params.fd_index || 0; // 用户点击反馈列表索引（一道小题对应多音频）

                if (this._params.practice_type === 'oral') { // 口语
                    studentData = hget(data, 'question_data.sub_content_datas', []);
                    seq = studentData[sc_index] && studentData[sc_index].seq;
                    totalScore = hget(data, 'question.local_type_obj', []);
                    totalScore = totalScore[0] && totalScore[0].total_score;
                    sub_score = totalScore/studentData.length;
                } else {
                    studentData = hget(data, 'question_data', []);
                    seq = Number(fd_index) + 1; // 索引从1开始
                }

                let sub_contents = hget(data, 'question.content.sub_contents', []);
                let subQuestion = sub_contents[sc_index] || {};
                let subContentTypeId = subQuestion.sub_content_type_id;

                content_type_ids = hget(data, 'question.new_content_subtype_id', 0);

                switch (content_type_ids) {
                    case 203017003: // 单词跟读
                    case 203017005: // 例句跟读
                    case 203017006: // 句子跟读
                        content = studentData[fd_index].contents[0];
                        voice_texts_new = content;
                        break;
                    case 203017008: // 情景对话（作业）
                        content = subQuestion.oral_dict.options[fd_index].voice_texts_new[0][0];
                        voice_texts_new = content;
                        break;
                    case 203017007: // 逐句跟读
                    case 203017010: // 段落朗读
                        content = subQuestion.oral_dict.options[0].voice_text;
                        voice_texts_new = content;
                        break;
                    case 203016001: // 听选信息
                    case 203016002: // 回答问题
                    case 203016003: // 信息转述
                    case 203016004: // 询问信息
                    case 203016006: // 情景反应
                    case 203016007: // 情景问答
                    case 203016008: // 口头表达
                        content = subQuestion.content;
                        voice_texts_new = subQuestion.oral_dict.answers.map((ans)=>ans.answer).join('或');
                        break;
                    case 203016000: // 短文朗读 & 模仿朗读
                    case 203016010: // 读单词
                    case 203016011: // 读句子
                        if (subContentTypeId == 21) { // 模仿朗读
                            content = subQuestion.oral_dict.options[0].text;
                            voice_texts_new = content;
                        } else {
                            content = subQuestion.oral_dict.voice_texts_new[0][0];
                            voice_texts_new = content;
                        }
                        break;
                    case 203016005: // 情景对话
                        sub_score = sub_score/studentData[sc_index].sentences.length; // 单条音频的分
                        content = subQuestion.oral_dict.options.filter((opt)=>opt.role_type==1)[fd_index].voice_texts_new[0][0];
                        voice_texts_new = content;
                        break;
                    default:
                        console.log('题型不匹配');
                }

                this._params.seq = seq || 0;
                this._params.content = content || '';
                this._params.sub_score = sub_score || 0;
                this._params.voice_texts_new = voice_texts_new || '';
                this._params.new_content_subtype_id = content_type_ids || '';
            }
        },
        created: async function () {
            let params = getInitParams();

            this._params = params;

            ajax.defaults.baseURL = params.historyDomain;

            // 右侧顶部信息
            setTopBarInfo({
                show: true,
                rightText: '提交',
                needCallBack: true,
                rightTextColor: 'C8C8C8',
                nextAction: this._params.historyPageUrl
            });

            // 设置title
            updateTitle('打分反馈');

            this.clientHeightBak = document.body.clientHeight || document.documentElement.clientHeight;

            this.clientHeight = this.clientHeightBak;

            // 初始化数据
            await this.initData();

            // 返回二次确认弹窗
            this.watchExternalConf();

            // 保留
            Bus.$on('event_feedback_save', function () {
                this.localDataFn('set');
                this.backCtrlFn(false);
            }.bind(this));

            // 不保留
            Bus.$on('event_feedback_cancel', function () {
                this.localDataFn('remove');
                this.backCtrlFn(false);
            }.bind(this));

            // 提交按钮回调
            vox.task.setTopBarInfoCallBack = function () {
                this.submit();
            }.bind(this);
        }
    }
</script>
<style lang="scss" scoped>
    @keyframes fadeIn {
        0% { transform: translate(-50%, 10%); opacity: .1; }
        30% { transform: translate(-50%, -50%); opacity: .5; }
        70% { transform: translate(-50%, -55%); opacity: .7; }
        100% { transform: translate(-50%, -50%); opacity: .95; }
    }
    .container {
        max-width: 750px;
        margin: 0 auto;
        font-size: 0.26rem;
        -webkit-overflow-scrolling: touch;
        height: 100vh;
        color: #58595E;
        -webkit-touch-callout:none;
        -moz-user-select: none;
        -webkit-user-select: none;
        -ms-user-select: none;
        user-select: none;
        padding: 0 .4rem;
        font-family: PingFangSC-Regular;
        background: #fff;
        .score-sys {
            position: relative;
            height: 2.11rem;
            width: 6.7rem;
            margin: 0 auto;
            padding: .3rem 0;
            .flex-item {
                display: flex;
                justify-content: space-around;
            }
            &-t {
                display: inline-block;
                font-size: .28rem;
                font-family: PingFangSC-Regular;
                color: #58595E;
            }
            &-b {
                position: relative;
                width: 2.02rem;
                height: .59rem;
                margin: .3rem 0;
                display: inline-block;
                background: #F5F6F7;
                border-radius: 4px;
                line-height: .59rem;
                font-size: .24rem;
                font-family: PingFangSC-Regular;
                color: #58595E;
                text-align: center;
                border: 1px solid #F5F6F7;
                &.left { float: left; }
                &.right { float: right; }
                &.center { margin: .3rem; }
                &.active {
                    background: #F2F8FF;
                    border: 1px solid #007AFF;
                    color: #007AFF;
                }
            }
        }
        .score-exp {
            position: relative;
            width: 6.7rem;
            height: 2.1rem;
            margin: 0 auto;
            &-t {
                font-size: .28rem;
                font-family: PingFangSC-Regular;
                color: #58595E;
            }
            input {
                position: relative;
                height: .88rem;
                width: 6.7rem;
                background: #F5F6F7;
                margin-top: .3rem;
                border-radius: 4px;
                border: 1px solid #fff;
                padding: .24rem;
                font-family: PingFangSC-Regular;
                font-size: .28rem;
                color: #58595E;
                letter-spacing: 0;
                line-height: .42rem;
                outline: 0;
                -webkit-appearance: none;
            }
        }
        .exteral-txt {
            &-t {
                position: relative;
                font-family: PingFangSC-Regular;
                font-size: .28rem;
                color: #58595E;
            }
            textarea {
                position: relative;
                height: 3.2rem;
                width: 6.7rem;
                background: #F5F6F7;
                margin-top: .3rem;
                border-radius: 4px;
                border: 1px solid #fff;
                padding: 0 0.24rem;
                border-top: 0.24rem solid #F5F6F7;
                border-bottom: 0.24rem solid #F5F6F7;
                font-family: PingFangSC-Regular;
                font-size: .28rem;
                color: #58595E;
                letter-spacing: 0;
                line-height: .42rem;
                outline: 0;
                -webkit-appearance: none;
            }
        }
        .toast {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 5.97rem;
            height: .8rem;
            line-height: .8rem;
            opacity: 0.95;
            background: #333333;
            border-radius: .1rem;
            font-family: PingFangSC-Regular;
            font-size: .3rem;
            color: #FFFFFF;
            text-align: center;
            animation: fadeIn .2s ease-in-out;
        }
    }
</style>

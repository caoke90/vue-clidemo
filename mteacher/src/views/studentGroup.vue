<template>
    <!-- student froup -->
    <div class="container __stu-group__">
        <!-- success -->
        <template v-if="success === 'ok'">
            <!-- top -->
            <div class="group-top">
                <!-- end_time -->
                <div class="top-dt">
                    截止时间：<span>{{dateFormat(end_time)}}</span>
                    <div v-if="!edit_end" @click="edit" class="dt-edit">修改</div>
                    <div v-if="edit_end" class="dt-end">已截止</div>
                </div>
                <!-- flexbox -->
                <div class="top-box">
                    <div class="box-item border">
                        <em>{{count_finished_students}}</em><span>人</span>
                        <p>已完成</p>
                    </div>
                    <div class="box-item border">
                        <em>{{count_going_students}}</em><span>人</span>
                        <p>进行中</p>
                    </div>
                    <div class="box-item">
                        <em>{{count_not_started_students}}</em><span>人</span>
                        <p>未开始</p>
                    </div>
                </div>
            </div>
            <!-- list -->
            <ul class="group-list">
                <li v-for="stu in stuStatusArr" :class="['grey','bule','green'][stu.status]" @click="goDetail(stu)">
                    <span class="name">{{stu.real_name}}</span>
                    <span class="count" :class="{'arrow':stu.status!=0}">
                        {{stu.count_finished}}<em>&nbsp;/&nbsp;{{count_homework}}</em>
                    </span>
                    <span class="status">{{stu.tabName}}</span>
                </li>
            </ul>
            <!-- ios下margin-bottom失效 -->
            <div class="ios-mb"></div>
            <!-- bottom -->
            <div class="group-bottom">
                <div @click="writeComments">发奖励&nbsp;/&nbsp;写评语</div>
            </div>
            <!--confirm-->
            <div class="group-confirm" v-if="showConfirm">
                <div class="content">
                    <p class="title">确定删除"{{class_name}}"练习吗?</p>
                    <p class="detail">删除后，学生端任务和已完成记录都将被清空</p>
                    <div class="left" @click="confirm(false)">取消</div>
                    <div class="right" @click="del">确定</div>
                </div>
            </div>
        </template>
        <!-- error -->
        <template v-else>
            <msg :card="{ type: 'error', msg: errorMsg }"></msg>
        </template>
    </div>
</template>
<script>
    import ajax from '../api/ajax';
    import Bus from '../marvel/bus';
    import msg from '../components/cards/msg.vue';  // 网络异常
    import { sendLog } from '../common/js/logger';  // log
    import { hget, vExtend }  from '../utils/hobj'; // util
    import { pageQueueBack } from '../common/js/external/pageQueue';
    import { localStorageSet } from '../common/js/external/localStorage';
    import { forwardPage, showTimerPicker } from '../common/js/external/teacher';
    import { setTopBarInfo, updateTitle, showToast } from '../common/js/external/index';

    const baseUrl = process.env.zxBaseUrl;
    const origin = window.location.origin;

    const URLARR = [
        baseUrl + 'Mteacher/vacation/StudentsStatus',
        baseUrl + 'Mteacher/vacation/changePlanTime',
        baseUrl + 'Mteacher/vacation/deletePlan',
        origin + '/mteacher/studentDetail.html',
        origin + '/mteacher/winterVacationWork.html#1'
    ];
    export default {
        data() {
            return {
                success: '',                    // 接口状态
                class_id: '',                   // 班级ID
                errorMsg: '',                   // 错误信息
                edit_end: '',                   // 是否显示截止
                end_time: '',                   // 结束时间
                start_time: '',                 // 开始时间
                class_name: '',                 // 班级
                stuStatusArr: [],               // 学生
                count_homework: 0,              // 作业数量
                showConfirm: false,             // 确认删除
                latest_end_time: '',            // 最晚结束时间
                earliest_end_time: '',          // 最晚布置时间
                latest_assign_time: '',         // 最晚截止时间
                count_going_students: 0,        // 进行中
                count_finished_students: 0,     // 已完成
                count_not_started_students: 0   // 未开始
            }
        },
        components: { msg },
        methods: {
            async initData() {
                let plan_id = this._params.plan_id;
                let content = await ajax.get(URLARR[0], { params: { plan_id } })

                if (hget(content, 'data.success') == true) {
                    let data = hget(content, 'data.data', {});
                    let students = data.hw_result_users || [];

                    data.stuStatusArr = [];

                    students.forEach((stu) => {
                        let userArr = stu.users || [];
                        if (userArr instanceof Array) {
                        } else { userArr = [userArr]; }

                        userArr.forEach((user) => {
                            user.tabName = stu.tabName;
                            if (user.count_finished == data.count_homework) {
                                user.status = 2;     // 已完成
                            } else if (user.count_finished == 0) {
                                user.status = 0;     // 未开始
                            } else {
                                user.status = 1;     // 进行中
                            }
                            data.stuStatusArr.push(user);
                        })
                    })

                    this.edit_end = data.earliest_end_time <= new Date().getTime();

                    vExtend(this.$data, data);
                    this.success = 'ok';
                } else {
                    this.errorMsg = hget(content, 'data.message');
                    this.success = 'faild';
                }
            },
            edit() {
                let timestamp = '' + this.end_time;
                let nowTime = '' + new Date().getTime();
                let max_timestamp = '' + this.latest_end_time;
                let min_timestamp = '' + this.earliest_end_time;
                if (nowTime > min_timestamp) { min_timestamp = nowTime; }

                // 时间编辑打点
                sendLog('', '', {
                    event: 'onlineEn_VacationHomework_ClickModule',
                    logData: { homeworkType: '寒假作业', moduleName: '修改截止时间' }
                });

                showTimerPicker({ timestamp, min_timestamp, max_timestamp });
            },
            async changePlanTime(time) {
                let plan_id = this._params.plan_id;
                let end_time = time;
                let content = await ajax.post(URLARR[1], { plan_id, end_time });

                if (hget(content, 'data.success') == true) {
                    this.end_time = end_time;
                    showToast('截止时间已修改')
                } else {    // TODO 修改时间失败
                    showToast(hget(content, 'data.message', '修改时间失败，请重试！'))
                }
            },
            canDel() {
                let nowTime = new Date().getTime();
                let assTime = +this.latest_assign_time;
                if (nowTime > assTime) { return 0; } // 超过1月31日
                else { return 1; }
            },
            confirm(show) {
                if (this.canDel()) {
                    this.showConfirm = Boolean(show);
                } else {
                    showToast('很抱歉，假期将近过半，不能删除了')
                }
            },
            async del() {
                let plan_id = this._params.plan_id;

                // 删除确定打点
                sendLog('', '', {
                    event: 'onlineEn_VacationHomework_ClickModule',
                    logData: { homeworkType: '寒假作业', moduleName: '确定删除' }
                });

                let content = await ajax.post(URLARR[2], { plan_id });

                if (hget(content, 'data.success') == true) {
                    // TODO 删除成功
                    let step = 1;
                    let url = URLARR[4];
                    this.showConfirm = false;
                    let needReloadPage = true;
                    let needRefreshData = true;

                    localStorageSet('studentGroup', 'del', { success: true });

                    pageQueueBack({ step, url, needReloadPage, needRefreshData })
                } else {    // TODO 删除失败
                    showToast(hget(content, 'data.message', '删除失败！'))
                }
            },
            goDetail(stu) {
                if (stu.count_finished == 0) { return; }

                let type = '';
                let url = URLARR[3];
                let needCart = false;
                let student_id = stu.user_id;
                let real_name = stu.real_name;
                let title = real_name+'的练习';
                let plan_id = this._params.plan_id;
                let params = { plan_id, student_id, real_name };

                forwardPage({ url, needCart, type, title, params });
            },
            writeComments() {
                let clazz_id = this.class_id;
                let type = 'setClassComments';
                let source = 'winter_vacation';
                let plan_id = this._params.plan_id;
                let params = { plan_id, clazz_id, source };

                // 班级奖励打点
                sendLog('', '', {
                    event: 'onlineEn_VacationHomework_ClickModule',
                    logData: { homeworkType: '寒假作业', moduleName: '班级一键奖评' }
                });

                forwardPage({ type, params });
            },
            dateFormat(time, del) {
                if (!time) { return; }
                let date = new Date(+time);
                if ('Invalid Date' === date.toString()) {
                    return 'Invalid Date'
                }
                let Y = date.getFullYear();
                let M = date.getMonth() + 1;
                let D = date.getDate();
                let H = date.getHours();
                let m = date.getMinutes();
                let d = date.getDay();

                M = M < 10 ? '0'+M : M;
                D = D < 10 ? '0'+D : D;
                H = H < 10 ? '0'+H : H;
                m = m < 10 ? '0'+m : m;
                d = ['日','一','二','三','四','五','六'][d];
                if (del) { return ''+Y+'年'+M+'月'+D+'日'; }
                return ''+Y+'.'+M+'.'+D+' '+H+':'+m+' '+'（周'+d+'）';
            }
        },
        async created() {
            let params = window.initParams || {};

            this._params = params;

            // 从上个页面带过来plan_id
            if (!params.plan_id) {
                this.success = 'faild';
                this.errorMsg = '数据加载异常{plan_id}为空';
                return;
            }

            await this.initData();

            updateTitle(this.class_name);

            setTopBarInfo({
                show: true,
                rightText: '删除',
                needCallBack: true,
                rightTextColor: this.canDel() ? '171717' : 'C8C8C8'
            });

            // 时间选择器回调
            vox.task.datetimeCallback = function (time) {
                this.changePlanTime(time);
            }.bind(this);

            // 删除按钮
            vox.task.setTopBarInfoCallBack = function () {
                this.confirm(true);
            }.bind(this);
        }
    }
</script>
<style lang="scss" scoped>
    .__stu-group__ {
        position: relative;
        max-width: 750px;
        margin: 0 auto;
        font-size: .28rem;
        touch-action: manipulation; // Fastclick preventDefault
        // overflow-y: auto;
        -webkit-overflow-scrolling: touch;
        height: 100vh;
        .group-top {
            width: 100%;
            height: 3.98rem;
            padding: .24rem 0;
            background: #2997FF 100%;
        }
        .top-dt {
            position: relative;
            width: 6.86rem;
            height: .8rem;
            line-height: .8rem;
            text-align: left;
            margin: 0 0.32rem;
            padding: 0 0.32rem;
            font-family: 'PingFangSC-Regular';
            font-size: .28rem;
            color: #FFFFFF;
            background: #32A8FF;
            border-radius: .1rem;
            .dt-edit {
                position: absolute;
                right: 0;
                width: 1.1rem;
                top: 0;
                font-size: .24rem;
                &:after {
                    position: absolute;
                    top: 0; bottom: 0;
                    margin: auto;
                    right: .26rem;
                    content: '';
                    height: .24rem;
                    width: .24rem;
                    background: url('../assets/img/arrow_left.png') no-repeat;
                    background-size: cover;
                    filter: brightness(100);
                    -webkit-filter: brightness(100);
                }
            }
            .dt-end {
                position: absolute;
                right: 0.32rem;
                top: 0;
                font-size: .24rem;
            }
        }
        .top-box {
            position: relative;
            width: 100%;
            height: 2.14rem;
            .box-item {
                position: relative;
                width: 2.48rem;
                height: 100%;
                float: left;
                color: #FFFFFF;
                letter-spacing: 0;
                padding: .4rem .2rem;
                text-align: center;
                em {
                    font-family: '17-DIN-Bold';
                    font-size: .8rem;
                    color: #FFFFFF;
                    letter-spacing: 0;
                    line-height: .8rem;
                }
                p {
                    margin-top: .12rem;
                }
                &.border:after {
                    position: absolute;
                    right: 0; top: 0;
                    content: '';
                    height: 0.8rem;
                    width: 0.02rem;
                    margin: 0.67rem 0;
                    background: #51B4FF;
                }
            }
        }
        .group-list {
            position: relative;
            width: 6.86rem;
            margin: -0.8rem auto 0;
            padding-left: 0.32rem;
            background: #fff;
            border-radius: .1rem;
            .grey {
                .name {
                    color: #C8C8C8;
                }
                .status {
                    background: #F5F6F7;
                    color: #C8C8C8;
                }
                .count {
                    color: #C8C8C8;
                }
            }
            .bule {
                .status {
                    background: #2997FF;
                }
            }
            .green {
                .status {
                    background: #00C482;
                }
            }
            li {
                position: relative;
                height: 1rem;
                line-height: 1rem;
                font-family: 'PingFangSC-Regular';
                font-size: .28rem;
                color: #333333;
                z-index: 10;
                text-align: right;
                &:after {
                    position: absolute;
                    content: '';
                    bottom: 0; left: 0;
                    width: 100%; height: 0.02rem;
                    border-bottom: .02rem solid #E6E6E6;
                    -webkit-transform: scaleY(.5);
                    transform: scaleY(.5);
                }
                .name {
                    position: relative;
                    font-size: .28rem;
                    color: #333333;
                    float: left;
                }
                .status {
                    position: relative;
                    display: inline-block;
                    height: .32rem;
                    width: .87rem;
                    font-size: .22rem;
                    color: #FFFFFF;
                    letter-spacing: 0;
                    line-height: .32rem;
                    border-radius: .05rem;
                    margin: 0.34rem .24rem 0.34rem 0;
                    text-align: center;
                    border-radius: .04rem;
                    float: right;
                }
                .count {
                    position: relative;
                    display: inline-block;
                    margin-right: .72rem;
                    font-family: '17-DIN-Regular';
                    font-size: .36rem;
                    color: #171717;
                    letter-spacing: 0;
                    width: 1.3rem;
                    float: right;
                    em {
                        color: #9D9FA1;
                    }
                    &.arrow:after {
                        position: absolute;
                        content: '';
                        display: inline-block;
                        right: -0.48rem;
                        height: .24rem;
                        width: .24rem;
                        top: 0; bottom: 0;
                        margin: auto;
                        background: url('../assets/img/arrow_left.png') no-repeat;
                        background-size: cover;
                    }
                }
                &:last-child:after {
                   display: none;
                }
            }
        }
        .ios-mb {
            position: relative;
            width: 100%;
            height: 1.44rem;
            visibility: hidden;
        }
        .group-bottom {
            position: fixed;
            bottom: 0;
            width: 100%;
            height: 1.2rem;
            opacity: 0.9;
            max-width: 7.5rem;
            background: #FFFFFF;
            box-shadow: inset 0 .02rem 0 0 #E6E6E6;
            z-index: 20;
            opacity: 1;
            div {
                position: absolute;
                top: 0; bottom: 0;
                left: 0; right: 0;
                margin: auto;
                width: 6.7rem;
                height: .8rem;
                text-align: center;
                line-height: .8rem;
                background: #007AFF;
                font-family: 'PingFangSC-Regular';
                font-size: .32rem;
                color: #FFFFFF;
                border-radius: .4rem;
            }
        }
        .group-confirm {
            position: fixed;
            background: rgba(0,0,0,0.70);
            top: 0; bottom: 0;
            left: 0; right: 0;
            z-index: 20;
            touch-action: none;
            .content {
                position: absolute;
                margin: auto;
                top: 0; bottom: 0;
                left: 0; right: 0;
                background: #FFFFFF;
                height: 3.66rem;
                width: 6rem;
                padding: .4rem;
                border-radius: .2rem;
                .title {
                    font-family: 'PingFangSC-Medium';
                    font-size: .34rem;
                    color: #171717;
                    text-align: center;
                    line-height: .54rem;
                    margin-bottom: .24rem;
                    word-break: keep-all;
                }
                .detail {
                    font-family: 'PingFangSC-Regular';
                    font-size: .28rem;
                    color: #58595E;
                    line-height: .42rem;
                    text-align: justify;
                }
                div {
                    position: absolute;
                    bottom: 0.4rem;
                    text-align: center;
                    height: .8rem;
                    width: 2.46rem;
                    line-height: .8rem;
                    border-radius: .4rem;
                    font-size: .32rem;
                    &.left { left: 0.4rem; background: #F5F6F8; color: #58595E; }
                    &.right { right: 0.4rem; background: #007AFF; color: #FFFFFF; }
                }
            }
        }
    }
</style>

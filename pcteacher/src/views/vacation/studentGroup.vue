<template>
    <!-- student group -->
    <div class="stu-group">
        <!-- crumb -->
        <m-crumb :pageInfo="pageInfo"></m-crumb>
        <!-- loading -->
        <div v-if="loading">
            <img class="loading" src="../../assets/img/loading.gif">
        </div>
        <!-- content -->
        <div class="content" v-else>
            <!-- loading -->
            <li v-if="!stuList" class="load"><img class="loading" src="../../assets/img/loading.gif"></li>
            <!-- end time -->
            <div class="end-time">截止时间：{{ dateFormat(end_time) }}
                <span class="edit" v-if="overTime" @click="selectDate(true)">修改</span>
                <span class="end" v-else>已截止</span>
            </div>
            <!-- flex box -->
            <div class="stu-box">
                <div class="finished">
                    <span class="num">{{ count_finished_students }}</span><span>人</span>
                    <p>已完成</p>
                </div>
                <div class="going">
                    <span class="num">{{ count_going_students }}</span><span>人</span>
                    <p>进行中</p>
                </div>
                <div class="notstart">
                    <span class="num">{{ count_not_started_students }}</span><span>人</span>
                    <p>未开始</p>
                </div>
            </div>
            <!-- thead -->
            <div class="thead"><div>序号</div><div>姓名</div><div>进度</div><div>评语</div><div>奖励学豆</div></div>
            <!-- tbody -->
            <ul><li v-for="(item,idx) in stuList" class="tbody">
                <div>{{ idx + 1 }}</div>
                <div>{{ item.real_name }}</div>
                <div class="progress"><span>{{ item.count_finished }}</span>&nbsp;/&nbsp;{{ count_homework }}</div>
                <template v-if="item.count_finished == 0">
                    <div class="disabled">写评语</div>
                    <div class="award">
                        <div class="minus disabled"></div>
                        <input type="text" name="award" v-model="item.integral" disabled />
                        <div class="add disabled"></div>
                        <span class="disabled">发奖励</span>
                    </div>
                    <div class="detail disabled">查看详情</div>
                </template>
                <template v-else>
                    <div>
                        <span @click="writeCommit(item)" class="active">{{item.teacher_comment ? '查看' : '写评语'}}</span>
                    </div>
                    <div class="award" :class="{'integral': item.orgIntegral > 0}">
                        <!-- 未奖励学豆 -->
                        <template v-if="item.orgIntegral <= 0">
                            <div class="minus" @click="minus(idx)"></div>
                            <input type="text" name="award" @keydown="fixKeyDown" @keyup="fixKeyUp(item,'integral')" v-model="item.integral"/>
                            <div class="add" @click="add(idx)"></div>
                            <span class="active" @click="commitReward(item)">发奖励</span>
                        </template>
                        <!-- 已奖励学豆 -->
                        <template v-if="item.orgIntegral > 0">
                            <template v-if="item.addReward">
                                <span class="btns left" @click="addRewardFn(false, item)">取消</span>
                                <div class="minus" @click="minus(idx)"></div>
                                <input type="text" name="award" @keydown="fixKeyDown" @keyup="fixKeyUp(item,'addIntegral')" v-model="item.addIntegral"/>
                                <div class="add" @click="add(idx)"></div>
                                <span class="btns right" @click="commitReward(item)">确定</span>
                            </template>
                            <template v-else>
                                <span class="has-reward">已奖励{{item.orgIntegral}}学豆</span>
                                <span class="add-reward" @click="addRewardFn(true, item)">增加</span>
                            </template>
                        </template>
                    </div>
                    <div class="detail" @click="goStuDetail(item)">查看详情</div>
                </template>
            </li></ul>
        </div>
        <!-- Comment -->
        <Comment></Comment>
        <!-- modal -->
        <div class="modal" v-show="showModalConf" role="dialog">
            <div class="modal-dialog">
                <div class="modal-header">
                    <span class="title">调整截止时间</span>
                    <div class="close" @click="modalFn(false)"></div>
                </div>
                <div class="modal-body">
                    <div class="modal-group">
                        <label>练习名称：</label>
                        <div>{{homework_name}}</div>
                    </div>
                    <div class="modal-group">
                        <label>练习开始时间：</label>
                        <div>{{new Date(+this.start_time).Format('yyyy-MM-dd hh:mm')}}</div>
                    </div>
                    <div class="modal-group">
                        <label>练习截止时间：</label>
                        <div>
                            <el-date-picker class="date" :picker-options="endDateOpt" v-model="endDate" type="date"></el-date-picker>
                            <select v-model="endHour" style="width:63px" class="hour">
                              <option :value="h" v-for="h in hourArr" :selected="endHour==h">{{h}}</option>
                            </select>
                            <select v-model="endMinute" style="width:63px" class="minute">
                              <option :value="m" v-for="m in minuteArr" :selected="endMinute==m">{{m}}</option>
                            </select>
                            <p class="help-block">最晚截止时间为{{new Date(+this.latest_end_time).Format('yyyy-MM-dd')}}</p>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <div class="left" @click="modalFn(false)">取消</div>
                    <div class="right" @click="editPlanTime">确认调整</div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import ajax from '../../api/ajax';
    import Bus from '../../marvel/bus';
    import mCrumb from "../common/crumb.vue";
    import Comment from "../common/Comment.vue";

    import sendSaLog from '../../utils/sa';
    import { hget, vExtend } from '../../utils/hobj';
    import { getQueryParams } from "../../common/js/utils/URLUtils";

    const zxUrl = window.zxbaseURL;
    const zyUrl = process.env.STAGE == 'production' ? '/s17' : '';

    const URLARR = [
        zxUrl + '/',
        zxUrl + '/teacher/vacation/studentsStatus',
        zxUrl + '/teacher/vacation/changePlanTime',
        zxUrl + '/teacher/Vacation/CommentReward',
        zyUrl + '/pcteacher/checkVacationWork.html?current_page=classList',
        zyUrl + '/pcteacher/checkVacationWork.html?current_page=studentDetail'
    ];
    let pageInfo = [{ name: "首页", selectd: true, url: URLARR[0] }];
        pageInfo.push({ name: "检查假期练习", selectd: true, url: URLARR[4] });

    // 兼容性交给polyfill处理
    const hourArr = Array.from(Array(24), (a, i) => i < 10 ? '0'+i : ''+i);
    const minuteArr = Array.from(Array(60), (a, i) => i < 10 ? '0'+i : ''+i);

    export default {
        data() {
            return {
                hourArr,
                pageInfo,
                minuteArr,
                endDate: '',
                endHour: '',
                stuList: [],
                end_time: '',
                loading: true,
                endMinute: '',
                class_name: '',
                start_time: '',
                overTime: true,
                count_homework: '',
                latest_end_time: '',
                showModalConf: false,
                earliest_end_time: '',
                count_all_students: 0,
                count_going_students: 0,
                homework_name: '假期练习',
                count_finished_students: 0,
                count_not_started_students: 0,
                endDateOpt: {
                    disabledDate: (time) => {
                        let now = new Date().getTime();
                        let max = +this.latest_end_time;
                        let min = +this.earliest_end_time;
                        if (min < now) { min = now; }
                        return time.getTime() >=  max || time.getTime() <= min;
                    }
                }
            }
        },
        components: { mCrumb, Comment },
        async created() {
            // 从url获取plan_id
            const hrefUrl = window.location.href;
            let params = getQueryParams(hrefUrl);
            this._params = params;

            // 没有参数不请求接口
            if (!params.plan_id) {
                Bus.$emit('loading_error', '{plan_id}不能为空');
                return;
            }

            await this.initData();

            this.loading = false;
            pageInfo.push({ name: this.class_name, selectd: false });

        },
        methods: {
            addRewardFn(show, item) {
                item.addIntegral = 0;
                item.addReward = show;
            },
            fixKeyUp(item, key) {
                let num = +item[key];
                if (isNaN(num)) {
                    item[key] = 0;
                    return;
                }
                item[key] = num;
            },
            fixKeyDown() {
                if (event.target.value == 0) {
                    event.target.value = '';
                }
                let code = event.keyCode;
                if (code >= 48 && code <= 57) { // [0-9] 顶部符号键盘
                    return true;
                } else if (code >= 96 && code <= 105) { // [0-9] 数字键盘
                    return true;
                } else if (code == 8) { // 退格键
                    return true;
                } else {
                    event.preventDefault();
                    event.stopPropagation();
                    return false;
                }
            },
            minus(i) {
                let org = this.stuList[i].orgIntegral;
                if (org > 0) { // 已奖励学豆
                    let award = this.stuList[i].addIntegral;
                    if (award <= 0) {
                        this.stuList[i].addIntegral = 0;
                        return;
                    }
                    this.stuList[i].addIntegral--;
                } else { // 未奖励学豆
                    let award = this.stuList[i].integral;
                    if (award <= 0) {
                        this.stuList[i].integral = 0;
                        return;
                    }
                    this.stuList[i].integral--;
                }
            },
            add(i) {
                let org = this.stuList[i].orgIntegral;
                if (org > 0) { // 已奖励学豆
                    let award = this.stuList[i].addIntegral;
                    if (award < 0) {
                        this.stuList[i].addIntegral = 0;
                        return;
                    }
                    this.stuList[i].addIntegral++;
                } else { // 未奖励学豆
                    let award = this.stuList[i].integral;
                    if (award < 0) {
                        this.stuList[i].integral = 0;
                        return;
                    }
                    this.stuList[i].integral++;
                }
            },
            selectDate(show) {
                // 修改截止时间打点
                sendSaLog('', '', {
                    event: 'onlineEn_VacationHomework_ClickModule',
                    logData: { homeworkType: '寒假作业', moduleName: '修改截止时间' }
                }, 1);

                let date = new Date(+this.end_time);
                this.endDate = date.Format('yyyy-MM-dd');
                this.endHour = date.Format('hh');
                this.endMinute = date.Format('mm');

                this.modalFn(true);
            },
            modalFn(show) {
                this.$nextTick(() => {
                    this.showModalConf = Boolean(show);
                })
            },
            dateFormat(t) {
                if (!t) { return; }
                let date = new Date(+t);
                let ret = 'Invalid Date';

                if (ret === date.toString()) {
                    return ret;
                }

                let d = date.getDay();
                d = ['日','一','二','三','四','五','六'][d];

                ret = date.Format('yyyy.MM.dd hh:mm');
                return ret + '（周' + d + '）';
            },
            async initData() {
                let url = URLARR[1];
                let plan_id = this._params.plan_id;

                let content = await ajax.post(url, { plan_id });

                if (hget(content, 'data.success') === true) {
                    let data = hget(content, 'data.data');
                    let students = data.hw_result_users || [];
                    let now = new Date().getTime();

                    data.stuList = [];

                    students.forEach((stu) => {
                        let userArr = stu.users || [];
                        if (userArr instanceof Array) {
                        } else { userArr = [userArr]; }

                        userArr.forEach((user) => {
                            // 增加控制
                            user.addReward = false;
                            // 已发学豆数
                            user.integral = user.integral || 0;
                            // 增加学豆数
                            user.addIntegral = 0;
                            // 已发学豆数（记录）
                            user.orgIntegral = user.integral;
                            // 老师评语
                            user.teacher_comment = user.teacher_comment || '';
                            data.stuList.push(user);
                        })
                    })

                    this.overTime = now < +data.earliest_end_time;

                    vExtend(this.$data, data);

                } else {
                    let msg = hget(content, 'data.message');
                    Bus.$emit('loading_error', msg);
                }

            },
            async editPlanTime() {
                let url = URLARR[2];
                let end_time = new Date(this.endDate);
                end_time = end_time.Format('yyyy/MM/dd');
                end_time += (' ' + this.endHour + ':' + this.endMinute);

                end_time = new Date(end_time).getTime();
                if ('Invalid Date' === end_time.toString()) {
                    return;
                }

                let plan_id = this._params.plan_id;

                let content = await ajax.post(url, { plan_id, end_time });

                if (hget(content, 'data.success') === true) {
                    this.end_time = end_time;
                    this.modalFn(false);
                    this.$message.success('截止时间修改成功！');
                } else {
                    let msg = hget(content, 'data.message');
                    this.$message.error(msg);
                }
            },
            writeCommit(item) {
                if (!item) { return; }

                if (!item.teacher_comment) {
                    // 写评语打点
                    sendSaLog('onlineEn_VacationHomework_ClickModule', {
                        homeworkType: '寒假作业', moduleName: '写评语'
                    }, 1);
                }

                // TODO 写评语 查看评语
                Bus.Comment.show({
                    to: item.real_name,
                    comment: item.teacher_comment
                });
                Bus.$on('write_comment', (txt) => {
                    this.commitReward(item, txt);
                })
            },
            commitReward(item, txt) {
                let data = 0;
                let url = URLARR[3];
                let comment = txt || ' ';
                let student_ids = '['+item.user_id+']';
                let plan_id = this._params.plan_id;
                data = item.orgIntegral ? item.addIntegral : item.integral;

                if ((data == 0) && !comment.trim()) { return; }

                if (data != 0) {
                    // 发奖励打点
                    sendSaLog('onlineEn_VacationHomework_ClickModule', {
                        homeworkType: '寒假作业', moduleName: '发奖励'
                    }, 1);
                }

                ajax.post(url, {
                    data,
                    plan_id,
                    comment,
                    student_ids
                }).then((content) => {
                    if (hget(content, 'data.success') === true) {
                        this.initData();
                        this.$message.success(txt ? '评语已发出！' : '学豆已发出！');
                        Bus.Comment.hide();
                    } else {
                        let msg = hget(content, 'data.message');
                        this.$message.error(msg);
                    }
                });
            },
            goStuDetail(item) {
                let url = URLARR[5];
                url += ('&plan_id=' + this._params.plan_id);
                url += ('&class_name=' + this.class_name);
                url += ('&student_id=' + item.user_id);

                // 查看个人详情打点
                sendSaLog('onlineEn_VacationHomework_ClickModule', {
                    homeworkType: '寒假作业', moduleName: '查看个人详情'
                }, 1);

                // 去布置
                window.location.href = url;
            }
        }
    }
</script>
<style lang="scss">
    .stu-group {
        .content {
            position: relative;
            padding: 20px;
            min-height: calc(100vh - 325px);
            .end-time {
                font-family: 'MicrosoftYaHei';
                font-size: 14px;
                color: #555555;
                line-height: 20px;
                span {
                    position: relative;
                    height: 20px;
                    font-family: 'PingFangSC-Regular';
                    font-size: 14px;
                }
                .edit {
                    color: #159CFC;
                    cursor: pointer;
                    display: inline-block;
                    margin-left: 36px;
                    width: 28px;
                    &:before {
                        position: absolute;
                        left: -26px;
                        content: '';
                        height: 16px;
                        width: 16px;
                        background: url('../../assets/img/vacation/edit.png') no-repeat;
                        background-size: cover;
                    }
                }
                .end {
                    font-size: 12px;
                    color: #C8C8C8;
                    padding: 0 4px;
                    border: 1px solid #ddd;
                }
            }
            .stu-box {
                position: relative;
                margin: 20px 0;
                display: flex;
                justify-content: space-between;
                padding: 0 220px;
                div {
                    position: relative;
                    width: 160px;
                    height: 140px;
                    // border: 1px solid #DBE6EE;
                    border-radius: 5px;
                    font-family: 'PingFangSC-Medium';
                    font-size: 16px;
                    color: #555555;
                    text-align: center;
                    padding: 50px;
                    &.going { .num { color: #159CFC; } }
                    &.notstart { .num { color: #333333; } }
                    .num {
                        font-family: 'DIN-Medium';
                        font-size: 48px;
                        color: #30BD9B;
                    }
                    p {
                        margin-top: 18px;
                    }
                }
            }
            .thead {
                position: relative;
                width: 100%;
                height: 60px;
                line-height: 60px;
                padding: 0 20px;
                border-bottom: 1px solid #DAE6EF;
                div {
                    position: relative;
                    height: 60px;
                    width: 150px;
                    float: left;
                    text-align: left;
                    font-weight: 600;
                    font-family: 'PingFangSC-Medium';
                    font-size: 14px;
                    color: #333333;
                }
            }
            ul {
                position: relative;
                // min-height: 356px;
                overflow: auto;
                li {
                    position: relative;
                    width: 100%;
                    height: 60px;
                    line-height: 60px;
                    padding: 0 20px;
                    text-align: left;
                    font-family: 'MicrosoftYaHei';
                    font-size: 12px;
                    color: #555555;
                    &:nth-child(even) {
                        background: #F6F8FA;
                    }
                    div {
                        float: left;
                        width: 150px;
                        height: 100%;
                    }
                    .progress {
                        font-family: 'MicrosoftYaHei';
                        font-size: 14px;
                        color: #000000;
                        span {
                            color: #555555;
                        }
                    }
                    .award {
                        position: relative;
                        * {
                            position: absolute;
                            top: 0; bottom: 0;
                            margin: auto;
                            cursor: pointer;
                        }
                        input {
                            left: 25px;
                            height: 32px;
                            width: 48px;
                            border: 1px solid #CBD8E1;
                            font-family: 'PingFangSC-Regular';
                            font-size: 14px;
                            color: #555555;
                            text-align: center;
                            &[disabled] {
                                background: #FFF;
                            }
                        }
                        .minus {
                            left: 0;
                            display: inline-block;
                            height: 20px;
                            width: 20px;
                            background: url('../../assets/img/vacation/minus.png') no-repeat;
                            background-size: cover;
                            &:hover {
                                background: url('../../assets/img/vacation/minus_hover.png') no-repeat;
                                background-size: cover;
                            }
                            &.disabled {
                                background: url('../../assets/img/vacation/minus_disabled.png') no-repeat;
                                background-size: cover;
                            }
                        }
                        .add {
                            left: 78px;
                            display: inline-block;
                            height: 20px;
                            width: 20px;
                            background: url('../../assets/img/vacation/plus.png') no-repeat;
                            background-size: cover;
                            &:hover {
                                background: url('../../assets/img/vacation/plus_hover.png') no-repeat;
                                background-size: cover;
                            }
                            &.disabled {
                                background: url('../../assets/img/vacation/plus_disabled.png') no-repeat;
                                background-size: cover;
                            }
                        }
                        span {
                            left: 105px;
                        }
                        .has-reward {
                            left: 0;
                        }
                        .add-reward {
                            color: #35a4fa;
                            cursor: pointer;
                        }
                        .btns {
                            display: inline-block;
                            color: #fff;
                            width: 32px;
                            height: 27px;
                            line-height: 27px;
                            text-align: center;
                            &.left { left: 0; background: #1abc9c; }
                            &.right { right: 0; background: #189cfb; }
                        }
                        &.integral {
                            .minus { left: 35px; }
                            input { left: 57px; width: 30px; }
                            .add { left: 90px; }
                        }
                    }
                    .active {
                        color: #159CFC;
                        cursor: pointer;
                    }
                    .disabled {
                        color: #C8C8C8;
                    }
                    .detail {
                        position: absolute;
                        top: 0; bottom: 0;
                        margin: auto 0;
                        height: 30px;
                        width: 80px;
                        line-height: 30px;
                        text-align: center;
                        cursor: pointer;
                        border-radius: 2px;
                        font-family: 'PingFangSC-Regular';
                        font-size: 14px;
                        right: 20px;
                        // background: #FFF;
                        // border: 1px solid #159CFC;
                        color: #159CFC;
                        &.disabled {
                            border-color: #AADCFF;
                            color: #AADCFF;
                        }
                    }
                }
            }
        }
        .modal {
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
                height: 300px;
                width: 500px;
                background: #fff;
                border-radius: 5px;
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
                        position: relative;
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
                        &:after {
                            position: absolute;
                            left: 0; top: 0;
                            content: '';
                            height: 16px;
                            width: 16px;
                            background: url('../../assets/img/vacation/close.png') no-repeat;
                            background-size: cover;
                            margin: 15px;
                            filter: brightness(0);
                            -webkit-filter: brightness(0);
                            -ms-filter: brightness(0);
                            -moz-filter: brightness(0);
                        }
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
                        height: 20px;
                        line-height: 20px;
                        label {
                            padding-right: 10px;
                            float: left;
                            text-align: right;
                            width: 30%;
                        }
                        div {
                            float: left;
                            display: inline-block;
                            text-align: left;
                            width: 70%;
                            .date {
                                &.el-input--small{
                                    width: 94px;
                                    height: 30px;
                                    padding: 0;
                                }
                                &.el-input--small input.el-input__inner{
                                    border-radius: 2px;
                                    padding-right: 0;
                                    height: 30px;
                                    line-height: 30px;
                                }
                                .el-input__prefix{ display: none; }
                                .el-input__suffix{ display: none; }
                                .el-input__inner{ padding-left: 6px; }
                            }
                            select {
                                margin-left: 5px;
                                float: left;
                                width: 63px;
                                height: 30px;
                                border: 1px solid #dcdfe6;
                                border-radius: 2px;
                                background: #fff;
                            }
                            .help-block {
                                font-family: 'PingFangSC-Regular';
                                font-size: 12px;
                                color: #7F7E7E;
                                float: left;
                                margin-top: 4px;
                            }
                        }
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
    }
</style>

<template>
    <!-- class list -->
    <div class="class-list">
        <!-- crumb -->
        <m-crumb :pageInfo="pageInfo"></m-crumb>
        <!-- content -->
        <ul class="content">
            <li v-for="item in classList" v-if="classList">
                <p class="name">{{ item.class_name }}</p>
                <p>时间：{{ dateFormat(item.start_time) }}&nbsp;-&nbsp;{{ dateFormat(item.end_time) }}</p>
                <p v-if="item.process_type=='going'">开始人数：{{ item.count_going_students }}/{{ item.count_all_students }}</p>
                <p v-else>完成人数：{{ item.count_finished_students }}/{{ item.count_all_students }}</p>
                <div class="del" @click="showConfirmModal(true, item)">删除</div>
                <div class="detail" @click="goStuGroup(item)">查看详情</div>
            </li>
            <!-- empty -->
            <li class="empty" v-if="classList && !classList.length">
                <img src="../../assets/img/vacation/empty.png" width="160" height="160">
                <p>还未发布假期练习</p>
                <div class="assign" @click="goAssign">去发布</div>
            </li>
            <!-- loading -->
            <li v-if="!classList" class="load"><img class="loading" src="../../assets/img/loading.gif"></li>
        </ul>
        <!-- modal -->
        <div class="del-modal" v-show="showConfirm" role="dialog">
            <div class="modal-dialog">
                <div class="modal-header">
                    <span class="title">删除班级练习</span>
                    <div class="close" @click="showConfirmModal(false)"></div>
                </div>
                <div class="modal-body">
                    <template v-if="modal.overTime">
                        <p>确定删除“{{modal.className}}”的练习吗？</p>
                        <span>删除后，学生端任务和已完成记录将被清空</span>
                    </template>
                    <template v-else>
                        <p class="over-time">很抱歉，假期将近过半，不能删除了</p>
                    </template>
                </div>
                <div class="modal-footer">
                    <template v-if="modal.overTime">
                        <div class="left" @click="showConfirmModal(false)">取消</div>
                        <div class="right" @click="del(modal.plan_id)">确认</div>
                    </template>
                    <template v-else>
                        <div class="center" @click="showConfirmModal(false)">确认</div>
                    </template>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import ajax from '../../api/ajax';
    import Bus from '../../marvel/bus';
    import mCrumb from "../common/crumb.vue";

    import sendSaLog from '../../utils/sa';
    import { hget } from '../../utils/hobj';

    const zxUrl = window.zxbaseURL;
    const zyUrl = process.env.STAGE == 'production' ? '/s17' : '';

    const URLARR = [
        zxUrl + '/',
        zxUrl + '/teacher/vacation/deletePlan',
        zxUrl + '/teacher/vacation/classStatus',
        zyUrl + '/pcteacher/assignVacationWork.html',
        zyUrl + '/pcteacher/checkVacationWork.html?current_page=studentGroup'
    ];
    let pageInfo = [{ name: "首页", selectd: true, url: URLARR[0] }];
        pageInfo.push({ name: "检查假期练习", selectd: false });

    export default {
        data() {
            return {
                pageInfo,
                modal: {
                    plan_id: '',
                    className: '',
                    overTime: false
                },
                classList: null,
                showConfirm: false
            }
        },
        components: { mCrumb },
        async created() {

            // 加载打点
            sendSaLog('onlineEn_VacationHomework_Load', {
                homeworkType: '寒假作业', moduleName: '检查'
            }, 1);

            await this.initData();

        },
        methods: {
            dateFormat(t) {
                if (!t) { return; }
                let date = new Date(+t);
                if ('Invalid Date' === date.toString()) {
                    return 'Invalid Date'
                }
                return date.Format('yyyy.MM.dd');
            },
            async initData() {
                let url = URLARR[2];

                let content = await ajax.get(url);

                if (hget(content, 'data.success') === true) {
                    let data = hget(content, 'data.data', []);

                    this.classList = data;

                } else {
                    let msg = hget(content, 'data.message');
                    Bus.$emit('loading_error', msg);
                }

            },
            goStuGroup(item) {
                if (!item) { return; }
                let url = URLARR[4];
                url += ('&plan_id=' + item.plan_id);

                // 去班级详情
                sendSaLog('onlineEn_VacationHomework_CheckClassDetail', {
                    homeworkType: '寒假作业'
                }, 1);

                // 去班级详情
                window.location.href = url;
            },
            async del(plan_id) {
                if (!plan_id) { return; }
                let url = URLARR[1];

                // 确认删除打点
                sendSaLog('onlineEn_VacationHomework_ClickModule', {
                    homeworkType: '寒假作业', moduleName: '确认删除'
                }, 1);

                let content = await ajax.post(url, { plan_id });

                if (hget(content, 'data.success') === true) {
                    this.showConfirmModal(false).initData();
                    this.$message.success('删除成功！');
                } else {
                    let msg = hget(content, 'data.message');
                    this.$message.error(msg || '删除失败！');
                }
            },
            showConfirmModal(show, item) {
                if (!item) {
                    this.showConfirm = Boolean(show);
                    return this;
                }

                // 删除打点
                sendSaLog('onlineEn_VacationHomework_ClickModule', {
                    homeworkType: '寒假作业', moduleName: '删除'
                }, 1);

                let plan_id = item.plan_id;
                let className = item.class_name;
                let last = item.latest_assign_time;
                last = new Date(last.replace(/\-/g, '\/')).getTime();
                let overTime = last > new Date().getTime();
                this.modal = { plan_id, className, overTime }

                // 数据渲染完成再显示
                this.$nextTick(() => {
                    this.showConfirm = Boolean(show);
                })
                return this;
            },
            goAssign() {
                let url = URLARR[3];

                // 去布置
                window.location.href = url;
            }
        }
    }
</script>
<style lang="scss">
    .class-list {
        .content {
            position: relative;
            padding: 20px;
            // min-height: 658px;
            min-height: calc(100vh - 325px);
            .load {
                position: absolute !important;
                height: 100% !important;
                width: 100% !important;
                border: 0 !important;
                margin-bottom: 0 !important;
                padding: 0 !important;
            }
            li:not(.empty) {
                position: relative;
                width: 100%;
                height: 110px;
                border: 1px solid #DBE6EE;
                margin-bottom: 20px;
                padding: 20px 200px 20px 20px;
                &:hover {
                    .del { display: block; }
                }
                &:last-child {
                    margin-bottom: 0;
                }
                p {
                    font-family: 'PingFangSC-Regular';
                    font-size: 12px;
                    color: #7F7E7E;
                    margin: 2px 0;
                    line-height: 17px;
                    &.name {
                        font-family: 'MicrosoftYaHei';
                        font-size: 18px;
                        color: #333333;
                        margin-bottom: 6px;
                    }
                }
                .del, .detail {
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
                }
                .detail {
                    right: 20px;
                    background: #159CFC;
                    border: 1px solid #159CFC;
                    color: #FFFFFF;
                    &:hover {
                        background: #5CBBFF;
                    }
                }
                .del {
                    display: none;
                    right: 116px;
                    border: 1px solid #F97151;
                    color: #F97151;
                    &:hover {
                        background: #FFEAEA;

                    }
                }
            }
            .empty {
                position: absolute;
                width: 160px;
                height: 250px;
                top: 0; bottom: 0;
                left: 0; right: 0;
                margin: auto;
                text-align: center;
                p {
                    font-family: 'PingFangSC-Regular';
                    font-size: 14px;
                    color: #9B9B9B;
                    margin-top: 8px;
                }
                .assign {
                    position: relative;
                    background: #FFFFFF;
                    border: 1px solid #159CFC;
                    font-family: 'PingFangSC-Regular';
                    font-size: 14px;
                    color: #159CFC;
                    text-align: center;
                    width: 80px;
                    height: 30px;
                    line-height: 30px;
                    margin: 14px auto 0;
                    cursor: pointer;
                }
            }
        }
        .del-modal {
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
                    text-align: center;
                    p {
                        margin-top: 56px;
                        font-family: 'MicrosoftYaHei';
                        font-size: 18px;
                        color: #555555;
                    }
                    span {
                        display: block;
                        margin-top: 14px;
                        font-family: 'PingFangSC-Regular';
                        font-size: 14px;
                        color: #7F7E7E;
                    }
                }
                .modal-footer {
                    text-align: center;
                    div {
                        cursor: pointer;
                        position: absolute;
                        bottom: 40px;
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

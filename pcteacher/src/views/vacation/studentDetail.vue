<template>
    <!-- student detail -->
    <div class="stu-detail">
        <!-- crumb -->
        <m-crumb :pageInfo="pageInfo"></m-crumb>
        <!-- loading -->
        <div class="content" v-if="loading" style="position: static;">
            <img class="loading" src="../../assets/img/loading.gif">
        </div>
        <!-- content -->
        <div class="content" v-else>
            <!-- top -->
            <div class="detail-top">
                完成进度：<span>{{ count_finished }}</span><span class="all">&nbsp;/&nbsp;{{ count_all }}</span>
            </div>
            <!-- list -->
            <div class="theader">
                <div class="day">任务</div>
                <div class="detail"><div v-for="t in typeArr">{{t.txt}}</div></div>
                <div class="score">平均分</div>
                <div class="time">完成用时</div>
            </div>
            <div class="detail-list" v-for="(week,idx) in week_data">
                <div v-if="week.type==='review'" class="title">第{{week.no}}周&nbsp;·&nbsp;复习</div>
                <div v-if="week.type==='preview'" class="title">第{{week.no}}周&nbsp;·&nbsp;预习</div>
                <div class="li" v-for="(day,i) in week.days">
                    <div class="detail-box">
                        <template v-if="day.is_finished">
                            <div class="day">Day&nbsp;{{day.no}}</div>
                            <div class="detail">
                                <div v-for="t in typeArr" :class="{'disabled': !day.practices[t.key]}">
                                    <span @click="goDayDetail(day, t.key)">{{day.practices[t.key] || '-'}}</span>
                                </div>
                            </div>
                            <div class="score">{{day.score}}分</div>
                            <div class="time">{{Math.ceil(day.time/60)}}分钟</div>
                        </template>
                        <template v-else>
                            <div class="day">Day&nbsp;{{day.no}}</div>
                            <div class="detail"><div v-for="t in typeArr">-</div></div>
                            <div class="score">-</div>
                            <div class="time">-</div>
                        </template>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import ajax from '../../api/ajax';
    import Bus from '../../marvel/bus';
    import mCrumb from "../common/crumb.vue";

    import { hget, vExtend } from '../../utils/hobj';
    import { reportQType } from '../../common/js/questionUtils';
    import { getQueryParams } from '../../common/js/utils/URLUtils';

    const zxUrl = window.zxbaseURL;
    const zyUrl = process.env.STAGE == 'production' ? '/s17' : '';

    const URLARR = [
        zxUrl + '/',
        zxUrl + '/teacher/vacation/StudentStatus',
        zyUrl + '/pcteacher/checkVacationWork.html?current_page=classList',
        zyUrl + '/pcteacher/checkVacationWork.html?current_page=studentGroup',
        zxUrl + '/teacher/homework/studentOralResultPaper?type=vacation',
        zxUrl + '/teacher/homework/studentResultPaper?type=vacation'
    ];
    let pageInfo = [{ name: "首页", selectd: true, url: URLARR[0] }];
        pageInfo.push({ name: "检查假期练习", selectd: true, url: URLARR[2] });

    export default {
        data() {
            return {
                pageInfo,
                typeArr: [],
                count_all: 0,
                real_name: '',
                week_data: [],
                loading: true,
                class_name: '',
                count_finished: 0
            }
        },
        components: { mCrumb },
        async created() {
            // 从url获取plan_id
            const hrefUrl = window.location.href;
            let params = getQueryParams(hrefUrl);
            let url = URLARR[3] + '&plan_id=';
            this._params = params;

            await this.initData();

            this.loading = false;
            url += params.plan_id;
            pageInfo.push({ name: params.class_name, selectd: true, url });
            pageInfo.push({ name: this.real_name + '练习详情', selectd: false });

            // 对 position: sticky 做下兼容
            window.addEventListener('scroll', () => {
                let $theader = document.querySelector('.theader');
                let $content = document.querySelector('.content');
                let $stuDetail = document.querySelector('.stu-detail');
                let scrollTop = document.documentElement.scrollTop;
                let theader = $theader.offsetTop;   // theader元素距content高度
                let content = $content.offsetTop;   // content元素距container高度
                let header = 60;                    // 顶部header高度
                let offsetTop = theader + content + 60;
                if (scrollTop > offsetTop) {
                    $theader.style.top = 0;
                    $theader.style.position = 'fixed';
                    $theader.style.marginTop = 0;
                } else {
                    $theader.style.top = '';
                    $theader.style.position = '';
                    $theader.style.marginTop = '10px';
                }
            })

        },
        methods: {
            async initData() {
                let url = URLARR[1];
                let plan_id = this._params.plan_id;
                let student_id = this._params.student_id;

                let content = await ajax.get(url, { params: { plan_id, student_id } });

                if (hget(content, 'data.success') === true) {
                    let data = hget(content, 'data.data');
                    // 用来承接所有题型
                    data.typeArr = [];

                    // 循环遍历 找到所有类型
                    data.week_data.forEach((week) => {
                        let days = week.days || [];
                        days.forEach((day) => {
                            day.practices = day.practices || {};
                            for (let p in day.practices) {
                                // toString 一下
                                if (day.practices[p] !== undefined) {
                                    day.practices[p] = (day.practices[p] + '分');
                                }
                                // 先这样写吧
                                if (!data.typeArr.map((type)=>type.key).includes(p)) {
                                    data.typeArr.push({ key: p, txt: reportQType(p) });
                                }
                            }
                        })
                    })

                    vExtend(this.$data, data);

                } else {
                    let msg = hget(content, 'data.message');
                    Bus.$emit('loading_error', msg);
                }

            },
            goDayDetail(day, type) {
                if (!day.practices[type]) {
                    return;
                }
                let url = '';
                if (type === 'oral') {
                    url = URLARR[4]; // oral
                } else {
                    url = URLARR[5]; // ^oral
                    url += ('&practice_type_list=["' + type+ '"]');
                }

                url += ('&homework_id=' + day.homework_id)
                url += ('&plan_id=' + this._params.plan_id)
                url += ('&student_id=' + this._params.student_id)
                url += ('&class_name=' + this._params.class_name)

                // 个人作业详情
                window.location.href = url;
            }
        }
    }
</script>
<style lang="scss">
    .stu-detail {
        .content {
            position: relative;
            .detail-top {
                position: relative;
                width: 100%;
                height: 56px;
                line-height: 50px;
                background: #FFF;
                border: 1px solid #DBE6EE;
                font-family: 'MicrosoftYaHei';
                font-size: 14px;
                color: #555555;
                padding: 0 20px;
                .all {
                    font-size: 14px;
                    color: #000000;
                }
                span {
                    font-family: 'MicrosoftYaHei';
                    font-size: 20px;
                    color: #252525;
                }
            }
            .theader {
                position: sticky;
                position: -webkit-sticky;
                position: -moz-sticky;
                position: -ms-sticky;
                top: 0;
                z-index: 10;
                height: 48px;
                line-height: 48px;
                background: #FFF;
                font-family: 'PingFangSC-Medium';
                font-size: 14px;
                color: #555555;
                margin-top: 10px;
                text-align: center;
                border-left: 1px solid #DBE6EE;
                border-right: 1px solid #DBE6EE;
                border-top: 1px solid #DBE6EE;
                .day {
                    width: 120px;
                    float: left;
                    text-indent: 20px;
                    text-align: left;
                }
                .score {
                    display: inline-block;
                    text-align: center;
                    width: 100px;
                    float: left;
                }
                .time {
                    display: inline-block;
                    text-align: center;
                    width: 100px;
                    float: left;
                }
                .detail {
                    position: relative;
                    height: 100%;
                    width: 678px;
                    float: left;
                    display: flex;
                    display: -webkit-flex;
                    justify-content: space-around;
                    div {
                        width: 70px;
                        height: 100%;
                        text-align: center;
                    }
                }
            }
            .detail-list {
                position: relative;
                width: 100%;
                border-left: 1px solid #DBE6EE;
                border-right: 1px solid #DBE6EE;
                &:last-child {
                    border-bottom: 1px solid #DBE6EE;
                    margin-bottom: 15px;
                }
                .title {
                    height: 32px;
                    line-height: 32px;
                    background: #F5F5F8;;
                    font-family: 'MicrosoftYaHei';
                    font-size: 14px;
                    color: #555555;
                    text-indent: 20px;
                }
                .li {
                    position: relative;
                    background: #FFF;
                    &:last-child {
                        .detail-box {
                            border-bottom: 0;
                        }
                    }
                    .detail-box {
                        margin-left: 20px;
                        border-bottom: 1px solid #DBE6EE;
                        background: #FFF;
                        height: 60px;
                        line-height: 60px;
                        .day {
                            position: relative;
                            font-family: 'ArialMT';
                            font-size: 16px;
                            color: #555555;
                            width: 100px;
                            float: left;
                            text-align: left;
                        }
                        .score {
                            position: relative;
                            display: inline-block;
                            font-family: 'PingFangSC-Regular';
                            font-size: 12px;
                            color: #7F7E7E;
                            text-align: center;
                            width: 100px;
                            float: left;
                        }
                        .time {
                            position: relative;
                            display: inline-block;
                            font-family: 'PingFangSC-Regular';
                            font-size: 12px;
                            color: #7F7E7E;
                            text-align: center;
                            width: 100px;
                            float: left;
                        }
                        .detail {
                            position: relative;
                            height: 100%;
                            width: 678px;
                            float: left;
                            display: flex;
                            display: -webkit-flex;
                            justify-content: space-around;
                            div {
                                width: 70px;
                                height: 100%;
                                text-align: center;
                            }
                            span {
                                font-family: 'PingFangSC-Regular';
                                font-size: 14px;
                                color: #159CFC;
                                cursor: pointer;
                            }
                            .disabled {
                                span {
                                    font-family: 'PingFangSC-Regular';
                                    font-size: 14px;
                                    color: #555555;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
</style>


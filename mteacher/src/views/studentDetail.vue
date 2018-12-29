<template>
    <!-- student detail -->
    <div class="container __stu-detail__">
        <!-- success -->
        <template v-if="success === 'ok'">
            <!-- top -->
            <div class="detail-top">
                <div class="count"><em>{{count_finished}}</em>&nbsp;/&nbsp;{{count_all}}</div>
                <p>完成进度</p>
            </div>
            <!-- list -->
            <ul class="detail-list" v-for="(week,idx) in week_data" :class="{'first':idx==0}">
                <li v-if="week.type==='review'" class="title">第{{week.no}}周&nbsp;·&nbsp;复习</li>
                <li v-if="week.type==='preview'" class="title">第{{week.no}}周&nbsp;·&nbsp;预习</li>
                <li v-for="(day,i) in week.days" @click="goPractice(day, week)" :class="{'greey':!day.is_finished}">
                    <span class="day">Day{{day.no}}</span>
                    <span class="time" v-if="day.is_finished">用时{{Math.ceil(day.time/60)}}分钟&nbsp;·&nbsp;{{day.score}}分</span>
                    <span class="time" v-if="!day.is_finished">未完成</span>
                </li>
            </ul>
            <!-- ios下margin-bottom失效 -->
            <div class="ios-mb"></div>
            <!-- bottom -->
            <div class="detail-bottom">
                <div @click="writeComments">发奖励&nbsp;/&nbsp;写评语</div>
            </div>
        </template>
        <!-- error -->
        <template v-else>
            <msg :card="{ type: 'error' }"></msg>
        </template>
    </div>
</template>
<script>
    import ajax from '../api/ajax';
    // 网络异常
    import msg from '../components/cards/msg.vue';
    // util
    import { hget, vExtend }  from '../utils/hobj';
    import { forwardPage } from '../common/js/external/teacher';
    import { showToast, updateTitle } from '../common/js/external/index';

    const baseUrl = process.env.zxBaseUrl;
    const URLARR = [ baseUrl + 'Mteacher/vacation/StudentStatus' ];

    export default {
        data() {
            return {
                success: '',
                count_all: 0,
                week_data: [],
                count_finished: 0
            }
        },
        components: { msg },
        methods: {
            async initData() {
                let plan_id = this._params.plan_id;
                let student_id = this._params.student_id;
                let content = await ajax.get(URLARR[0], { params: { plan_id, student_id } })

                if (hget(content, 'data.success') == true) {
                    let data = hget(content, 'data.data');
                    vExtend(this.$data, data);
                    this.success = 'ok';
                } else {
                    this.success = 'faild';
                }
            },
            goPractice(day, week) {
                if (!day.is_finished) { return; }

                let source = 'winter_vacation';
                let homework_id = day.homework_id;
                let student_id = this._params.student_id;
                let studentName = this._params.real_name;
                let type = 'junior_check_singleStudent_homework';

                let params = { source, homework_id, student_id, studentName }

                forwardPage({ type, params });
            },
            writeComments() {
                let type = 'setComments';
                let homework_type = 'vacation';
                let source = 'winter_vacation';
                let plan_id = this._params.plan_id;
                let student_id = this._params.student_id;
                let reward_name = this._params.real_name;

                let params = { plan_id, reward_name, student_id, homework_type, source };

                forwardPage({ type, params });
            }
        },
        async created() {
            let params = window.initParams || {};

            this._params = params;

            if (params.real_name) {
                updateTitle(params.real_name+'的练习');
            }

            await this.initData();
        }
    }
</script>
<style lang="scss" scoped>
    .__stu-detail__ {
        position: relative;
        max-width: 750px;
        margin: 0 auto;
        font-size: .28rem;
        touch-action: manipulation; // Fastclick preventDefault
        // overflow-y: auto;
        -webkit-overflow-scrolling: touch;
        height: 100vh;
        .detail-top {
            position: relative;
            width: 100%;
            height: 3rem;
            background: #2997FF;
            .count {
                padding: .31rem 0 .16rem;
                text-align: center;
                font-family: '17-DIN-Regular';
                font-size: .6rem;
                color: #FFFFFF;
                letter-spacing: 0;
                line-height: .80rem;
                em {
                    font-family: '17-DIN-Bold';
                    font-size: .88rem;
                }
            }
            &:before {
                position: absolute;
                content: '';
                left: 0;
                bottom: 0;
                height: 2.2rem;
                width: 2.11rem;
                background: url('../assets/img/vacation/bg1.png') no-repeat;
                background-size: cover;
            }
            &:after {
                position: absolute;
                content: '';
                right: 0;
                top: 0;
                height: 2.52rem;
                width: 1.78rem;
                background: url('../assets/img/vacation/bg2.png') no-repeat;
                background-size: cover;
            }
            p {
                font-family: 'PingFangSC-Regular';
                font-size: .28rem;
                color: #FFFFFF;
                line-height: .42rem;
                text-align: center;
            }
        }
        .detail-list {
            position: relative;
            width: 6.86rem;
            margin: 0 .32rem .24rem;
            background: #fff;
            border-radius: .1rem;
            padding-left: .32rem;
            z-index: 10;
            &.first {
                margin-top: -1rem;
            }
            .title {
                font-family: 'PingFangSC-Regular';
                font-size: .28rem;
                color: #58595E;
                height: .8rem;
                letter-spacing: 0;
                line-height: .42rem;
                padding-top: .19rem;
                text-align: left;
            }
            li {
                position: relative;
                height: 1.1rem;
                line-height: 1.1rem;
                text-align: right;
                &.greey {
                    .day,.time {
                        color: #C8C8C8;
                    }
                    .time {
                        margin-right: .3rem;
                        &:after {
                            display: none;
                        }
                    }
                }
                &:first-child,&:last-child {
                    &:after {
                        display: none;
                    }
                }
                &:after {
                    position: absolute;
                    content: ''; left: 0; bottom: 0;
                    width: 100%; height: 0.02rem;
                    border-bottom: .02rem solid #E6E6E6;
                    -webkit-transform: scaleY(.5);
                    transform: scaleY(.5);
                }
                .day {
                    position: relative;
                    font-size: .32rem;
                    color: #171717;
                    float: left;
                }
                .time {
                    position: relative;
                    display: inline-block;
                    font-size: .24rem;
                    color: #58595E;
                    letter-spacing: 0;
                    margin-right: .72rem;
                    text-align: center;
                    &:after {
                        position: absolute;
                        content: '';
                        display: inline-block;
                        right: -.48rem;
                        height: .24rem;
                        width: .24rem;
                        top: 0; bottom: 0;
                        margin: auto;
                        background: url('../assets/img/arrow_left.png') no-repeat;
                        background-size: cover;
                    }
                }
            }
        }
        .ios-mb {
            position: relative;
            width: 100%;
            height: 1.2rem;
            visibility: hidden;
        }
        .detail-bottom {
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
    }
</style>

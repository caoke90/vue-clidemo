<template>
    <!-- check work -->
    <div class="__check_vacation_work__">
        <!-- header -->
        <m-header></m-header>
        <!-- container -->
        <div class="container">
            <!-- success -->
            <template v-if="'ok' === success">
                <components :is="current_page"></components>
            </template>
            <!-- error -->
            <template v-else>
                <msg :card="{ type: 'error', msg: errorMsg }"></msg>
            </template>
        </div>
        <!-- footer -->
        <m-footer></m-footer>
    </div>

</template>

<script>
    import '../utils/Format';
    import Bus from '../marvel/bus';
    import msg from "../components/cards/msg";
    import mHeader from "./common/mheader.vue";
    import mFooter from "./common/mfooter.vue";

    import classList from "./vacation/classList";
    import studentGroup from "./vacation/studentGroup";
    import studentDetail from "./vacation/studentDetail";

    import { getQueryParams } from "../common/js/utils/URLUtils";

    export default {
        data() {
            return {
                current_page: '',
                success: 'ok',
                errorMsg: ''
            }
        },
        components:{
            mHeader, mFooter, classList, msg,
            studentGroup, studentDetail
        },
        created() {
            const hrefUrl = window.location.href;
            let params = getQueryParams(hrefUrl);
            this.current_page = params.current_page || 'classList';

            // 在这里统一做一个页面加载失败管理
            Bus.$on('loading_error', (msg) => {
                this.success = 'faild';
                this.errorMsg = msg;
            })
        }
    }
</script>

<style lang="scss">
    @import '../assets/css/assign.css';
    // *::-webkit-scrollbar {display:block;}
    // *::-webkit-scrollbar {width:6px;}/* 滚动槽 */
    // *::-webkit-scrollbar-track {-webkit-box-shadow: inset 0 0 6px #F5F5F5;border-radius: 3px;}
    // /* 滚动条滑块 */
    // *::-webkit-scrollbar-thumb {border-radius:3px;background:#E0E0E0; }
    // *::-webkit-scrollbar-thumb:window-inactive {background:#E0E0E0;}
    .__check_vacation_work__ {
        .container {
            position: relative;
            width: 1000px;
            margin: 0 auto;
            padding-top: 15px;
            min-height: calc(100vh - 282px);
            margin-bottom: 20px;
            .msg {
                position: absolute;
                height: calc(100% - 40px);
                width: calc(100% - 40px);
                margin: 5px 20px 20px 20px;
                background: #fff;
                border: 1px solid #DBE6EE;
            }
            .class-list, .stu-group {
                .content {
                    width: 100%;
                    background: #fff;
                    border: 1px solid #DBE6EE;
                }
            }
            .loading {
                width: 144px;
                height: 147px;
                position: absolute;
                top: 50%;
                left: 0;
                right: 0;
                margin: -74px auto 0;
            }
        }
    }
</style>

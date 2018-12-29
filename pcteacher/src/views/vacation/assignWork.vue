<template>
    <div class="assign-work">
        <modal :isshow='assignWorkShow' @close='closeAssignWork'>
            <template slot='title'>
                <div class="title">发布练习</div>
            </template>
            <template slot='content'>
                <div v-show="isLoading" style="height: 258px; background-color: white; width: 550px;position: relative;">
                    <img src="../../assets/img/loading.gif" style="width: 144px;height: 147px;position: absolute;top: 50%;left: 0;right: 0;margin: -74px auto 0;"/>
                </div>
                <div class="assign-content" v-show='!showResult && !isLoading'>
                    <div class="package-info">
                        <div class="row-content">
                            <div class="item-title">教材：</div>
                            <p>{{assignInfo.bookName}}</p>
                        </div>
                        <div class="row-content">
                            <div class="item-title">天数：</div>
                            <p>20天（{{hasPreview?'4周复习+1周预习':'5周复习'}}，每周四天）</p>
                        </div>
                        <div class="row-content">
                            <div class="item-title">预计时长：</div>
                            <p>{{assignInfo.minCount}}分钟/天</p>
                        </div>
                    </div>
                    <div class="class-info">
                        <div class="row-content">
                            <div class="item-title">班级：</div>
                            <ul>
                                <li v-for='item in classList'
                                :key='item.group_id'
                                :class="{'checked':item.checked,'assigned':item.is_assign}"
                                @click='chooseClass(item)'>
                                     <i class="check-box"></i>{{item.clazz_level_name}}
                                </li>
                                <li class="class-err" v-if='classErr'>{{classErr}}</li>
                            </ul>
                        </div>
                    </div>

                    <div class="assign-info">
                        <div class="row-content">
                            <div class="item-title">练习开始时间：</div>
                            <div class="item-content">
                                <el-date-picker
                                    class="vc-datepicker"
                                    v-model="startTime.startDate"
                                    @change='checkStartTime'
                                    :picker-options="pickerOptionsStart"
                                    :editable="false"
                                    :clearable="false"
                                    type="date"
                                    placeholder="选择日期">
                                </el-date-picker>
                                <select class="vc-hour" v-model='startTime.startHour' @change='checkStartTime'>
                                    <option :value="item" v-for='item in hourRange'>{{item}}</option>
                                </select>
                                <select class="vc-min" v-model='startTime.startMin' @change='checkStartTime'>
                                    <option :value="item"  v-for='item in minRange'>{{item}}</option>
                                </select>
                            </div>
                        </div>
                        <div class="row-content">
                            <div class="item-title">练习截止时间：</div>
                           <div class="item-content">
                               <div class="item-content">
                                    <el-date-picker
                                        class="vc-datepicker"
                                        v-model="endTime.endDate"
                                        @change='checkEndTime'
                                        :picker-options="pickerOptionsEnd"
                                        :editable="false"
                                        :clearable="false"
                                        type="date"
                                        placeholder="选择日期">
                                    </el-date-picker>
                                    <select class="vc-hour" v-model='endTime.endHour' @change='checkEndTime'>
                                        <option :value="item" v-for='item in hourRange'>{{item}}</option>
                                    </select>
                                    <select class="vc-min" v-model='endTime.endMin' @change='checkEndTime'>
                                        <option :value="item"  v-for='item in minRange'>{{item}}</option>
                                    </select>
                                </div>
                           </div>
                        </div>
                        <div class="row-content">
                            <div class="item-title">练习名称：</div>
                            <input type="text" v-model='homeworkName' class="homework-name">
                        </div>
                    </div>
                    <div class="operate">
                        <div class="btn-left btn" @click='closeAssignWork'>取消</div>
                        <div class="btn-right btn" @click='submit'>确认</div>
                    </div>
                </div>
                <div class="result-content" v-show='showResult && !isLoading'>
                    <div class="bg-img" :class="{'fail':resultInfo.fail}"></div>
                    <p v-if='resultInfo.success && resultInfo.is_integral' class="result-title">发布成功，获得 <span>{{resultInfo.integral}}</span> 学豆</p>
                    <p v-if='resultInfo.success && !resultInfo.is_integral' class="result-title">发布成功</p>
                    <p v-if='resultInfo.fail' class="result-title">发布练习失败</p>
                    <p class="err-detail" v-if='resultInfo.fail && resultInfo.message'>{{resultInfo.message}}</p>
                    <div class="operate">
                        <div class="btn-left btn" v-if='resultInfo.success' @click='continueAssign'>继续发布</div>
                        <div class="btn-right btn" v-if='resultInfo.success' @click='finishAssign'>完成</div>
                        <div class="fail-btn btn" v-if='resultInfo.fail' @click='reAssign'>重新发布</div>
                    </div>
                </div>
            </template>
        </modal>
    </div>
</template>

<script>
    import '../../utils/Format';
    import ajax from '@/api/ajax';
    import sendSaLog from '@/utils/sa';
    export default{
        data(){
            return {
                isLoading:false,
                startTime:{
                    startDate:'',
                    startHour:'00',
                    startMin:'00'
                },
                pickerOptionsStart:{},
                endTime:{
                    endDate:'',
                    endHour:'00',
                    endMin:'00'
                },
                pickerOptionsEnd:{},
                hourRange:[],
                minRange:[],
                homeworkName:'假期练习',
                classList:[],
                classErr:'',
                startTimeConfig:{},
                endTimeConfig:{},
                //发布结果
                showResult:false,
                resultInfo:{},
            }
        },
        methods:{
            checkStartTime(){
                let _this=this;
                let startTimestap=this.filterSubmitTime('start');
                let now=new Date().getTime();
                if(startTimestap<this.startTimeConfig.earliest && now<1546819200000){
                    this.$message({
                        message: '开始时间不能早于'+_this.filterCheckTime(_this.startTimeConfig.earliest) + new Date(_this.startTimeConfig.earliest).Format('hh:mm'),
                        type: 'warning'
                    });
                    return false;
                }else if(startTimestap<this.startTimeConfig.earliest && now>=1546819200000){
                    this.$message({
                        message: '开始时间不能早于当前时间',
                        type: 'warning'
                    });
                    return false;
                }
                if(startTimestap>this.startTimeConfig.latest){
                    this.$message({
                        message: '开始时间不能晚于'+_this.filterCheckTime(_this.startTimeConfig.latest),
                        type: 'warning'
                    });
                    return false;
                }
                return true;
            },
            checkEndTime(){
                let _this=this;
                let endTimestap=this.filterSubmitTime('end');
                if(endTimestap<this.endTimeConfig.earliest){
                    this.$message({
                        message: '结束时间不能早于'+_this.filterCheckTime(_this.endTimeConfig.earliest),
                        type: 'warning'
                    });
                    return false;
                }
                if(endTimestap>this.endTimeConfig.latest){
                    this.$message({
                        message: '结束时间不能晚于'+_this.filterCheckTime(_this.endTimeConfig.latest),
                        type: 'warning'
                    });
                    return false;
                }
                return true;
            },
            submit:async function(){
                let _this=this;
                //打点
                sendSaLog('onlineEn_Assignment_ReleaseHomework', {proSource:"寒假作业"},true);
                //判断已经全部布置
                let notAssginIndex=this.classList.findIndex(item=>!item.is_assign);
                if(notAssginIndex<0){
                    this.$message({
                        message: '所有班级都已经发布',
                        type: 'warning'
                    });
                    return false;
                }
                //处理未选择班级
                let classIds=this.getAssignClass();
                if(classIds.length==0){
                    this.classErr='请选择班级'
                    return false;
                }
                //处理开始、截止时间
                let checkStartTime=this.checkStartTime();
                if(!checkStartTime){
                    return false;
                }
                let checkEndTime=this.checkEndTime();
                if(!checkEndTime){
                    return false;
                }
                if(!this.homeworkName){
                    this.$message({
                        message: '请输入练习名称',
                        type: 'warning'
                    });
                    return false;
                }
                //提交布置
                classIds=JSON.stringify(classIds);
                let params={
                    name:_this.homeworkName,
                    start_time:_this.filterSubmitTime('start'),
                    end_time:_this.filterSubmitTime('end'),
                    clazz_ids:classIds,
                    book_id:_this.assignInfo.bookId,
                    types:_this.assignInfo.packages
                }
                this.isLoading=true;
                let content = await ajax.post(process.env.zxbaseURL+'/teacher/Vacation/save',params);
                if(content.data.success == true){
                    this.$emit('submit');
                    let result=content.data;
                    this.resultInfo={
                        success:true,
                        is_integral:result.data.is_integral,
                        integral:result.data.integral
                    }
                }else{
                    let result=content.data;
                    this.resultInfo={
                        errorCode:result.error_code,
                        message:result.message,
                        fail:true
                    }
                }
                this.isLoading=false;
                this.showResult=true;
            },
            // 获取布置作业的班级
            getAssignClass(){
                let classIds=[];
                this.classList.forEach(item=>{
                    if(item.is_assign==false && item.checked){
                        classIds.push(item.group_id);
                    }
                })
                return classIds;
            },
            //关闭布置作业
            closeAssignWork(){
                this.$emit('closeAssignWork')
            },

            //filter X月X日
            filterCheckTime(timestap){
                let date=new Date(timestap);
                return date.Format('M月d日');

            },
            //展示时间初始化
            filterTime(type,time){
                if(type=='start'){
                    let date=new Date(time)
                    this.startTime.startDate=this.filterDate(time);
                    this.startTime.startHour=date.Format('hh');
                    this.startTime.startMin=date.Format('mm');
                }
                if(type=='end'){
                    let date=new Date(time)
                    this.endTime.endDate=this.filterDate(time);
                    this.endTime.endHour=date.Format('hh');
                    this.endTime.endMin=date.Format('mm');
                }
            },
            //将时间戳转为精确到日期的Date
            filterDate(timestap){
                let time=new Date(timestap);
                let dateStr=time.Format('yyyy-MM-dd')+' '+'00:00:00';
                dateStr=dateStr.replace(/\-/g, "/");
                return new Date(dateStr);

            },
            //处理成提交的时间戳
            filterSubmitTime(type){
                if(type=='start'){
                    let startTimestap=this.startTime.startDate.getTime()+this.startTime.startHour*3600000+this.startTime.startMin*60000
                    return startTimestap;
                }
                if(type=='end'){
                    let endTimestap=this.endTime.endDate.getTime()+this.endTime.endHour*3600000+this.endTime.endMin*60000
                    return endTimestap;
                }
            },
            loadPrepareInfo:async function(){
                let _this=this;
                this.isLoading=true;
                let content = await ajax.post(process.env.zxbaseURL+'/teacher/Vacation/prepare');
                if(content.data.success== true){
                    //处理班级信息
                    let classList=content.data.data.group_list;
                    classList.forEach(item => {
                        if(item.is_assign){
                            item.checked=true;
                        }else{
                            item.checked=false;
                        }
                    });
                    this.classList=classList;
                    //处理开始时间
                    this.startTimeConfig=content.data.data.start_time_config;
                    this.filterTime('start',this.startTimeConfig.default);
                    this.pickerOptionsStart={
                        disabledDate(time) {
                            return time.getTime() <_this.filterDate(_this.startTimeConfig.earliest)  || time.getTime() > _this.startTimeConfig.latest;
                        }
                    }
                    //处理截止时间
                    this.endTimeConfig=content.data.data.end_time_config;
                    this.filterTime('end',this.endTimeConfig.default);
                    this.pickerOptionsEnd={
                        disabledDate(time) {
                            return time.getTime() < _this.filterDate(_this.endTimeConfig.earliest) || time.getTime() > _this.endTimeConfig.latest;
                        }
                    }

                }
                this.isLoading=false;
            },
            chooseClass(item){
                if(!item.is_assign){
                    item.checked=!item.checked;
                }
                if(this.classErr){
                    let classIds=this.getAssignClass();
                    if(classIds.length>0){
                        this.classErr='';
                    }
                }

            },
            continueAssign(){
                // this.showResult=false;
                // this.loadPrepareInfo();
                this.closeAssignWork();
            },
            finishAssign(){
                window.location.href= (process.env.STAGE == 'production' ? '/s17' : '') + '/pcteacher/checkVacationWork.html'
            },
            reAssign(){
                if(this.resultInfo.errorCode=='15018'){
                    this.closeAssignWork();
                    return false;
                }
                this.showResult=false;
            }

        },
        props:['assignWorkShow','hasPreview','assignInfo'],
        components:{
            'modal':require('../../components/modal.vue'),
        },
        created(){
            for(let i=0;i<24;i++){
                if(i<10){
                    i='0'+i
                }
                this.hourRange.push(i);
            }
            for(let i=0;i<60;i++){
                if(i<10){
                    i='0'+i
                }
                this.minRange.push(i);
            }
            this.loadPrepareInfo();
        }
    }
</script>
<style lang="scss">

  .assign-work .el-input--small .el-input__prefix{display: none;}
  .assign-work .el-input--small .el-input__suffix{display: none;}
  .assign-work .el-input--small .el-input__inner{padding-left: 6px;}
  .assign-work .vc-datepicker.el-input--small{width: 112px;height: 32px;}
  .assign-work .vc-datepicker.el-input--small input.el-input__inner{border-radius: 0;padding-right: 0;height: 32px;line-height: 32px;border-radius: 4px;border: 1px solid #CBD8E1;}
</style>
<style lang="scss" scoped>
    .assign-work{
        .title{
            font-weight: bold;
        }
        .operate{
            width: 240px;
            margin:30px auto 0;
            overflow: hidden;
            .btn{
                width: 100px;
                height:40px;
                line-height: 40px;
                text-align: center;
                color: #fff;
                cursor: pointer;
                background: #159CFC;
                &.btn-left{
                    float: left;
                    background: #30BD9B;
                }
                &.btn-right{
                    float: right;
                    background: #159CFC;
                }
                &.fail-btn{
                    margin:0 auto;
                }
            }
        }
        .assign-content{
            width: 550px;
            padding:0 65px 40px;
            .package-info{
                padding-bottom: 8px;
                border-bottom: 1px dashed #DBE6EE;
                .row-content{
                    overflow: hidden;
                    margin-bottom: 16px;
                    .item-title{
                        width: 128px;
                        text-align:right;
                        color: #7e7e7e;
                        float: left;
                    }
                    p{
                        line-height: 20px;
                        float: left;
                        color:#555;
                    }

                }
            }
            .class-info{
                .row-content{
                    overflow: hidden;
                    line-height: 20px;
                    margin-bottom: 16px;
                    margin-top: 24px;
                    .item-title{
                        width: 128px;
                        text-align:right;
                        color: #7e7e7e;
                        float: left;
                    }
                    ul{
                        line-height: 20px;
                        float: left;
                        li{
                            cursor: pointer;
                            margin-bottom:8px;
                            .check-box{
                                margin-top: 3px;
                                vertical-align: middle;
                                float: left;
                                width: 14px;
                                height: 14px;
                                border: 1px solid #CBD8E1 ;
                                margin-right:8px;
                            }
                            &.checked{
                                .check-box{
                                    border: 1px solid #189CFB;
                                    background: url(../../assets/img/teacher/list-select-logo.png) no-repeat center center;
                                    background-size: contain;
                                }
                            }
                            &.assigned{
                                opacity: 0.4;
                            }
                            &.class-err{
                                margin-top: 9px;
                                color:#F97051;
                            }
                        }
                    }


                }
            }
            .assign-info{
                .row-content{
                    overflow: hidden;
                    margin-bottom: 24px;
                    .item-title{
                        width: 128px;
                        text-align:right;
                        color: #7e7e7e;
                        float: left;
                        height: 32px;
                        line-height: 32px;
                    }
                    .item-content{
                        float: left;
                        .vc-hour,.vc-min{
                            box-sizing: border-box;
                            background-color: #fff;
                            border: 1px solid #CBD8E1;
                            color: #555;
                            width: 72px;
                            padding: 2px 9px;
                            line-height: 32px;
                            height: 32px;
                            vertical-align: middle;
                            border-radius:4px;
                            -webkit-border-radius:4px;
                            -moz-border-radius :4px;
                        }
                    }
                    .homework-name{
                        padding-left:6px;
                        width:266px;
                        height: 32px;
                        line-height: 32px;
                        border-radius: 4px;
                        border: 1px solid #CBD8E1;
                        color:#555;
                    }

                }
            }

        }
        .result-content{
            color:#555;
            width:500px;
            padding:10px 0 40px;
            .bg-img{
                width:80px;
                height:80px;
                margin: 0 auto;
                background: url(../../assets/img/vacation/success.png) no-repeat center center;
                background-size: cover;
                &.fail{
                    background: url(../../assets/img/vacation/fail.png) no-repeat center center;
                    background-size: cover;
                }
            }
            .result-title{
                font-size:20px;
                text-align:center;
                padding-top: 16px;
                padding-bottom:20px;
                span{
                    color:#159CFC;
                    font-size:28px;

                }
            }
            .err-detail{
                text-align:center;
                color:#7F7E7E;
            }
        }

    }
</style>

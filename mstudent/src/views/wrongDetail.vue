<template>
    <div class="container">
    	<div class="top">
    		<progressTpl></progressTpl>
    	</div>
<<<<<<< HEAD
    	<div class="box">
    		<question :question="question"></question>
=======
    	<div class="box" v-for="(v,k) in block.quesArr" :key="k" v-show="curIndex==k">
    		<question :question="v" @change="change"></question>
>>>>>>> 66f69bb9ab7db71c05d1bd09210a18a4234da807
    	</div>
    	<div class="submit_warp">
    		<button @click="next">下一题</button>
    	</div>
    </div>
</template>

<script>
	import question,{ Bus } from 'marvel';
	import progressTpl from '../components/wrongdetailTemp/progress.vue';
    export default {
        name: "wrongDetail",

        components:{question,progressTpl},

        data(){
        	return {
<<<<<<< HEAD
        		question:{
        			'questionType2Id':'203006000'
=======
        	  curIndex:0,
        		block:{
        			quesArr:[
        				{
        					'questionType2Id':'203006000'
        				}
        			]

>>>>>>> 66f69bb9ab7db71c05d1bd09210a18a4234da807
        		}
        	}
        },
      methods:{
        next(){
          this.curIndex++
        },
        change({type}){

        }
      }
    }
</script>

<style rel="stylesheet/scss" type="text/css" lang="scss" scoped>
	.container{
		height: 100%;
		width: 100%;
		.box{
			padding-bottom: 1.2rem;
			margin-bottom: 0.2rem;
		}
		.submit_warp{
			position: fixed;
			bottom: 0;
			left: 0;
			width: 100%;
			background: #ffffff;
			padding: 0.16rem 0;
			text-align: center;
			button{
				width: 85%;
				margin:0 auto;
				height: 0.88rem;
				line-height: 0.88rem;
				text-align: center;
				color: #ffffff;
				font-size: 0.32rem;
				border-radius:20px;
				background: #007AFF;
				border: none;
				outline: none;
			}
		}
	}

</style>

<template>
	<div class="progess_warp clearfix">
		<div class="progess">
			<XProgress class="progessBar" :percent="20"></XProgress>
			<span class="icon"></span>
		</div>
		<div class="quesnum_warp">
			<p><span class="active">15 </span>/ 30</p>
		</div>
	</div>
</template>
<script>
	import { XProgress } from 'vux';
	export default {
        name: "progressTpl",

        components:{XProgress}
    }
</script>
<style scoped lang="scss" type="text/css" rel="stylesheet/scss">
	.progess_warp{
		width: 100%;
		height:1.2rem;
		line-height:1.2rem;
		padding:0 0.3rem;
		background:#fff;
		.progess{
			width:80%;
			height:100%;
			float: left;
			line-height:1.2rem;
			position: relative;
			overflow: hidden;
			.progessBar{
				margin: auto 0;
				height: 100%;
				line-height:100%;
			}
		}
		.quesnum_warp{
			float: right;
			font-size: 0.32rem;
			color: #000000;
			.active{
				color: #0599F6
			}
		}

	}
</style>
<style lang="scss" type="text/css" rel="stylesheet/scss">
	.progess_warp {
		.weui-progress__bar{
			height: 0.16rem;
			border-radius: 8px;
			background: #e6f9ff;
		}
		.weui-progress__inner-bar{
			background:#0599f6;
			border-radius: 8px;

		}
	}
</style>
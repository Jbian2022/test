<template>
	<view class="content_style">
		<BgTheamCompontent :theamType="'currency'"></BgTheamCompontent>
		<NavBarCompontent :leftNavTitle="'动态评估'" ></NavBarCompontent>
		<van-row style="background-color: #343A44;">
		  <van-col class="need_scoll" span="24">	
			  <view class="dynamicshow" v-for="(item,index) in dynamicEvaluationdata"  :key="index">
				<view class="dynamicshow_left">
				  <view class="correct">
					  <image  class="correct_img_style" src="../../static/app-plus/other/yesActive.png"></image>
				  	
				  </view>
				  
				  <view class="correct" v-if="!icon">
					  <image class="correct_img_style" src="../../static/app-plus/other/yesNoActive.png"></image>
				  	
				  </view>
				  <text class="evaluationdata">
				  	{{item.title}}	
				  </text>
					
				</view>
				  

				  <view class="dynamicshow_right">
				  	<image
				  	  class="back_img_style"
				  	  src="../../static/app-plus/mebrs/backRight.png"
				  	></image>
				  </view>
			  </view>
			  
			 
		  </van-col>
		</van-row>
		 <van-button type="primary" block class="buttontrue">生成报告</van-button>


		
	</view>
</template>

<script> 
	import BgTheamCompontent from '@/components/bgTheamCompontent/bgTheamCompontent.vue'
	import NavBarCompontent from '@/components/navBarCompontent/navBarCompontent.vue'
	export default {
		components: {
			BgTheamCompontent,
			NavBarCompontent
		},
		data() {
			return {
				dynamicEvaluationdata:[
					{title:"自重深蹲评估", type: 'zzsdpg'},
					{title:"胸椎活动评估", type: 'xzhdpg'},
					{title:"柔韧性测试", type: 'rrxcs'},
					{title:"关节灵活测试", type: 'gjlhcs'},
					{title:"俯卧撑稳定性测试", type: 'fwcwdxcs'}
				],
				icon:true
			}
		},
		methods: {
			  setup() {
			    const onClickLeft = () => history.back();
			    return {
			      onClickLeft,
			    };
			  },
			  
		},
		
	}
</script>

<style lang="scss" scoped>
.content_style {
	width: 100vw;
	height: 100vh;
	overflow: hidden;
	position: relative;

}
.dynamicshow{
width: calc(100vw - 60upx);

	overflow-y: auto;
	background-color: #383D46;	
	margin-left: 30upx;
	margin-top: 30upx;
	height: 210upx;
	border-radius:24upx;
	position: relative;

	font-size: 36upx;
		color: #F4F7FF;	
		display: flex;
		align-items: center;
		justify-content: space-between;
		.dynamicshow_left {
			display: flex;
			align-items: center;
			.correct{
				width: 34upx;
				height: 29upx;
				// position: absolute;
				margin-left: 60upx;
				margin-right: 30upx;
				.correct_img_style {
					width: 40upx;
					height: 42upx;
					object-fit: contain;
				}
			}
			.evaluationdata {
			
				// width: 216upx;
				height: 50upx;
				font-size: 36upx;
				font-family: PingFangSC-Semibold, PingFang SC;
				color: #F4F7FF;
				text-align: center;
				// margin: 80upx 130upx;
			}
			
		}
		.dynamicshow_right {
			margin-right: 40upx;
			.back_img_style {
				width: 40upx;
				height: 40upx;
			}
				
			
			
		}



}
.buttontrue{
width: calc(100vw - 60upx);
	height: 100upx;
	background: #1370FF;
	border-radius: 16upx;
	margin-left: 30upx;
	margin-top: 30upx;
}


::v-deep .van-icon-success:before{
		position: absolute;
	color: #7A7F89;
	font-size:60upx;
	margin-left: 64upx;
	margin-bottom: 98upx;
}
::v-deep .van-icon-arrow{
	position: absolute;
	width: 14px;
	height: 14px;
	opacity: 0.3;
	/* color: #CCCCCC ; */
	text-align: right;	
	margin-left: 600upx;
	margin-top:85upx ;

}
.need_scoll {
	height: 82vh !important;
	overflow-y: auto;
}
</style>

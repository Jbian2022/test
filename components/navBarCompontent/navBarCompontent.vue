<template>
	<view class="nav_bar_style">
		<view class="nav_left_style" @click.native="goBack">
			<image
			  class="back_img_style"
			  src="../../static/app-plus/mebrs/back.png"
			></image>
			<view class="nav_title_style">{{leftNavTitle}}</view>
		</view>
		<text class="nav_content_style">{{contentTitle}}</text>
		<!-- 可能会有图片 -->
		<view class="nav_right_style">
			<text class="authority_style" v-if="isAuthority">数据评测来源于世界权威机构</text>
		</view>
	</view>
</template>

<script>
	export default {
		name:"navBarCompontent",
		props: ['leftNavTitle', 'contentTitle', 'jumpType', 'isAuthority'],
		data() {
			return {
				
			};
		},
		methods: {
			goBack() {
				switch(this.jumpType) {
					case 'STPC':
					uni.reLaunch({
					  url: '/pages/myMebers/myMebers'
					})  
					break;
					default:
					uni.navigateBack();
					break;
					
				}
				
			}
		}
	}
</script>

<style lang="scss">
	.nav_bar_style {
		width: 100%;
		height: 88upx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-top: 88upx;
		
		.nav_left_style {
			height: 100%;
			display: flex;
			align-items: center;
			margin-left: 30upx;
			// width: 40%;
			box-sizing: border-box;
			flex-wrap: nowrap;
			.back_img_style {
				width: 40upx;
				height: 40upx;
				
			}
			.nav_title_style {
				margin-left: 20upx;
				font-size: 48upx;
				font-family: PingFangSC-Semibold, PingFang SC;
				font-weight: 600;
				color: #FFFFFF;
				z-index: 80;
				}	
		}
		.nav_content_style {
			display: inline-block;
			z-index: 80;
			flex: 1;
			text-align: center;
			font-size: 30upx;
			font-family: PingFangSC-Medium, PingFang SC;
			font-weight: 500;
			color: #FFFFFF;
			
		}
		.nav_right_style {
			// width: 10%;
			margin-right: 30upx;
			margin-top: 20upx;
			.authority_style {
				font-size: 24upx;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				color: #7A7F89;
			}
		}
		
	}
	::v-deep.van-icon {
		font-size: 24upx !important;
		color: #7A7F89 !important;
		
	}

</style>
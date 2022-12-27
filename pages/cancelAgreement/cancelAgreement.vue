<template>
	<view class="cancel-agreement">
		<view class="status_bar"> <!-- 这里是状态栏 --> </view>
		<view class="top-bar">
			<van-icon name="arrow-left" @click="back" />
			<view class="title">账号注销协议</view>
			<view class="zan">00</view>
		</view>
		<view class="agreement-box">
			占位文字占位文字占位文字占位文字占位文字占位文字占位文字占位文字占位文字占位文字占位文字占位文字占位文字占位文字占位文字占位文字占位文字占位文字占位文字占位文字占位文字占位文字占位文字占位文字占位文字占位文字占位文字占位文字占位文字占位文字占位文字占位文字占位文字占位文字占位文字占位文字占位文字占位文字占位文字占位文字占位文字占位文字占位文字占位文字占位文字占位文字占位文字占位文字占位文字占位文字占位文字占位文字占位文字占位文字占位文字占位文字占位文字占位文字占位文字占位文字占位文字占位文字占位文字占位文字占位文字占位文字占位文字占位文字占位文字占位文字占位文字占位文字占位文字占位文字占位文字占位文字占位文字占位文字占位文字占位文字占位文字占位文字占位文字占位文字占位文字占位文字占位文字占位文字占位文字占位文字占位文字占位文字占位文字占位文字占位文字占位文字占位文字占位文字占位文字占位文字占位文字占位文字占位文字占位文字占位文字占位文字占位文字占位文字占位文字占位文字占位文字占位文字占位文字占位文字占位文字占位文字占位文字占位文字占位文字占位文字占位文字占位文字占位文字占位文字占位文字占位文字占位文字占位文字占位文字占位文字占位文字占位文字占位文字占位文字占位文字占位文字占位文字占位文字占位文字占位文字占位文字占位文字占位文字占位文字占位文字占位文字占位文字占位文字占位文字占位文字占位文字占位文字占位文字占位文字。
		</view>
		<view class="footer-box">
			<view class="footer-btn van-button" @click="goPage">我已阅读并同意</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		methods: {
			back(){
				uni.navigateTo({
					url: '/pages/cancel/cancel'
				})
			},
			goPage(){
				uni.navigateTo({
					url: '/pages/cancel/cancel?agree=1'
				})
			}
		},
		onBackPress(){
			uni.navigateTo({
					url: '/pages/cancel/cancel'
				})
			return true
		}
	}
</script>

<style lang="scss">
	page{
		background-color: #fff;
	}
	.status_bar {
		height: var(--status-bar-height);
		width: 100%;
	}
	.cancel-agreement{
		padding: 0 30upx;
		.top-bar{
			position: sticky;
			top: var(--status-bar-height);
			height: 88upx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			color: #323438;
			background-color: #fff;
			.van-icon{
				font-size: 40upx;
				color: #323438;
			}
			.zan{
				opacity: 0;
			}
			.title{
				font-size: 30upx;
				font-weight: 500;
			}
		}
		.agreement-box{
			padding-bottom: 140upx;
			font-size: 30upx;
			font-weight: 400;
			color: #6E7073;
			line-height: 44upx;
		}
		.footer-box{
			position: fixed;
			bottom: 0;
			left: 0;
			right: 0;
			height: 120upx;
			padding: 0 40upx;
			padding-top: 10upx;
			background-color: #fff;
			.footer-btn{
				box-sizing: border-box;
				width: 100%;
				background: #1370FF;
				border-radius: 16upx;
				font-size: 32upx;
				font-weight: 600;
				color: #FFFFFF;
				line-height: 100upx;
				text-align: center;
			}
		}
	}
</style>

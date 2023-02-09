<template>
	<view class="cancel">
		<view class="status_bar"> <!-- 这里是状态栏 --> </view>
		<view class="top-bar">
			<van-icon name="arrow-left" @click="back" />
			<view class="title">申请注销账号</view>
			<view class="zan">00</view>
		</view>
		<view class="project-des">为保证您的账号安全，请您在提交申请注销生效前，需要满足并知晓以下内容：</view>
		<view class="project-box">
			<view class="first-text">1.当账号无已付费会员，无财产纠纷</view>
			<view class="second-text">请确保所有会员已经服务完成，账号没有任何投诉、违约情况。</view>

			<view class="first-text">2.当前账号金卡教练权益已到期</view>
			<view class="second-text">请确保当前账号金卡教练权益已到期。</view>

			<view class="first-text">3.账号处于安全状态</view>
			<view class="second-text">账号处于正常使用状态，无被盗风险。</view>

			<view class="first-text">4.账号权限解除</view>
			<view class="second-text">账号已解除与其他产品的授权登录或绑定关系。</view>
		</view>
		<view class="check-read" @click="checkFlag=!checkFlag">
			<view class="check-btn">
				<image
					class="check_img_style"
					src="../../static/login/check.svg"
					v-if="checkFlag"
				></image>
				<image
					class="check_img_style"
					src="../../static/login/nocheck.svg"
					v-if="!checkFlag"
				></image>
			</view>
			<div class="check-text">我已阅读并同意<text class="btn" @click.stop="goto">《账号注销协议》</text></div>
		</view>
		<view class="footer-btn van-button" :class="{active:checkFlag}" @click="open">确认注销</view>
		<uni-popup ref="popup" type="center" mask-background-color="rgba(20, 21, 23, 0.6)">
			<view class="dialog">
				<view class="dialog-section">
					<view class="dialog-title">是否确认注销</view>
					<view class="dialog-content">确认删除该账号吗？注销后无法找回！</view>
					<view class="dialog-btn-box">
					<van-button type="default" @click="closeHandle">取消</van-button>
					<van-button type="primary" @click="cancel">确认</van-button>
					</view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	const login = uniCloud.importObject('login')
	export default {
		data() {
			return {
				checkFlag: false,
				showDialog: false
			}
		},
		onLoad: function (option) {
			if(option&&option.agree==='1'){
				this.checkFlag = true
			}
		},
		methods: {
			back(){
				uni.reLaunch({
					url: '/pages/setUp/setUp'
				})
			},
			goto(){
				uni.reLaunch({
					url: '/pages/cancelAgreement/cancelAgreement'
				})
			},
			open(){
				if(this.checkFlag){
					this.$refs.popup.open()
				}
			},
			closeHandle(){
				this.$refs.popup.close()
			},
			async cancel(){
				await login.closeAccount();
				uni.clearStorage();
				uni.reLaunch({
					url: '/pages/logining/logining'
				});
			}
		},
		onBackPress(){
			uni.reLaunch({
					url: '/pages/setUp/setUp'
				})
			return true
		}
	}
</script>

<style lang="scss">
	page{
		background: #212328;
	}
	.status_bar {
		height: var(--status-bar-height);
		width: 100%;
	}
	.cancel{
		padding: 0 40upx;
		.top-bar{
			height: 88upx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			.van-icon{
				font-size: 40upx;
				color: #FFFFFF;
			}
			.zan{
				opacity: 0;
			}
			.title{
				font-size: 30upx;
				font-weight: 500;
				color: #FFFFFF;
			}
		}
		.project-des{
			padding-top: 40upx;
			font-size: 32upx;
			font-weight: 600;
			color: #F4F7FF;
			line-height: 44upx;
		}
		.project-box{
			margin-top: 30upx;
			background: rgba(56, 61, 70, .5);
			border-radius: 24upx;
			padding: 60upx 40upx;
			.first-text{
				font-size: 32upx;
				font-weight: 600;
				color: #BDC3CE;
				line-height: 44upx;
			}
			.second-text + .first-text {
				margin-top: 60upx;
			}
			.second-text{
				font-size: 28upx;
				font-weight: 400;
				color: #7A7F89;
				line-height: 40upx;
				margin-top: 20upx;
			}
		}
		.check-read{
			margin-top: 24upx;
			display: flex;
			.check-btn{
				width: 28upx;
				height: 30upx;
				padding-right: 20upx;
				.check_img_style {
					width: 100%;
					height: 100%;
					object-fit: contain;
				}
			}
			.check-text{
				font-size: 26upx;
				font-weight: 400;
				color: #BDC3CE;
				line-height: 36upx;
				.btn{
					color: #F4F7FF;
				}
			}
		}
		.footer-btn{
			position: fixed;
			bottom: 40upx;
			left: 40upx;
			right: 40upx;
			height: 100upx;
			background: #454951;
			border-radius: 16upx;
			font-size: 32upx;
			font-weight: 600;
			color: #FFFFFF;
			line-height: 100upx;
			text-align: center;
			&.active{
				background: #1370FF;
			}
		}
		.dialog {
			background: #383d46;
			border-radius: 24upx;
		}
		.dialog-section {
			padding: 50upx;
			.dialog-title {
				display: flex;
				align-items: center;
				font-size: 52upx;
				color: #f4f7ff;
				line-height: 72upx;
				font-weight: 600;
				&::after {
					content: '';
					margin-left: 20upx;
					display: inline-block;
					width: 60upx;
					height: 60upx;
					background: url('../../static/newWorkout/pop-up.png');
					background-size: contain;
					background-repeat: no-repeat;
				}
			}
			.dialog-content {
				margin-top: 30upx;
				margin-bottom: 80upx;
				font-size: 30upx;
				font-weight: 400;
				color: #a8adb6;
				line-height: 48upx;
			}
		}
		.dialog-btn-box {
			::v-deep .van-button {
				width: 240upx;
				height: 90upx;
				background: #454951;
				border-radius: 16upx;
				border: none;
				font-size: 32upx;
				font-weight: 600;
				color: #ffffff;
				& + .van-button {
					margin-left: 30upx;
				}
				&.van-button--primary {
					background: #1370ff;
				}
			}
		}
		::v-deep .uni-popup [name="mask"]{
			backdrop-filter: blur(3px);
		}
	}
</style>

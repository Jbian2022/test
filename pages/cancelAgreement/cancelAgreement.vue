<template>
	<view class="cancel-agreement">
		<view class="status_bar"> <!-- 这里是状态栏 --> </view>
		<view class="top-bar">
			<van-icon name="arrow-left" @click="back" />
			<view class="title">账号注销协议</view>
			<view class="zan">00</view>
		</view>
		<view class="agreement-box">
			在你申请注销健变账号之前，请谨慎操作。
			请你认真阅读、理解并同意《账号注销须知》（以下称“注销须知”）。
			【特别提示】在此善意提醒你，注销健变账号为不可恢复的操作，注销账号后你将无法再在健变及统一服务平台体系内的多项关联方产品/服务中使用本账号或找回你添加、绑定的任何内容或信息（即使你使用相同的手机号码再次注册并使用健变)。
			建议你在注销前自行备份健变账号相关的所有信息，并请确认与本健变账号相关的所有服务均已进行妥善处理。注销成功后，我们将删除你的个人信息，或对其进行匿名化处理。请你知悉并理解，根据相关法律法规规定相关日志记录健变将保留不少于6个月的时间。
			1 我们对你注销健变账号的决定深表遗憾。
			如果你仍执意注销账号，你的账号需同时满足以下条件：
			1.1 账号处于安全状态：账号处于正常使用状态，无被盗风险。
			1.2 账号财产均已结清，没有未完成和/或存在争议的服务：账号中没有资产、欠款、未结清的资金和虚拟权益；本账号及通过本账号接入的第三方中没有
			未完成和/或存在争议的服务。
			1.3账号权限解除：账号己解除与其他产品、网站授权登录或绑定关系。
			1.4 账号无任何纠纷，包括投诉举报或被投诉举报。
			2. 在你的账号注销期间，如果你的账号涉及争议
			纠纷，包括但不限于：
			2.1投诉、举报、诉讼、仲裁、国家有权机关调查等，你知晓并理解，健变有权自行决定是否终止本账号的注销而无需另行得到你的同意。
			3. 注销健变账号，你将无法再使用本健变账号，也将无法找回本健变账号中及与账号相
			关的任何内容或信息，包括但不限于：
			3.1本健变账号的个人资料和历史信息（包括但不限于头像、用户名、发布内容、浏览记录、关注、收藏等）都将无法找回；
			3.2 你将无法登录、使用本健变账号；
			3.3 你通过本健变账号使用、授杈登录或绑定本健变账号后使用的健变或第三方服务的相关记录将无法找回。你将无法再登录、使用上述服务，你曾获得的虛拟权益等财产性利益视为你自动放奔，将无法继续使用。
			3.4 统一服务平台体系范围内的多项关联方产品/服务将无法使用本账号，了解统一服务平台体系你理解井同意，健变无法协助你重新恢复上述服务。
			4. 注销本健变账号并不代表注销前的账号中的行为和相关责任得到豁免或减轻。
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
				uni.reLaunch({
					url: '/pages/cancel/cancel'
				})
			},
			goPage(){
				uni.reLaunch({
					url: '/pages/cancel/cancel?agree=1'
				})
			}
		},
		onBackPress(){
			uni.reLaunch({
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
			width: 100vw;
			position: fixed;
			bottom: 0;
			left: 0;
			right: 0;
			background-color: #fff;
			.footer-btn{
			width: calc(100vw - 60upx);
				
				margin-left: 30upx;
				height: 100upx;
				background: #1370ff;
				border-radius: 16upx;
				margin-top: 30upx;
				margin-bottom: 30upx;
				font-size: 32upx;
				font-family: PingFangSC-Semibold, PingFang SC;
				font-weight: 600;
				color: #ffffff;
				line-height: 100upx;
				text-align: center;
			}
		}
	}
</style>

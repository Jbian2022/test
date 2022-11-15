<template>
	<view class="counter">
		<view class="text">
			<h1 class="text1">欢迎使用本产品！</h1>
			<h2 class="text2">WELCOME</h2>
			<p class="text3">为了更好的保障您的合法权益，在使用本应用之前，请您仔细阅读
			《隐私协议》和《隐私协议》，点击同意即表示您已阅读并同意接受我们的服务，感谢您的信任！
			</p>
			<button  class="btn"><span class="btn-text">同意并继续</span></button>
			<p class="btn-text2">不同意</p>
		</view>
		<view class="bottom-text">
			
			<p class="a-i-c">同意《隐私政策》和《用户协议》政策并使用本机号码登录</p>
			<p ></p>
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
			
		}
	}
</script>

<style lang="scss" scoped>
	.counter {
		position: absolute;
		background: url("@/static/backgroundImage.png") no-repeat center center;
		background-size: 100% 100%;
		width: 100vw;
		height: 100vh;
		.bottom-text {
			position: absolute;
			width: 100%;
			height: 100%;
			background: #141517;
			opacity: 0.7;
			backdrop-filter: blur(0upx);
			padding-left: 118upx;
			.a-i-c {
				padding-top: 10upx;
				width: 562upx;
				height: 72upx;
				font-size: 26upx;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				color: #A8ADB6;
				line-height: 36upx;

			}
		}
		.text {
			// position: absolute;
			margin: 218*2upx 35*2upx;
			margin-bottom: 0upx;
			width: 305*2upx;
			height: 376*2upx;
			background: #FFFFFF;
			border-radius: 12*2upx;
			
				
				.btn-text2 {
					padding-top: 20upx;
					padding-left: 264upx;
					padding-bottom: 40upx;
					width: 84upx;
					height: 40upx;
					font-size: 28upx;
					font-family: PingFangSC-Regular, PingFang SC;
					font-weight: 400;
					color: #A8ADB6;
					line-height: 40upx;
				
			}
			.btn {
			margin-top: 60upx;	
			width: 490upx;
			height: 100upx;
			background: #1370FF;
			border-radius: 16upx;
			.btn-text {
				width: 160upx;
				height: 44upx;
				font-size: 32upx;
				font-family: PingFangSC-Semibold, PingFang SC;
				font-weight: 600;
				color: #FFFFFF;
				line-height: 44upx;
			}	
			}
			.text3 {
				padding: 20upx 60upx 0upx 60upx;
				width: 490upx;
				height: 240upx;
				font-size: 30upx;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				color: #6E7073;
				line-height: 48upx;
			}
			.text2 {
				// position: relative;
				padding: 10*2upx 191*2upx 280*2upx 30*2upx;
				padding-bottom: 0upx;
				width: 84*2upx;
				height: 23*2upx;
				font-size: 16*2upx;
				font-family: HarmonyOS_Sans_SC_Black;
				color: #1370FF;
				line-height: 23*2upx;
			}
			.text1 {
				// position: relative;
				padding: 33*2upx 67*2upx 307*2upx 30*2upx;
				padding-bottom: 0*2upx;
				width: 208*2upx;
				height: 36*2upx;
				font-size: 26*2upx;
				font-family: HarmonyOS_Sans_SC_Bold;
				color: #323438;
				line-height: 36*2upx;
			}
			
		}
		
		
	}

</style>

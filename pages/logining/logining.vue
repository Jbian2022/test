<template>
	<view class="counter">
		<view class="counter-text">
			<view class="counter-text1">
			健变，<br>从此刻开始。
				<p class="a-i-c">私人专属教练，扁平学员管理</p>
			</view>
			<van-field
			  readonly
			  clickable
			  :value="value"
			  @touchstart.native.stop="show = true"
			/>
			<van-number-keyboard
			  v-model="value"
			  :show="show"
			  :maxlength="6"
			  @blur="show = false"
			/>
			<button class="btn-bttom"><span class="btn-text">获取验证码</span></button>
		</view>
		
	</view>
</template>

<script>
	export default {
		 data() {
		    return {
		      show: false,
		      value: '',
		    };
		  },
		methods: {
			 
		}
	}
</script>

<style scoped lang="scss">
	.counter {
		background: url("@/static/backgroundImage.png") no-repeat center center;
		background-size: 100% 100%;
		width: 100vw;
		height: 100vh;
		
		.counter-text {
			padding-top: 532upx;
			padding-left: 70upx;
			padding-right: 80upx;
			.counter-text1 {
			width: 600upx;
			height: 280upx;
			font-size: 100upx;
			font-family: HarmonyOS_Sans_SC_Black;
			color: #FFFFFF;
			line-height: 140upx;	
			}
			.a-i-c {
				width: 390upx;
				height: 42upx;
				font-size: 30upx;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				color: #A8ADB6;
				line-height: 42upx;
			}
			.tel {
				margin-top: 60upx;
				width: 610upx;
				height: 100upx;
				background: #F4F7FF;
				border-radius: 16upx;
				opacity: 0.15;
			}
			.btn-bttom {
				margin-top: 40upx;
			width: 610upx;
			height: 100upx;
			background: #454951;
			border-radius: 16upx;
				.btn-text {
					width: 160upx;
					height: 44upx;
					font-size: 32upx;
					font-family: PingFangSC-Semibold, PingFang SC;
					font-weight: 600;
					color: #F4F7FF;
					line-height: 44upx;
				}
			}
			
		}
	}

</style>

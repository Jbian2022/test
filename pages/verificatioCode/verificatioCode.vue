<template>
	<view class="counter">
		<!-- 返回 -->
		<van-icon name="arrow-left" size="50upx"   class="app-esc"/>
		
		<view class="counter-matter">
			
			<h1 class="code">请输入验证码</h1>
			<span class="phone">验证码已发送至 18329218839</span>
			<!-- 明文展示验证码 -->
			<van-password-input
			class="a-i-c"
			 :mask="false"
			  :length="4"
			 :gutter="10"
			  :value="smsCode"
			  :error-info="errorInfoValue"
			  :focused="showKeyboard"
			  @focus="showKeyboard = true"
			/>
			<van-number-keyboard
			
			  v-model="smsCode"
			  :show="showKeyboard"
			  @blur="showKeyboard = false"
			    :maxlength="4"
			/>
			<!-- 登录 -->
			<button class="btn" @click="smsLogin"><span class="btn-text">登录</span></button>
			<p class="time">重新发送（57）</p>
		</view>
		
	</view>
</template>

<script>
// import loginVue from './login/login.vue';
	export default {
		data() {
			return {
			 smsCode: '',
			      errorInfoValue: '',
			      showKeyboard: false,	
			}
		},
		watch: {
			smsCode: function(n,o) {
				// console.log(n,'????')
			  if (n.length === 4 && n !== '1234') {
			        this.errorInfoValue = '验证码错误';
			      } else {
					   this.errorInfoValue = '';
				  }
				
				}
		},
		methods: {
			// 上方退出标识
			smsLogin() {
				
			},

			
		}
	}
</script>

<style lang="scss" scoped >
	
	.counter {
		position: absolute;
		background: url("@/static/general.png") no-repeat center center;
		background-size: 100% 100%;
		width: 100vw;
		height: 100vh;
		// 验证码框颜色
		::v-deep.van-password-input__security li {
			background: #383D46;
		}
		// 验证码字体
		::v-deep.van-password-input__security li {
			
			font-size: 48upx;
			font-family: SFPro-Semibold, SFPro;
			font-weight: 600;
			color: #F4F7FF;
			line-height: 58upx;
		}
		// 键盘背景色
		.van-number-keyboard {
			background-color: #272729 80%;
			
		}
		.app-esc {
			margin-top: 80upx;
			margin-left: 30upx;
			color: #A8ADB6;
		}
		.counter-matter {
			
			.code {
				margin-left: 60upx;
				margin-top: 226upx;
				width: 288upx;
				height: 66upx;
				font-size: 48upx;
				font-family: PingFangSC-Semibold, PingFang SC;
				font-weight: 600;
				color: #F4F7FF;
				line-height: 66upx;
			}
			.phone {
				margin-left: 60upx;
				margin-top: 16upx;
				width: 418upx;
				height: 42upx;
				font-size: 30upx;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				color: #A8ADB6;
			}
			.a-i-c {
				margin-top: 64upx;
				
			}
		.btn {
			margin-top: 80upx;
			width: 630upx;
			height: 100upx;
			background: #1370FF;
			border-radius: 16upx;
			.btn-text {
				width: 64upx;
				height: 44upx;
				font-size: 32upx;
				font-family: PingFangSC-Semibold, PingFang SC;
				font-weight: 600;
				color: #FFFFFF;
				line-height: 44upx;
			}
		}
		}
		.time {
			margin-top: 40upx;
			text-align: center;
			// width: 216upx;
			// height: 42upx;
			font-size: 30upx;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			color: #A8ADB6;
			line-height: 42upx;
		}
	}
	

</style>

<template>
	
		
	
	<view class="counter">
		<!-- 返回图标 -->
		<van-icon name="arrow-left" size="50upx"   class="app-esc"/>
		<p class="text">跳过</p>
		<view class="botter">
			<span class="botter-top">个人信息完善</span>
			<p class="a-i-c">完善信息后方可进行学员管理</p>
		</view>
		<!-- 输入框下拉框 -->
		<view class="input">
			<van-field
			class="input-name"
			  v-model="value"
			  label="姓名"
			  placeholder="请填写姓名"
			  input-align="right"
			/>
			
		</view>
		<!-- 性别下拉框 -->
		<view class="options">
			<van-field
			class="options-sex"
			  v-model="result"
			  is-link
			  readonly
			  name="picker"
			  label="性别"
			  placeholder="请选择性别"
			  @click="showPicker = true"
			/>
			<van-popup v-model:show="showPicker" position="bottom">
			  <van-picker
			    :columns="columns"
			    @confirm="onConfirm"
			    @cancel="showPicker = false"
			  />
			</van-popup>
		</view>
		<!-- 确认按钮 -->
		<view class="btn">
			<button class="btn-b"><span class="btn-text">确认</span></button>
			
		</view>
		
	</view>
	
</template>

<script>
	import { ref } from 'vue';
	export default {
	  setup() {
	    const result = ref('');
	    const showPicker = ref(false);
	    const columns = ['男', '女'];
	
	    const onConfirm = (value) => {
	      result.value = value;
	      showPicker.value = false;
	    };
	
	    return {
	      result,
	      columns,
	      onConfirm,
	      showPicker,
	    };
	  },
	};
</script>

<style  lang="scss" scoped>
	// 性别
	::v-deep.van-field__control {
		font-size: 30upx;
		font-family: PingFangSC-Medium, PingFang SC;
		font-weight: 500;
		color: #F4F7FF;
	}
	// 确认按钮
	.btn {
		position: fixed;
		bottom: 68upx;
		margin: 0 40upx;
		
			.btn-b {
				margin: auto;
				text-align:center;
				width: 670upx;
				height: 110upx;
				background: #383D46;
				border-radius: 16upx;
				line-height: 100upx;
				.btn-text {
					width: 64upx;
					height: 44upx;
					font-size: 32upx;
					font-family: PingFangSC-Semibold, PingFang SC;
					font-weight: 600;
					color: #FFFFFF;
					
					
				}
			}
		}
	::v-deep.van-field__control--right {
		font-size: 30upx;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: #7A7F89;
		
	}
	::v-deep.van-field__label {
		
		width: 60upx;
		height: 42upx;
		font-size: 30upx;
		font-family: PingFangSC-Medium, PingFang SC;
		font-weight: 500;
		color: #F4F7FF;
		line-height: 80upx;
		
	}
	.counter {
	position: absolute;
	background: url("@/static/general.png") no-repeat center center;
	background-size: 100% 100%;
	width: 100vw;
	height: 100vh;
	
	.app-esc {
		margin-top: 80upx;
		margin-left: 30upx;
		color: #A8ADB6;
	}	
		.text {
			float: right;
			margin-right: 30upx;
			margin-top: 80upx;
			font-size: 30upx;
			font-family: PingFangSC-Medium, PingFang SC;
			font-weight: 500;
			color: #A8ADB6;
			line-height: 42upx;
		}
		.botter {
			margin-top: 40upx;
			.botter-top{
				
				margin-left: 40upx;
				width: 288upx;
				height: 66upx;
				font-size: 48upx;
				font-family: PingFangSC-Semibold, PingFang SC;
				font-weight: 600;
				color: #F4F7FF;
				line-height: 66upx;
			}
			.a-i-c {
				margin-left: 40upx;
				margin-top: 20upx;
				width: 390upx;
				height: 42upx;
				font-size: 30upx;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				color: #A8ADB6;
				line-height: 42upx;
			}
		}
		.input {
			margin-top: 40upx;
			.input-name {
				margin: auto;
				text-align:center;
				width: 670upx;
				height: 110upx;
				background: #383D46;
				border-radius: 16upx;
				line-height: 80upx;
				font-size: 30upx;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				color: #7A7F89;
				
			}
			
		}
	    .options {	
				margin-top: 40upx;
				.options-sex {
					
					margin: auto;
					text-align:center;
					width: 670upx;
					height: 110upx;
					background: #383D46;
					border-radius: 16upx;
					line-height: 80upx;
					font-size: 30upx;
					font-family: PingFangSC-Regular, PingFang SC;
					font-weight: 400;
					color: #7A7F89;
				}
			}
			
	}
	


</style>

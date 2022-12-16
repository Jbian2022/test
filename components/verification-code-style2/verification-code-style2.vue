<template>
	<view class="acqui_verification_code">
		<view class="verification_code_continor">
			<view
				v-for="(item, index) in latticeNum"
				:key="index"
				class="verification_code_item"
				
				@tap="latticeFoc(index)"
			>
				<template v-if="inputValues[index]">
					<view v-if="ciphertextSty == 1" class="point"></view>
					<template v-else>
						{{ ciphertextSty == 2 ? '*' : inputValues[index] }}
					</template>
				</template>
			</view>
		</view>
		<div class="input_info"><input :type="inputType" v-model="inputValues" focus :maxlength="latticeNum" @input="inputVal" @blur="blur" @focus="focus" /></div>
	</view>
</template>

<script>
export default {
	props: {
		// 输入框框框的个数
		latticeNum: {
			type: Number,
			default: 4
		},
		// 输入框框框大小
		latticeSize:{
			type:Number,
			default:100
		},
		// 未选中样式
		borderStyle: {
			type: String,
			default: 'border-bottom:1px solid gray;'
		},
		// 选中的样式
		borderCheckStyle: {
			type: String,
			default: 'border: 1px solid red !important;'
		},
		// input类型
		inputType: {
			type: String,
			default: 'number'
		},
		// 失去焦点后是否继续显示，当前所对焦的输入框（样式）
		blurShow: {
			type: Boolean,
			default: false
		},
		// 密文样式  1 圆点样式    2 星号 *  样式   默认为0   无密文
		ciphertextSty: {
			type: Number,
			default: 0
		},
		// 是否允许修改/填写某一个框框的值
		updateOne: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			inputValues: '', //输入的值
			blurShowLocal: true
		};
	},
	mounted() {
		this.blurShowLocal = this.blurShow;
	},
	methods: {
		latticeSty(index){
			let str=this.blurShowLocal && (this.inputValues.length == index || (this.inputValues.length == this.latticeNum && index == this.latticeNum - 1)) ? this.borderCheckStyle : this.borderStyle
			str+=`;width:${this.latticeSize}rpx;height:${this.latticeSize}rpx`
			return str
		},
		// 获取输入框的值
		getValue(){
			return this.inputValues
		},
		/**
		 * 输入框值改变
		 */
		inputVal(e) {
			console.log(e);
			// this.inputValues = e.detail.value;
			this.$emit('inputVerificationChange', this.inputValues);
		},
		// 设置验证码的值
		/**
		 * verificationCodeValue
		 */
		setVerificationCode(verificationCodeValue) {
			if(!verificationCodeValue) return
			this.inputValues = verificationCodeValue;
		},
		/**
		 * 清空验证码的值
		 */
		cleanVal() {
			this.inputValues = '';
		},
		latticeFoc(index) {},
		blur() {
			!this.blurShow ? (this.blurShowLocal = false) : '';
		},
		focus() {
			!this.blurShow ? (this.blurShowLocal = true) : '';
		}
	}
};
</script>

<style lang="less">
.acqui_verification_code {
	position: relative;
	// width: 100vw;
	.verification_code_continor {
		display: flex;
		justify-content: center;
		text-align: center;
		.verification_code_item {
			width: 120upx !important;
			height: 120upx !important;
			background: #383D46;
			border-radius: 16px;
			display: flex;
			align-items: center;
			justify-content: center;
			display: flex;
			border-bottom: none !important;
			font-size: 48upx;
			font-family: SFPro-Semibold, SFPro;
			font-weight: 600;
			color: #F4F7FF;
		}

		.verification_code_item:not(:first-child) {
			margin-left: 50upx;
		}
		.point {
			width: 10rpx;
			height: 10rpx;
			background-color: black;
			border-radius: 200px;
		}
	}

	.input_info {
		width: 100%;
		height: 100%;
		position: absolute;
		top: 0;
		left: 0;
		z-index: 8;
		display: flex;
		justify-content: center;
		opacity: 0;
		& > input {
			width: 80%;
			height: 100%;
		}
	}
}
</style>

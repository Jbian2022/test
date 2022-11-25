<template>
	<view class="update-signature">
		<view class="arrow-left" @click="onClickLeft"><van-icon name="arrow-left" /></view>
		<view class="title">修改签名</view>
		<van-cell-group class="form" inset>
			<van-field class="input" v-model="text" placeholder="请输入签名"/>
		</van-cell-group>
		<view class="footer-button">
			<van-button block>确认</van-button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				text: '健变，从此刻开始'
			}
		},
		methods: {
			onClickLeft(){
				uni.navigateBack()
			},
		}
	}
</script>

<style lang="scss">
page{
	background: #212328;
}
.update-signature{
	.arrow-left{
		height: 88upx;
		display: flex;
		align-items: center;
		padding-left: 30upx;
		.van-icon{
			font-size: 40upx;
			color: #bdc3ce;
		}
	}
	.title{
		padding: 40upx;
		font-size: 48upx;
		font-weight: 600;
		color: #FFFFFF;
		line-height: 66upx;
	}
	.form{
		background: rgba(56, 61, 70,.5);
		border-radius: 24upx;
		.input{
			background: transparent;
			padding: 0 30upx;
		}
	}
	::v-deep.van-field__control{
		height: 122upx;
		background: transparent;
		font-size: 30upx;
		color: #BDC3CE;
		line-height: 122upx;
	}
	.footer-button{
		position: fixed;
		bottom: 68upx;
		left: 0;
		right: 0;
		padding: 0 30upx;
		.van-button{
			background: #454951;
			border-radius: 16upx;
			font-size: 32upx;
			font-weight: 600;
			color: #FFFFFF;
			border: none;
			height: 100upx;
		}
	}
}
</style>

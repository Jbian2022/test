<template>
	<view class="set-up">
		<view class="arrow-left" @click="onClickLeft"><van-icon name="arrow-left" /></view>
		<view class="title">设置</view>
		<view class="form">
			<van-cell title="注销账号" is-link @click="closeAccount"/>
		</view>
		<van-button class="footer-btn" block @click="logout">退出登录</van-button>
	</view>
</template>

<script>
	const login = uniCloud.importObject('login')
	export default {
		data() {
			return {
				
			}
		},
		methods: {
			onClickLeft(){
				uni.navigateBack()
			},
			async closeAccount () {
				// await login.closeAccount();
				this.logout();
			},
			async logout(){
				// await login.logout();
				uni.clearStorage();
				uni.reLaunch({
					url: '/pages/logining/logining'
				});
			}
		}
	}
</script>

<style lang="scss">
page{
	background: #212328;
}
.set-up{
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
		padding: 0 40upx;
		.van-cell{
			height: 122upx;
			background: rgb(56, 61, 70, .5);
			border-radius: 24upx;
			font-size: 30upx;
			font-weight: 400;
			color: #BDC3CE;
			align-items: center;
			padding: 0 30upx;
		}
	}
	.footer-btn{
		position: fixed;
		bottom: 88upx;
		left: 0;
		right: 0;
		background: transparent;
		border: none;
		font-size: 30upx;
		font-weight: 600;
		color: #BDC3CE;
	}
}
</style>

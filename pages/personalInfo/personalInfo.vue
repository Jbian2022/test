<template>
	<view class="personal-info">
		<view class="arrow-left" @click="onClickLeft"><van-icon name="arrow-left" /></view>
		<view class="header">
			<view class="user-name">王教练</view>
			<view class="user-logo">
				<van-image class="img" round src="https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg"/>
			</view>
		</view>
		<view class="form">
			<view class="form-content">
				<van-cell title="性别" value="男" is-link />
				<van-cell title="签名" value="蜕变，从此刻开始" is-link @click="updateSignature"/>
			</view>
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
			onClickLeft(){
				uni.navigateBack()
			},
			updateSignature(){
				uni.navigateTo({
					url: '/pages/updateSignature/updateSignature'
				});
			}
		}
	}
</script>

<style lang="scss">
page{
	background: #212328;
}
.personal-info{
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
	.header{
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 40upx 60upx 40upx 40upx;
		.user-name{
			font-size: 48upx;
			font-weight: 600;
			color: #FFFFFF;
			&::after{
				margin-left: 20upx;
				content: '';
				width: 32upx;
				height: 32upx;
				display: inline-block;
				background-image: url('../../static/newWorkout/edit.png');
				background-size: contain;
			}
		}
		.user-logo{
			.img{
				width: 120upx;
				height: 120upx;
			}
		}
	}
	.form{
		padding: 0 40upx;
		.form-content{
			background: rgba(56, 61, 70, .5);;
			border-radius: 24upx;
			overflow: hidden;
			.van-cell {
				height: 112upx;
				background: transparent;
				align-items: center;
				::v-deep.van-cell__title{
					font-size: 30upx;
					color: #BDC3CE;
				}
				::v-deep.van-cell__value{
					font-size: 30upx;
					color: #BDC3CE;
				}
				::v-deep.van-icon{
					color: #bdc3ce;
				}
				&:after{
					border: none;
				}
			}
		}
	}
}
</style>

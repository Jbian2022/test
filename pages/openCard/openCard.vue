<template>
	<view class="open-card">
		<view class="background"></view>
		<van-nav-bar title="开通金卡教练" left-text="" left-arrow @click-left="onClickLeft"/>
		<view class="vip-card">
			<view class="left">
				<view class="card-name">金卡教练</view>
				<view class="card-des">包年更划算哦～</view>
			</view>
			<view class="right"></view>
		</view>
		<view class="vip-title">开卡限时优惠</view>
		<view class="card-types-box">
			<view class="card-types">
				<view v-for="i in 4" :key="i" class="type-item">
					<view class="text">连续包月</view>
					<view class="money">¥<text class="num">10</text></view>
					<view class="des">次月续费20元</view>
					<div class="activity">新用户特惠</div>
				</view>
			</view>
		</view>
		<view class="vip-title">金卡会员权益</view>
		<view class="equity-list">
			<view v-for="j in 8" :key="j" class="equity-item">
				<van-image class="logo" src="../../static/newWorkout/equity.svg"/>
				<view class="des">金卡权益</view>
			</view>
		</view>
		<view class="footer-button">
			<van-button block @click="show=true">立即开通</van-button>
		</view>
		<van-action-sheet v-model:show="show">
			<view class="vip-title">开通金卡教练</view>
			<view class="card-types-box">
				<view class="card-types">
					<view v-for="i in 4" :key="i" class="type-item" :class="{active:i===1}">
						<view class="text">连续包月</view>
						<view class="money">¥<text class="num">10</text></view>
						<view class="des">次月续费20元</view>
						<div class="activity">新用户特惠</div>
					</view>
				</view>
			</view>
			<view class="open-card-btn">
				<van-button block @click="show=false,showPayment=true">立即开通</van-button>
			</view>
		</van-action-sheet>
		<van-action-sheet class="payment-action-sheet" v-model:show="showPayment">
			<view class="title">选择支付方式</view>
			<view class="actions">
				<view class="action">
					<van-image class="img" src="../../static/newWorkout/alipay.svg"/>
					<view class="text">支付宝</view>
				</view>
				<view class="action">
					<van-image class="img" src="../../static/newWorkout/weichat.svg"/>
					<view class="text">微信</view>
				</view>
			</view>
		</van-action-sheet>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				show:false,
				showPayment: false
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
.open-card{
	position: relative;
	padding-bottom: 170upx;
	.background{
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		min-height: 100vh;
		height: 100%;
		background-color: #212328;
		background-image: url('../../static/newWorkout/open-card-bg.png');
		background-repeat: no-repeat;
		background-size: contain;
		z-index: -1;
	}
	::v-deep .van-nav-bar{
		background: transparent;
		height: 88upx;
		.van-nav-bar__content{
			height: 88upx;
		}
		.van-nav-bar__title{
			font-weight: 500;
			color: #FFFFFF;
			font-size: 30upx;
		}
		.van-icon-arrow-left{
			color: #eff3fc;
			font-size: 30upx;
		}
		&:after{
			border: none;
		}
	}
	.vip-card{
		display: flex;
		justify-content: space-between;
		width: 670upx;
		height: 300upx;
		margin: 40upx auto;
		background-image: url('../../static/newWorkout/open-card-vip-bg.png');
		background-size: contain;
		background-repeat: no-repeat;
		.left{
			padding-top: 40upx;
			padding-left: 40upx;
			.card-name{
				font-size: 52upx;
				color: #93653C;
				line-height: 72upx;
				text-shadow: 0px 2px 2px rgba(48,29,10,0.4);
				margin-bottom: 80upx;
				font-weight: bold;
			}
			.card-des{
				font-size: 26upx;
				font-weight: 400;
				color: #90633A;
			}
		}
		.right{
			width: 260upx;
			height: 260upx;
			background: url('../../static/newWorkout/vip-logo.png');
			background-size: 160upx 160upx;
			background-repeat: no-repeat;
			background-position: center;
		}
	}
	.vip-title{
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 32upx;
		color: #FFE18F;
		line-height: 46upx;
		font-weight: bold;
		margin: 40upx 0;
		&::before{
			content: '';
			width: 80upx;
			height: 22upx;
			background-image: url('../../static/newWorkout/vip-card-title-bg.png');
			background-size: contain;
			background-repeat: no-repeat;
			margin-right: 20upx;
		}
		&::after{
			content: '';
			width: 80upx;
			height: 22upx;
			background-image: url('../../static/newWorkout/vip-card-title-bg.png');
			background-size: contain;
			background-repeat: no-repeat;
			transform: rotateY(180deg);
			margin-left: 20upx;
		}
	}
	.card-types-box{
		width: 100%;
		overflow: auto;
	}
	.card-types{
		display: flex;
		.type-item{
			flex-shrink: 0;
			width: 230upx;
			height: 280upx;
			background: rgba(56, 61, 70, .2);
			border-radius: 24upx;
			border: 2upx solid rgba(122, 127, 137, .2);
			margin-left: 30upx;
			padding: 30upx;
			box-sizing: border-box;
			text-align: center;
			.text{
				font-size: 28upx;
				color: #F4F7FF;
				font-weight: bold;
			}
			.money{
				margin-top: 10upx;
				font-size: 28upx;
				font-weight: bold;
				color: #FFE18F;
				.num{
					font-size: 56upx;
				}
			}
			.des{
				font-size: 20upx;
				color: #BDC3CE;
				margin-bottom: 22upx;
			}
			.activity{
				font-size: 22upx;
				font-weight: 500;
				color: #90633A;
				background: linear-gradient(173deg, #FFF3D3 0%, #FFE6A1 100%);
				border-radius: 20upx;
				padding: 8upx 16upx;
			}
			&.active{
				background: linear-gradient(180deg, #FFECB8 0%, #383D46 65%);
				border: 2upx solid #ffe6a1;
				overflow: hidden;
			}
		}
	}
	.equity-list{
		margin-top: 20upx;
		margin-bottom: 70upx;
		display: flex;
		flex-wrap: wrap;
		padding: 0 72upx;
		.equity-item{
			width: 25%;
			text-align: center;
			margin-bottom: 30upx;
			.logo{
				width: 90upx;
				height: 90upx;
			}
			.des{
				margin-top: 10upx;
				font-size: 24upx;
				color: #D1BA7D;
				line-height: 34upx;
			}
		}
	}
	.footer-button{
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		z-index: 1;
		padding: 0 40upx;
		padding-bottom: 68upx;
		.van-button{
			background: linear-gradient(176deg, #5F6571 0%, #373C46 100%);
			border-radius: 16upx;
			border: 2upx solid;
			border-image: linear-gradient(179deg, rgba(198, 198, 198, 1), rgba(71, 77, 88, 1)) 2 2;
			border: none;
			font-size: 32upx;
			font-weight: 600;
			color: #FFE18F;
		}
	}
	::v-deep .van-popup{
		background: #383D46;
		border-radius: 24upx 24upx 0px 0px;
	}
	.open-card-btn{
		margin-top: 60upx;
		padding: 0 40upx;
		padding-bottom: 68upx;
		.van-button{
			background: linear-gradient(150deg, #FFF1C9 0%, #FFE5A1 100%);
			border-radius: 16upx;
			border: 2upx solid;
			border-image: linear-gradient(180deg, rgba(255, 251, 239, 1), rgba(185, 133, 80, 1)) 2 2;
			border: none;
			font-size: 32upx;
			font-weight: 600;
			color: #90633A;
		}
	}
	.payment-action-sheet{
		.title{
			padding:40upx;
			padding-bottom: 80upx;
			font-size: 36upx;
			font-weight: 600;
			color: #F4F7FF;
		}
		.actions{
			display: flex;
			justify-content: space-between;
			padding: 0 148upx 148upx;
			.action{
				.img{
					width: 100upx;
					height: 100upx;
				}
				.text{
					text-align: center;
					margin-top: 20upx;
					font-size: 28upx;
					color: #F4F7FF;
				}
			}
		}
	}
}
</style>
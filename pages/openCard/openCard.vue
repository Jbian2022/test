<template>
	<view class="open-card">
		<view class="status_bar">
            <!-- 这里是状态栏 -->
        </view>
		<view class="background"></view>
		<van-nav-bar title="开通金卡教练" left-text="" left-arrow @click-left="onClickLeft"/>
		<view class="vip-card">
			<view class="left">
				<view class="card-info">
					<view class="user-logo">
						<van-image round :src="userInfo.avatar"/>
					</view>
					<view class="card-name">金卡教练</view>
					<view class="card-status" v-if="userInfo.vipLevel">{{userInfo.vipEndDate?'生效中':'失效中'}}</view>
				</view>
				<view class="card-des">{{userInfo.vipEndDate?userInfo.vipEndDate:'立即续费金卡教练，畅享多项特权~'}}</view>
			</view>
			<view class="right"></view>
		</view>
		<view class="vip-title">开通金卡教练</view>
		<view class="card-types-box">
			<view class="card-types">
				<view v-for="(item,index) in cardList" :key="index" class="type-item-box">
					<view class="type-item" :class="{active:item.active}" @click="selectCard(item)">
						<view class="hot-msg">{{item.hotMsg}}</view>
						<view class="text">{{item.text}}</view>
						<view class="money">¥<text class="num">{{item.money}}</text></view>
						<view class="des">{{item.des}}{{item.unit}}</view>
						<div class="activity">{{item.activity}}</div>
					</view>
				</view>
			</view>
		</view>
		<view class="vip-title">金卡教练权益</view>
		<view class="equity-box">
			<view class="equity-list">
				<view class="equity-item">
					<view class="logo"></view>
					<view class="des">金卡权益</view>
				</view>
				<view class="equity-item">
					<view class="logo"></view>
					<view class="des">金卡权益</view>
				</view>
				<view class="equity-item">
					<view class="logo"></view>
					<view class="des">金卡权益</view>
				</view>
				<view class="equity-item">
					<view class="logo"></view>
					<view class="des">金卡权益</view>
				</view>
				<view class="equity-item">
					<view class="logo"></view>
					<view class="des">金卡权益</view>
				</view>
				<view class="equity-item">
					<view class="logo"></view>
					<view class="des">金卡权益</view>
				</view>
			</view>
		</view>
		<view class="footer-button">
			<view class="text-box">
				<view class="yuan">已省￥{{hotInfo.text1}}</view>
				<view class="des">{{hotInfo.text2}}</view>
			</view>
			<van-button block @click="show=true">确认开通并支付￥{{payMoney}}元</van-button>
		</view>
		<van-action-sheet class="payment-action-sheet" v-model:show="show">
			<view class="title">选择支付方式</view>
			<view class="actions">
				<view class="action">
					<van-image class="img" src="https://mp-4e6f1c48-a4dc-4897-a866-0a1a071023c3.cdn.bspapp.com/cloudstorage/92897c24-96a3-4bb2-8fb8-44019822af77.svg"/>
					<view class="text">支付宝</view>
				</view>
				<view class="action">
					<van-image class="img" src="https://mp-4e6f1c48-a4dc-4897-a866-0a1a071023c3.cdn.bspapp.com/cloudstorage/ca311552-a492-4e14-b884-cefd7a6cb712.svg"/>
					<view class="text">微信</view>
				</view>
			</view>
		</van-action-sheet>
	</view>
</template>

<script>
	const My = uniCloud.importObject('my',{ customuI: true })
	export default {
		data() {
			return {
				show:false,
				showPayment: false,
				userInfo:{
					avatar: null,
					vipLevel: null
				},
				cardList:[
					{
						hotMsg: '每天1元钱',
						text: '年卡',
						money: '365',
						des: '468',
						unit: '元/年',
						activity: '无限会员数',
						active: true
					},
					{
						hotMsg: '立省60元',
						text: '三个月',
						money: '158',
						des: '218',
						unit: '元/季度',
						activity: '限100个会员',
						active: false
					},
					{
						hotMsg: '立省20元',
						text: '月卡',
						money: '78',
						des: '98',
						unit: '元/月',
						activity: '限30个会员',
						active: false
					}
				],
				hotInfo:{
					text1 : '103',
					text2: '468元/年'
				},
				payMoney: '365'
			}
		},
		onShow(){
			this.getUserInfo()
		},
		methods: {
			async getUserInfo(){
				const res = await My.getUserInfo()
				const {avatar,username,comment,vipLevel,vipEndDate} = res.data
				this.userInfo = {
					avatar:avatar||null,
					username:username||null,
					comment:comment||null,
					vipLevel:vipLevel||null,
					vipEndDate:vipEndDate||null
				}
				console.log(res,88888)
			},
			selectCard(item){
				this.cardList.forEach(element => element.active = false)
				item.active = true
				this.hotInfo.text1 = +item.des - +item.money
				this.hotInfo.text2 = item.des + item.unit
				this.payMoney = item.money
			},
			onClickLeft(){
				uni.switchTab({
					url: '/pages/my/my'
				});
			},
		}
	}
</script>

<style lang="scss">
.status_bar {
	height: var(--status-bar-height);
	width: 100%;
}
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
		position: relative;
		.left{
			padding-top: 40upx;
			padding-left: 40upx;
			.card-info{
				display: flex;
				align-items: center;
				.user-logo{
					.van-image{
						width: 80upx;
						height: 80upx;
					}
				}
				.card-name{
					margin-left: 20upx;
					font-size: 48upx;
					color: #93653C;
					line-height: 68upx;
					font-weight: 600;
				}
				.card-status{
					margin-left: 15upx;
					font-size: 2upx;
					background: #FFF0C0;
					border-radius: 20upx;
					padding: 4upx 10upx;
					font-weight: 600;
					color: #95673D;
				}
			}
			.card-des{
				margin-top: 85upx;
				font-size: 26upx;
				font-weight: 400;
				color: #90633A;
			}
		}
		.right{
			position: absolute;
			right: -30upx;
			top: 0;
			z-index: 0;
			width: 260upx;
			height: 260upx;
			background: url('../../static/newWorkout/open-card-vip.png');
			background-size: 180upx 180upx;
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
		// overflow: auto;
	}
	.card-types{
		display: flex;
		padding: 0 20upx;
		.type-item-box{
			flex-shrink: 0;
			width: 33.333%;
			padding: 0 10upx;
			box-sizing: border-box;
		}
		.type-item{
			height: 300upx;
			background: rgba(56, 61, 70, .2);
			border-radius: 16px;
			border: 2upx solid rgba(122, 127, 137, .2);
			box-sizing: border-box;
			text-align: center;
			position: relative;
			.hot-msg{
				position: absolute;
				top: -8upx;
				left: -2upx;
				width: 130upx;
				height: 44upx;
				line-height: 44upx;
				background: linear-gradient(173deg, #FFF3D3 0%, #FFE6A1 100%);
				border-radius: 16upx 4upx 16upx 4upx;
				color: #90633A;
				font-size: 24upx;
			}
			.text{
				margin-top: 52upx;
				font-size: 28upx;
				color: #F4F7FF;
				font-weight: bold;
			}
			.money{
				margin-top: 12upx;
				font-size: 28upx;
				font-weight: bold;
				color: #FFE18F;
				.num{
					font-size: 52upx;
				}
			}
			.des{
				margin-top: 10upx;
				font-size: 20upx;
				color: #BDC3CE;
				text-decoration:line-through;
				margin-bottom: 22upx;
			}
			.activity{
				font-size: 26upx;
				font-weight: 500;
				color: #FFE18F;
			}
			&.active{
				background: linear-gradient(180deg, #645F52 0%, #292C31 100%);
				border: 2upx solid #ffe6a1;
			}
		}
	}
	.equity-box{
		margin-top: 40upx;
		margin-bottom: 20upx;
		padding: 0 30upx;
	}
	.equity-list{
		display: flex;
		flex-wrap: wrap;
		padding: 36upx;
		padding-bottom: 26upx;
		background: rgba(56, 61, 70, .2);;
		border-radius: 16upx;
		border: 2upx solid rgba(122, 127, 137, .2);
		.equity-item{
			width: 33%;
			text-align: center;
			margin-bottom: 30upx;
			.logo{
				margin: 0 auto;
				width: 100upx;
				height: 100upx;
				background: linear-gradient(180deg, #69707C 0%, #383D46 100%);
				border-radius: 100%;
				background-image: url('../../static/newWorkout/equity2.svg');
				background-size: contain;
				background-repeat: no-repeat;
			}
			.des{
				margin-top: 10upx;
				font-size: 24upx;
				font-weight: 400;
				color: #BDC3CE;
				line-height: 34upx;
			}
			&:nth-child(2) .logo {
				background-image: url('../../static/newWorkout/equity1.svg');
			}
			&:nth-child(3) .logo {
				background-image: url('../../static/newWorkout/equity3.svg');
			}
			&:nth-child(4) .logo {
				background-image: url('../../static/newWorkout/equity4.svg');
			}
			&:nth-child(5) .logo {
				background-image: url('../../static/newWorkout/equity5.svg');
			}
			&:nth-child(6) .logo {
				background-image: url('../../static/newWorkout/equity6.svg');
			}
		}
	}
	.footer-button{
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		z-index: 1;
		padding: 0 30upx;
		padding-top: 20upx;
		padding-bottom: 60upx;
		background-color: #212328;
		display: flex;
		justify-content: space-between;
		.text-box{
			text-align: center;
			margin-right: 44upx;
			width: 160upx;
			.yuan{
				font-size: 32upx;
				font-weight: 600;
				color: #FFE18F;
				line-height: 44upx;
			}
			.des{
				margin-top: 10upx;
				font-size: 24upx;
				font-weight: 400;
				color: #BDC3CE;
				line-height: 28upx;
				text-decoration:line-through;
			}
		}
		.van-button{
			width: 485upx;
			height: 90upx;
			background: linear-gradient(173deg, #FFF3D3 0%, #FFE6A1 100%);
			border-radius: 16upx;
			color: #90633A;
			font-weight: 600;
			border: none;
			font-size: 32upx;
		}
	}
	::v-deep .van-popup{
		background: #383D46;
		border-radius: 24upx 24upx 0 0;
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
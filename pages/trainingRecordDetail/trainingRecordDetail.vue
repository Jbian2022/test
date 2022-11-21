<template>
	<view class="training-record-detail">
		<view class="backgroud-img"><van-image  src="../../static/newWorkout/training-record-bg.png"/></view>
		<view class="arrow-left" @click="onClickLeft"><van-icon name="arrow-left" /></view>
		<view class="first-title-times">
			<view class="title">腿背胸肩超级组</view>
			<view class="times">10.04</view>
		</view>
		<view class="second-title-day">
			<view class="title">总负荷量：100kg</view>
			<view class="day">星期三</view>
		</view>
		<view class="info-list">
			<view v-for="j in 3" :key="j" class="info-item">
				<view class="item-header">
					<view class="img">
						<van-image round src="https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg"/>
					</view>
					<view class="des-info">
						<view class="des-title">杠铃卧推</view>
						<view class="info-text">总次数：20次</view>
					</view>
				</view>
				<view class="detailed-data">
					<view v-for="i in 3" :key="i" class="data-item">
						<view class="index">1</view>
						<view class="data-info">
							<view class="kg">
								<text class="num">10</text>
								<text>kg</text>
							</view>
							<view class="x">
								x
							</view>
							<view class="time">
								<text class="num">10</text>
								<text>次</text>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="footer-button">
			<van-button block @click="showShare=true"><van-icon name="share-o" />炫耀一下</van-button>
		</view>
		<van-share-sheet
			v-model:show="showShare"
			:options="options"
			@select="onSelect"
			cancel-text=""
		/>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				showShare: false,
				options: [
					{ name: '分享到微信', icon: '../../static/newWorkout/wechat.png' },
					{ name: '分享到朋友圈', icon: '../../static/newWorkout/pengyou.png' },
					{ name: '保存到相册', icon: '../../static/newWorkout/download.png' }
				]
			}
		},
		methods: {
			onClickLeft(){
				uni.navigateBack()
			},
			onSelect(option) {
				this.showShare = false
			}
		}
	}
</script>

<style lang="scss" >
	.training-record-detail{
		position: relative;
		min-height: 100vh;
		padding-bottom: 60upx;
		.backgroud-img{
			position: absolute;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			z-index: -1;
			background: #212328;
		}
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
		.first-title-times{
			padding: 10upx 30upx;
			display: flex;
			justify-content: space-between;
			.title{
				font-size: 60upx;
				color: #F4F7FF;
				line-height: 84upx;
			}
			.times{
				font-size: 48upx;
				font-weight: bold;
				color: #F4F7FF;
				line-height: 58upx;
			}
		}
		.second-title-day{
			padding: 0 30upx;
			display: flex;
			justify-content: space-between;
			.title{
				font-size: 30upx;
				font-weight: 600;
				color: #F4F7FF;
				line-height: 42upx;
			}
			.day{
				font-size: 24upx;
				font-weight: 400;
				color: #BDC3CE;
				line-height: 34upx;
			}
		}
		.info-list{
			padding: 0 30upx;
			.info-item{
				margin-top: 30upx;
				padding: 40upx;
				background: #383D46;
				border-radius: 24upx;
				.item-header{
					position: relative;
					display: flex;
					.img{
						.van-image{
							width: 100upx;
							height: 100upx;
							background: #C7C9CC;
						}
					}
					.des-info{
						margin-left: 30upx;
						.des-title{
							font-size: 30upx;
							font-weight: 600;
							color: #F4F7FF;
							line-height: 42upx;
							margin-bottom: 14upx;
						}
						.info-text{
							font-size: 26upx;
							font-weight: 400;
							color: #BDC3CE;
							line-height: 36upx;
						}
					}
				}
				.detailed-data{
					.data-item{
						margin-top: 20upx;
						display: flex;
						align-items: center;
						.index{
							font-size: 36upx;
							font-weight: 500;
							color: #BDC3CE;
							width: 80upx;
							text-align: center;
						}
						.data-info{
							display: flex;
							justify-content: space-around;
							align-items: center;
							width: 530upx;
							height: 80upx;
							border-radius: 16upx;
							background: rgb(75, 82, 94, .5);
							font-size: 26upx;
							color: #BDC3CE;
							.num{
								margin-right: 10upx;
								font-size: 36upx;
								font-weight: 500;
								color: #F4F7FF;
							}
						}
					}
				}
			}
		}
		.footer-button{
			padding: 30upx;
			.van-button{
				background: #1370FF;
				border-radius: 16upx;
				border: none;
				font-size: 32upx;
				font-weight: 600;
				color: #FFFFFF;
				.van-icon{
					margin-right: 16upx;
				}
			}
		}
		::v-deep.van-popup {
			background: #383D46;
			border-radius: 24upx 24upx 0px 0px;
		}
		::v-deep.van-share-sheet__options{
			justify-content: space-around;
			.van-share-sheet__name{
				font-size: 28upx;
				font-weight: 400;
				color: #F4F7FF;
				line-height: 40tpx;
			}
		}
	}
</style>

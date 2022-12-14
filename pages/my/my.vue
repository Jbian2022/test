<template>
	<view class="my">
		<view class="status_bar">
            <!-- 这里是状态栏 -->
        </view>
		<view class="background"></view>
		<view class="header">
			<view class="logo" @click="personalInfo">
				<van-image round :src="userInfo.avatar"/>
				<view class="edit-icon"></view>
			</view>
			<view class="user-name">
				<view class="name" :class="{ordinary:userInfo.vipLevel===2}">{{userInfo.username}}</view>
				<view class="des">{{userInfo.comment}}</view>
			</view>
			<view class="config" @click="setUp"></view>
		</view>
		<view v-if="userInfo.vipLevel===2" class="vip-info" @click="openCard">
			<view class="left">
				<view class="vip-grade">
					<view class="grade-name">金卡教练</view>
					<view class="grade-status">生效中</view>
				</view>
				<view class="vip-expiration-date">2023.01.20到期 ></view>
			</view>
			<view class="right"></view>
		</view>
		<view v-else class="vip-info ordinary" @click="openCard">
			<view class="left">
				<view class="vip-grade">
					<view class="grade-name">蓝卡会员</view>
				</view>
				<view class="vip-expiration-date">开通金卡教练，畅想多项特权 ></view>
			</view>
			<view class="right"></view>
		</view>
		<view class="contact-customer">
			<view class="title">联系客服</view>
			<view class="customer-info">
				<view class="customer-item" @click="copyText('1234567890')">
					<text>客服微信：1234567890</text>
					<text>复制</text>
				</view>
				<view class="customer-item" @click="copyText('Kingtran12@aliyun.com')">
					<text>客服邮箱：Kingtran12@aliyun.com</text>
					<text>复制</text>
				</view>
			</view>
		</view>
		<view class="recommend">
			<van-cell icon="contact" title="推荐人" is-link :value="referrer" @click="show = true" />
		</view>
		<van-action-sheet class="recommend-sheet" v-model:show="show">
			<van-picker title="推荐人" :columns="columns" @confirm="onConfirm" @cancel="show = false"/>
		</van-action-sheet>
	</view>
</template>

<script>
	const My = uniCloud.importObject('my')
	export default {
		data() {
			return {
				userInfo: {
					username: '',
					avatar: null,
					comment: null,
					vipLevel: null,
					vipEndDate: null,
				},
				referrer: null,
				show: false,
				columns: [
					{ text: '杭州', value: 'Hangzhou' },
					{ text: '宁波', value: 'Ningbo' },
					{ text: '温州', value: 'Wenzhou' },
					{ text: '绍兴', value: 'Shaoxing' },
					{ text: '湖州', value: 'Huzhou' },
				]
			}
		},
		onShow () {
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
			openCard(){
				uni.navigateTo({
					url: '/pages/openCard/openCard'
				});
			},
			setUp(){
				uni.navigateTo({
					url: '/pages/setUp/setUp'
				});
			},
			personalInfo(){
				uni.navigateTo({
					url: '/pages/personalInfo/personalInfo'
				});
			},
			copyText(text){
				uni.setClipboardData({
					data: text,
					success: function () {
						console.log('success');
						uni.showToast({
							title: '复制成功',
							duration: 2000
						});
					}
				});
			},
			onConfirm(val){
				this.referrer = val.text
				this.show = false
			}
		}
	}
</script>

<style lang="scss">
.status_bar {
	height: var(--status-bar-height);
	width: 100%;
}
page{
	background: #212328;
}
.my{
	position: relative;
	padding: 80upx 40upx 0;
	.header{
		display: flex;
		position: relative;
		.logo{
			position: relative;
			.van-image{
				width: 110upx;
				height: 110upx;
			}
			.edit-icon{
				position: absolute;
				bottom: 10upx;
				right: 0;
				background-image: url('../../static/newWorkout/edit.png');
				width: 28upx;
				height: 28upx;
				background-size: contain;
			}
		}
		.user-name{
			margin-left: 30upx;
			.name{
				
				font-size: 40upx;
				font-weight: 600;
				color: #FFFFFF;
				line-height: 56upx;
				&.ordinary{
					&::after{
						content: '';
						display: inline-block;
						width: 32upx;
						height: 32upx;
						margin-left: 10upx;
						background: url('../../static/newWorkout/vip.png');
						background-size: contain;
					}
				}
			}
			.des{
				margin-top: 10upx;
				font-size: 28upx;
				font-weight: 400;
				color: #BDC3CE;
				line-height: 40upx;
			}
		}
		.config{
			position: absolute;
			right: 40upx;
			top: 0upx;
			width: 44upx;
			height: 44upx;
			background: url('../../static/newWorkout/config.png');
			background-size: contain;
		}
	}
	.vip-info{
		margin-top: 58upx;
		display: flex;
		background: linear-gradient(172deg, #5F6571 0%, #333842 100%);
		border-radius: 36upx;
		border: 2upx solid;
		justify-content: space-between;
		.left{
			padding-left: 40upx;
			box-sizing: border-box;
			.vip-grade{
				display: flex;
				align-items: center;
				margin-top: 42upx;
				margin-bottom: 92upx;
				.grade-name{
					font-size: 40upx;
					color: #FFE59E;
					font-weight: 600;
				}
				.grade-status{
					margin-left: 20upx;
					padding: 4upx 14upx;
					background: #4B525E;
					border-radius: 8upx;
					font-size: 24upx;
					font-weight: 600;
					color: #BDC3CE;
				}
			}
			.vip-expiration-date{
				font-size: 26upx;
				font-weight: 400;
				color: #7A7F89;
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
		&.ordinary{
			background: linear-gradient(172deg, #5C9CFF 0%, #1370FF 100%);
			.left{
				.grade-name{
					color: #FFFFFF;
				}
				.vip-expiration-date{
					color: #FFFFFF;
				}
			}
			.right{
				width: 260upx;
				height: 260upx;
				background: url('../../static/newWorkout/ordinary.png');
				background-repeat: no-repeat;
				background-position: center;
			}
		}
	}
	.contact-customer{
		margin-top: 30upx;
		width: 670upx;
		height: 346upx;
		padding: 40upx;
		box-sizing: border-box;
		background: rgba(56, 61, 70, .6);
		border-radius: 24upx;
		.title{
			font-size: 30upx;
			font-weight: 600;
			color: #F4F7FF;
			line-height: 42upx;
		}
		.customer-info{
			.customer-item{
				margin-top: 20upx;
				display: flex;
				justify-content: space-between;
				align-items: center;
				background: #4B525E;
				height: 90upx;
				border-radius: 16upx;
				padding: 0 30upx;
				font-size: 26upx;
				font-weight: 400;
				color: #BDC3CE;
				cursor: pointer;
			}
		}
	}
	.recommend{
		margin-top: 30upx;
		.van-cell {
			background: rgba(56, 61, 70, .6);
			border-radius: 24upx;
			height: 120upx;
			align-items: center;
			color: #BDC3CE;
			font-size: 30upx;
			::v-deep .van-cell__value{
				color: #BDC3CE;
				font-size: 30upx;
			}
			::v-deep .van-icon{
				color: #BDC3CE;
				font-size: 30upx;
			}
		}
	}
	::v-deep .recommend-sheet{
		background: #383D46;
		.van-picker{
			background-color: transparent;
			.van-picker__mask{
				background-image: none;
			}
			.van-picker__cancel{
				font-size: 32upx;
				font-weight: 600;
				color: #7A7F89;
				line-height: 44upx;
			}
			.van-picker__confirm{
				font-size: 32upx;
				font-weight: 600;
				color: #F4F7FF;
				line-height: 44upx;
			}
			.van-picker__title{
				font-size: 32upx;
				font-weight: 600;
				color: #F4F7FF;
				line-height: 44upx;
			}
			.van-picker-column__item{
				font-size: 30upx;
				color: #959aa2;
			}
			.van-picker-column__item--selected{
				font-weight: 600;
				color: #F4F7FF;
			}
			.van-picker__frame{
				background: rgba(75, 82, 94, .5);
				border-radius: 16upx;
				z-index: -1;
				&::after{
					display: none;
				}
			}
		}
	}
}
</style>

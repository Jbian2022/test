<template>
	<view class="my">
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
			<text>联系客服</text>
		</view>
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
				}
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
			}
		}
	}
</script>

<style lang="scss">
page{
	background: #212328;
}
.my{
	position: relative;
	padding: 80upx 40upx 0;
	.header{
		display: flex;
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
			top: 80upx;
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
		margin-top: 40upx;
		display: flex;
		align-items: center;
		&::before{
			content: '';
			display: inline-block;
			width: 36upx;
			height: 36upx;
			background: url('../../static/newWorkout/phone.png');
			background-size: contain;
			margin-right: 20upx;
		}
		font-size: 30upx;
		font-weight: 400;
		color: #BDC3CE;
		background: rgba(56, 61, 70, .6);
		height: 120upx;
		line-height: 120upx;
		border-radius: 24upx;
		padding: 0 40upx;
	}
}
</style>

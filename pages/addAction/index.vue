<template>
	<view class="add-action">
		<van-nav-bar title="新增动作" left-text="" left-arrow @click-left="onClickLeft"/>
		<view class="form">
			<input class="uni-input" placeholder="请输入动作名称" />
			<van-cell is-link title="基础用法" value="力量训练" @click="show = true" />
		</view>
		<view class="footer-button">
			<van-button type="primary" block>保存</van-button>
		</view>
		<van-action-sheet v-model:show="show" title="选择动作类型">
			<view class="action-type-item active">
				<view class="title">力量训练</view>
				<view class="des">力量训练的类型，可以为自定义动作提供记录次数和重量，其中重量的单位只能为公斤（kg）和磅（lbs）</view>
			</view>
			<view class="action-type-item">
				<view class="title">力量训练</view>
				<view class="des">力量训练的类型，可以为自定义动作提供记录次数和重量，其中重量的单位只能为公斤（kg）和磅（lbs）</view>
			</view>
		</van-action-sheet>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				show:false,
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
	.add-action{
		::v-deep.van-nav-bar{
			background: #212328;
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
		.form{
			padding: 30upx;
			.uni-input{
				height: 108upx;
				background: #383D46;
				border-radius: 16upx;
				font-weight: 400;
				color: #eff3fc;
				padding-left: 40upx;
				&::placeholder{
					color: #7A7F89;
				}
			}
			.van-cell{
				margin-top: 32upx;
				height: 108upx;
				background: #383D46;
				border-radius: 16upx;
				font-weight: 400;
				color: #F4F7FF;
				align-items: center;
				padding: 0 40upx;
				::v-deep.van-cell__value{
					font-size: 30upx;
					font-weight: 400;
					color: #F4F7FF;
					line-height: 42upx;
				}
				:v-deep.van-icon{
					color: #cccccc;
					font-size: 14upx;
				}
			}
		}
		.footer-button{
			position: fixed;
			padding: 68upx 30upx;
			bottom: 0;
			left: 0;
			right: 0;
			z-index: 1;
			.van-button{
				background: #1370FF;
				border-radius: 16upx;
				height: 100upx;
				font-size: 32upx;
				font-weight: 600;
				color: #FFFFFF;
			}
		}
		::v-deep.van-action-sheet__header{
			text-align: left;
			font-size: 36upx;
			font-weight: 600;
			color: #F4F7FF;
			line-height: normal;
			padding: 40upx;
			& .van-icon{
				top: 40upx;
				right: 40upx;
				/* width: 50upx;
				height: 50upx; */
				border-radius: 50%;
				background: #4B525E;
				font-size: 14upx;
				padding: 18upx;
			}
		}
		::v-deep.van-popup{
			background: #383D46;
			border-radius: 24px 24px 0px 0px;
		}
		::v-deep.van-action-sheet__content{
			padding: 0 40upx;
		}
		.action-type-item{
			background: #4B525E;
			border-radius: 16upx;
			padding: 30upx 40upx;
			.title{
				font-size: 36upx;
				font-weight: 600;
				color: #F4F7FF;
				margin-bottom: 30upx;
			}
			.des{
				font-size: 24upx;
				font-weight: 400;
				color: #F4F7FF;
				line-height: 34upx;
			}
			&.active{
				background: #1370FF;
			}
			& + .action-type-item{
				margin-top: 30upx;
			}
			&:last-child{
				margin-bottom: 30upx;
			}
		}
	}
</style>

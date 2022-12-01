<template>
	<view class="new-workout">
		<view class="header">
			<view class="title">新建训练</view>
			<van-button class="btn" @click="showFinishDialog = true">完成</van-button>
		</view>
		<view class="workout-title">
			<view class="text">胸背训练</view>
		</view>
		<view class="action-list">
			<view v-for="i in 3" :key="i" class="action-tiem">
				<view class="action-tiem-header">
					<view class="img">
						<van-image round src="https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg"/>
					</view>
					<view class="des-info">
						<view class="des-title">杠铃卧推</view>
						<view class="info-text">已完成：10次</view>
					</view>
					<popover class="config" :list="actions" position="right" mode="click">
						<van-image class="img"  src="../../static/newWorkout/config.png"/>
						<template  v-slot:item="{item}">
							<text v-if="item.text==='删除动作项'" style="color:#F04242;">{{item.text}}</text>
							<text v-else>{{item.text}}</text>
						</template>
					</popover>
				</view>
				<view class="action-tiem-des">
					<view v-for="i in 4" :key="i" class="project-item" :class="{active:i===1}">
						<view class="index">
							<text>{{i}}</text>
						</view>
						<view class="kg">
							<text class="num">10</text>
							<text>kg</text>
						</view>
						<view class="time">
							<text class="num">10</text>
							<text>次</text>
						</view>
						<view class="yes">
							<van-icon name="success" />
						</view>
						<view class="delete">
							<van-image class="img" src="../../static/newWorkout/垃圾桶@2x.png"/>
						</view>
					</view>
					<view class="add-project-item">+ 新增一组</view>
				</view>
			</view>
		</view>
		<view class="footer-button">
			<van-button class="delete" @click="showDeleteDialog=true"><van-image class="img" src="../../static/newWorkout/垃圾桶@2x.png"/></van-button>
			<van-button class="add" @click="addActionHandle">+ 添加动作</van-button>
		</view>
		<van-dialog class="finish-dialog" v-model:show="showFinishDialog" :showConfirmButton="false">
			<view class="first-level-title">删除训练</view>
			<view class="second-level-title">是否删除训练，删除后无法恢复</view>
			<view class="botton-box">
				<van-button class="finish" block @click="finish">确认完成</van-button>
				<van-button block @click="showFinishDialog=false">取消</van-button>
			</view>
		</van-dialog>
		<van-dialog class="delete-dialog" v-model:show="showDeleteDialog" :showConfirmButton="false">
			<view class="first-level-title">删除训练</view>
			<view class="second-level-title">是否删除训练，删除后无法恢复</view>
			<view class="botton-box">
				<van-button class="delete" block>确认删除</van-button>
				<van-button block @click="showDeleteDialog=false">取消</van-button>
			</view>
		</van-dialog>
	</view>
</template>

<script>
	import popover from '../../components/popover/index.vue';
	export default {
		components: {
			popover
		},
		data() {
			return {
				actions: [
					{ text: '删除动作项'}
				],
				showFinishDialog: false,
				showDeleteDialog: false
			}
		},
		methods: {
			addActionHandle(){
				uni.setStorageSync('actionLibraryType', 'select')
				uni.switchTab({
					url: '/pages/actionLibrary/index'
				});
			},
			finish(){
				uni.navigateTo({
					url: '/pages/trainingRecord/trainingRecord'
				});
			}
		}
	}
</script>

<style lang="scss">
page{
	background: #212328;
}
.new-workout{
	padding-bottom: 168upx;
	.header{
		position: sticky;
		top: 0;
		z-index: 88;
		display: flex;
		justify-content: space-between;
		padding: 30upx;
		font-size: 48upx;
		color: #FFFFFF;
		background: #212328;
		.btn{
			width: 120upx;
			height: 68upx;
			background: #1370FF;
			border-radius: 16upx;
			font-size: 30upx;
			font-weight: 600;
			color: #FFFFFF;
			line-height: 42upx;
			border: none;
		}
	}
	.workout-title{
		position: sticky;
		top: 128upx;
		z-index: 88;
		padding: 0 30upx;
		padding-bottom: 15upx;
		background: #212328;
		.text{
			height: 100upx;
			background: #383D46;
			border-radius: 24upx;
			display: flex;
			align-items: center;
			font-size: 30upx;
			font-weight: 400;
			color: #F4F7FF;
			padding-left: 40upx;
		}
	}
	.action-list{
		padding: 30upx;
		padding-top: 15upx;
		.action-tiem{
			padding: 40upx;
			background: #383D46;
			border-radius: 24upx;
			.action-tiem-header{
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
				.config{
					position: absolute;
					right: 0;
					top: 0;
					color: #FFFFFF;
					.img{
						width: 40upx;
						height: 40upx;
					}
				}
			}
			.action-tiem-des{
				margin-top: 50upx;
				.project-item{
					display: flex;
					height: 80upx;
					color: #BDC3CE;
					font-size: 26upx;
					align-items: center;
					&.active{
						.kg,.time,.yes{
							background: #01E08C;
							color: #FFFFFF;
						}
					}
					.index{
						display: flex;
						justify-content: center;
						align-items: center;
						background: #454951;
						height: 100%;
						border-radius: 16upx;
						padding: 0 20upx;
						color: #BDC3CE;
						font-size: 32upx;
						min-width: 60upx;
						box-sizing: border-box;
					}
					.kg,.time{
						height: 100%;
						display: flex;
						justify-content: space-between;
						background: #454951;
						align-items: center;
						border-radius: 16upx;
						margin-left: 24upx;
						padding: 0 20upx;
						width: 140upx;
						box-sizing: border-box;
						.num{
							font-size: 36upx;
							font-weight: 500;
							color: #F4F7FF;
						}
					}
					.yes{
						height: 100%;
						display: flex;
						justify-content: center;
						background: #454951;
						align-items: center;
						border-radius: 16upx;
						margin-left: 24upx;
						padding: 0 20upx;
						width: 100upx;
						color: #F4F7FF;
						box-sizing: border-box;
					}
					.delete{
						flex: 1;
						text-align: right;
						.img{
							width: 40upx;
							height: 40upx;
						}
					}
				}
				.project-item + .project-item{
					margin-top: 20upx;
				}
			}
		}
		.action-tiem + .action-tiem{
			margin-top: 30upx;
		}
		.add-project-item{
			padding-top: 40upx;
			font-size: 30upx;
			font-weight: 500;
			color: #FFFFFF;
			text-align: center;
		}
	}
	.footer-button{
		position: fixed;
		padding: 68upx 30upx;
		padding-top: 30upx;
		bottom: 0;
		left: 0;
		right: 0;
		z-index: 1;
		background: #212328;
		.delete{
			background: #454951;
			height: 100upx;
			width: 100upx;
			border-radius: 100%;
			font-size: 32upx;
			font-weight: 600;
			color: #FFFFFF;
			border: none;
			padding: 0;
			.img{
				width: 40upx;
				height: 40upx;
			}
			&+.van-button{
				margin-left: 20upx;
			}
		}
		.add{
			height: 100upx;
			width: 570upx;
			background: #454951;
			border-radius: 16upx;
			border: none;
			font-size: 32upx;
			font-weight: 600;
			color: #FFFFFF;
		}
	}
	::v-deep.van-dialog{
		background: linear-gradient(180deg, #343A44 0%, #212328 100%);
		width: 610upx;
		height: 800upx;
		.first-level-title{
			padding-left: 70upx;
			padding-top: 64upx;
			font-size: 88upx;
			color: #F4F7FF;
			line-height: 124upx;
		}
		.second-level-title{
			padding-top: 20upx;
			padding-left: 70upx;
			padding-bottom: 310upx;
			font-size: 30upx;
			font-weight: 400;
			color: #BDC3CE;
		}
		.botton-box{
			padding: 0 70upx;
			.van-button{
				border: none;
				background: transparent;
				font-size: 32upx;
				font-weight: 600;
				border-radius: 16upx;
				color: #BDC3CE;
			}
		}
	}
	::v-deep.finish-dialog{
		background-image: url('../../static/newWorkout/training completed.png');
		background-size: contain;
		.van-button.finish{
			background: #1370FF !important;
			color: #FFFFFF !important;
		}
	}
	::v-deep.delete-dialog{
		background-image: url('../../static/newWorkout/training delete.png');
		background-size: contain;
		.van-button.delete{
			background: #F04242 !important;
			color: #FFFFFF !important;
		}
	}
}
</style>

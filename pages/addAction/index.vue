<template>
	<view class="add-action">
		<view class="status_bar"> <!-- 这里是状态栏 --> </view>
		<van-nav-bar title="新增动作" left-text="" left-arrow @click-left="onClickLeft"/>
		<view class="form">
			<van-field class="uni-input" v-model="actionName" placeholder="请输入动作名称" />
			<van-cell is-link title="动作类型" :value="actionTypeName" @click="show = true" />
		</view>
		<view class="footer-button">
			<van-button type="primary" block @click="saveAction">保存</van-button>
		</view>
		<van-action-sheet v-model:show="show" title="选择动作类型">
			<view v-for="(item,index) in actionTypeList" :key="index" class="action-type-item" :class="{active:item.active}" @click="actionTypeListSelect(item)">
				<view class="title">{{item.title}}</view>
				<view class="des">{{item.des}}</view>
			</view>
		</van-action-sheet>
	</view>
</template>

<script>
	const actionLibrary = uniCloud.importObject('actionLibrary')
	export default {
		data() {
			return {
				show:false,
				actionName: null,
				actionTypeList:[
					{
						type: 0,
						title:'力量训练',
						des:'力量训练的类型，可以为自定义动作提供记录次数和重量，其中重量的单位只能为公斤（kg）和磅（lbs）',
						active:false
					},
					{
						type: 1,
						title:'有氧训练',
						des:'有氧训练有多种记录形式，用户可以自行选择多种记录组合进行搭配',
						active:false
					},
					{
						type: 2,
						title:'仅需要填写次数',
						des:'有些动作既不会负重，也不需要重物，此时你可以选择这种记录方式',
						active:false
					},
					{
						type: 3,
						title:'仅记录时间',
						des:'有些动作你只想记录时间的，选择此类记录形式你可以自行选择用秒表还是计时器',
						active:false
					},
					{
						type: 4,
						title:'自重训练',
						des:'自重动作、自动负重动作，都适合这种训练类型。如果你不负重，那么你可以只填写次数；如果负重，那么可以填写附加的重量',
						active:false
					},
					{
						type: 5,
						title:'自重辅助',
						des:'例如辅助引体向上、辅助臂屈伸等等项目，需要用到辅助重量的动作，适合这种类型。这种类型可以自行设置体重。',
						active:false
					},
					{
						type: 6,
						title:'拉伸',
						des:'拉伸动作无需记录任何数据',
						active:false
					}
				],
				actionType: '',
				actionTypeName: ''
			}
		},
		onLoad: function (option) {
			console.log(option)
			this.type = option.type
			this.actionClass = option.actionClass
		},
		methods: {
			actionTypeListSelect(child){
				this.actionTypeList.forEach(item => {
					item.active = false
				});
				child.active = true
				this.actionType = child.type
				this.actionTypeName = child.title
			},
			onClickLeft(){
				uni.switchTab({
					url: '/pages/actionLibrary/index',
				})
			},
			async saveAction(){
				if(!this.actionName){
					return uni.showToast({icon:'error', title: '请输入动作名称', duration: 2000});
				}
				if(!this.actionType&&this.actionType!==0){
					return uni.showToast({icon:'error', title: '请选择动作类型', duration: 2000});
				}
				const res = await actionLibrary.addAction({
					type: this.type,
					actionClass: this.actionClass,
					actionName: this.actionName,
					actionType: this.actionType
				})
				this.onClickLeft()
				console.log(res,8888)
			}
		}
	}
</script>

<style lang="scss">
	page{
		background: #212328;
	}
	.status_bar {
		height: var(--status-bar-height);
		width: 100%;
	}
	.add-action{
		::v-deep .van-nav-bar{
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
				padding-left: 40upx;
				::v-deep  .van-field__control{
					color: #eff3fc;
					font-weight: 400;
				}
				::v-deep  .van-field__control::placeholder{
					color: #7A7F89;
				}
				::v-deep  &:after{
					display: none;
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
				::v-deep .van-cell__value{
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
		::v-deep .van-action-sheet__header{
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
		::v-deep .van-popup{
			background: #383D46;
			border-radius: 24px 24px 0px 0px;
		}
		::v-deep .van-action-sheet__content{
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

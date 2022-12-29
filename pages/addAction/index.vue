<template>
	<view class="add-action">
		<view class="status_bar"> <!-- 这里是状态栏 --> </view>
		<view class="background-header"></view>
		<view class="background"></view>
		<van-nav-bar title="新增动作" left-text="" left-arrow @click-left="onClickLeft"/>
		<view class="form">
			<input class="uni-input"  v-model="actionName" placeholder="请输入动作名称" />
			<van-cell is-link title="动作类型" :value="actionTypeName" @click="open" />
		</view>
		<view class="footer-button">
			<van-button type="primary" block @click="saveAction">保存</van-button>
		</view>
		<uni-popup ref="popup" type="bottom" mask-background-color="rgba(20, 21, 23, 0.6)">
			<view class="select-box">
				<view class="box-header">
					<view class="title">选择动作类型</view>
					<view class="close-btn" @click="closeHandle">×</view>
				</view>
				<view class="content">
					<view v-for="(item,index) in actionTypeList" :key="index" class="action-type-item" :class="{active:item.active}" @click="actionTypeListSelect(item)">
						<view class="title">{{item.title}}</view>
						<view class="des">{{item.des}}</view>
					</view>
				</view>
			</view>
		</uni-popup>
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
						title:'放松拉伸',
						des:'放松拉伸动作无需记录任何数据',
						active:false
					}
				],
				actionType: '',
				actionTypeName: '',
				update: false,
				actionId: null
			}
		},
		onLoad: function (option) {
			console.log(option)
			this.type = option.type
			this.actionClass = option.actionClass
			if(option.update==='1'){
				this.update = true
				this.actionId = option.id
				this.actionType = +option.actionType
				this.actionName = option.actionName
				const item = this.actionTypeList.find(item=>item.type === this.actionType)
				this.actionTypeName = item.title
			}
		},
		methods: {
			open(){
				this.$refs.popup.open()
			},
			closeHandle(){
				this.$refs.popup.close()
			},
			actionTypeListSelect(child){
				this.actionTypeList.forEach(item => {
					item.active = false
				});
				child.active = true
				this.actionType = child.type
				this.actionTypeName = child.title
				this.closeHandle()
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
				if(this.update){
					const res = await actionLibrary.updateAction({
						id: this.actionId,
						type: this.type,
						actionClass: this.actionClass,
						actionName: this.actionName,
						actionType: this.actionType
					})
				} else {
					const res = await actionLibrary.addAction({
						type: this.type,
						actionClass: this.actionClass,
						actionName: this.actionName,
						actionType: this.actionType
					})
				}
				this.onClickLeft()
			}
		}
	}
</script>

<style lang="scss">
	.background-header{
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		z-index: -1;
		height: 460upx;
		background: linear-gradient(to bottom, rgba(52, 58, 68, 1), #212328);
	}
	.background{
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		z-index: -2;
		height: 100vh;
		background: #212328;
	}
	.status_bar {
		height: var(--status-bar-height);
		width: 100%;
	}
	.add-action{
		position: relative;
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
		.form{
			padding: 30upx;
			.uni-input{
				height: 108upx;
				background: #383D46;
				border-radius: 16upx;
				padding-left: 40upx;
				color: #eff3fc;
				font-weight: 400;
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
		.select-box{
			// height: 1000upx;
			background: #383D46;
			border-radius: 24upx 24upx 0px 0px;
			padding: 40upx;
			padding-bottom: 0;
			position: relative;
			.box-header{
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding-bottom: 40upx;
				.title{
					font-size: 36upx;
					font-weight: 600;
					color: #F4F7FF;
				}
				.close-btn{
					width: 50upx;
					height: 50upx;
					line-height: 50upx;
					text-align: center;
					background: #4B525E;
					border-radius: 100%;
					color: #F4F7FF;
				}
			}
			.content{
				height: 880upx;
				overflow-y:  auto;
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
		::v-deep .uni-popup [name="mask"]{
			backdrop-filter: blur(3px);
		}
	}
</style>

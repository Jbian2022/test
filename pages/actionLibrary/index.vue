<template>
	<view class="action-library">
		<view class="header">
			<view class="all-action">全部动作库</view>
			<view class="problem-action active">问题动作库</view>
			<view class="custom-action" @click="addActionHandle">+ 自定义动作</view>
		</view>
		<view class="search">
			<van-search shape="round"  background="#212328" v-model="value" placeholder="输入动作名称搜索" />
		</view>
		<view class="content">
			<view class="sidebar">
				<van-sidebar v-model="activeKey">
					<van-sidebar-item title="标签名称" />
					<van-sidebar-item title="标签名称" />
					<van-sidebar-item title="标签名称" />
				</van-sidebar>
			</view>
			<view class="action-list">
				<view class="action-list-title">颈前引训练动作</view>
				<view class="action-list-box">
					<view v-for="i in 8" :key="i" class="action-list-item">
						<popover className="image" :list="actions" @selctClick="selectClick">
							<van-image round src="https://img01.yzcdn.cn/vant/cat.jpeg"/>
							<template  v-slot:item="{item}">
								<text v-if="item.text==='删除动作'" style="color:#F04242;">{{item.text}}</text>
								<text v-else>{{item.text}}</text>
							</template>
						</popover>
						<view class="text">筋膜球放松胸小肌，胸大肌</view>
					</view>
				</view>
				<view class="custom-action-button" @click="addActionHandle">
					<text> + 自定义动作</text>
				</view>
			</view>
		</view>
		<view v-if="showSaveButton" class="footer-seat"></view>
		<view v-if="showSaveButton" class="footer-button">
			<van-button type="default">默认按钮</van-button>
			<van-button type="primary">主要按钮</van-button>
		</view>
		<z-dialog v-model:value="showDialog">
			<view class="dialog-section">
				<view class="dialog-title">是否确认删除</view>
				<view class="dialog-content">确认删除该动作吗？删除后无法恢复</view>
				<view class="dialog-btn-box">
					<van-button type="default" @click="showDialog=false">取消</van-button>
					<van-button type="primary" @click="showDialog=false">确认</van-button>
				</view>
			</view>
		</z-dialog>
	</view>
</template>

<script>
	import popover from '../../components/popover/index.vue';
	import dialog from '../../components/dialog/index.vue'
	export default {
		components: {
			popover,
			'z-dialog':dialog
		},
		data() {
			return {
				value: null,
				activeKey: 0,
				actions: [
					{ text: '修改动作'},
					{ text: '删除动作'},
				],
				showDialog: false,
				showSaveButton: false
			}
		},
		onLoad: function (option) {
			if(option.hideTabBar){
				uni.hideTabBar()
				this.showSaveButton=true
			}else{
				uni.showTabBar()
				this.showSaveButton=false
			}
		},
		mounted () {
			/* uni.hideTabBar()
			this.showSaveButton=true */
		},
		methods: {
			selectClick(item){
				console.log(item.text)
				if(item.text==='删除动作'){
					this.showDialog=true
				}
			},
			addActionHandle(){
				uni.navigateTo({
					url: '/pages/addAction/index'
				});
			}
		}
	}
</script>

<style lang="scss">
page{
	background: #212328;
}
.action-library{
	.header{
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 8upx 40upx 40upx 40upx;
		.all-action,.problem-action{
			font-size: 40upx;
			color: #7A7F89;
			&.active{
				font-weight: 600;
				color: #F4F7FF;
			}
		}
		.custom-action{
			font-size: 28upx;
			font-weight: 400;
			color: #F4F7FF;
		}
	}
	.search{
		::v-deep.van-search{
			padding: 0 30upx;
		}
		::v-deep.van-search__content{
			background: #383D46;
			border-radius: 40upx;
		}
		::v-deep.van-search__field{
			height: 80upx;
		}
		::v-deep.van-icon-search{
			color: #A8ADB6;
		}
		::v-deep.van-field__control{
			color: #F4F7FF;
		}
		::v-deep.van-field__control::placeholder{
			font-size: 28upx;
			color: #7A7F89;
		}
	}
	.content{
		padding-top: 30upx;
		padding-right: 30upx;
		display: flex;
		.sidebar{
			width: 220upx;
			::v-deep.van-sidebar-item{
				height: 70upx;
				padding: 0;
				padding-top: 16upx;
				padding-left: 30upx;
				background: transparent;
				font-weight: 400;
				color: #7A7F89;
				font-size: 28upx;
			}
			::v-deep.van-sidebar-item--select{
				font-weight: 600;
				color: #F4F7FF;
				background: linear-gradient(270deg, #202123 0%, #383D46 100%);
				&:before{
					height: 70upx;
					background-color: #1370FF;
					width: 6upx;
				}
			}

		}
		.action-list{
			flex: 1;
			.custom-action-button{
				margin-top: 30upx;
				margin-bottom: 30upx;
				display: flex;
				align-items: center;
				justify-content: center;
				height: 140upx;
				background: rgba(244,247,255,0.1);
				border-radius: 16upx;
				border: 2px solid rgba(244,247,255,0.2);
				font-weight: 400;
				color: #F4F7FF;
				font-size: 30upx;
			}
			.action-list-title{
				font-size: 36upx;
				font-weight: 600;
				color: #F4F7FF;
			}
			.action-list-box{
				display: flex;
				flex-wrap:wrap;
				.action-list-item{
					margin-top: 30upx;
					width: calc(50% - 15upx);
					height: 240upx;
					background: #383D46;
					border-radius: 24upx;
					&:nth-child(2n){
						margin-left: 30upx;
					}
					::v-deep.image{
						padding-top: 30upx;
						text-align: center;
					}
					.van-image{
						width: 100upx;
						height: 100upx;
						background: #C7C9CC;
					}
					.text{
						padding: 8upx 30upx;
						color: #A8ADB6;
						font-size: 26upx;
					}
				}
			}
		}
	}
	.dialog-section{
		padding: 50upx;
		.dialog-title{
			font-size: 52upx;
			color: #F4F7FF;
			line-height: 72upx;
		}
		.dialog-content{
			margin-top: 30upx;
			margin-bottom: 80upx;
			font-size: 30upx;
			font-weight: 400;
			color: #A8ADB6;
			line-height: 48upx;
		}
	}
	.dialog-btn-box{
		::v-deep.van-button{
			width: 240upx;
			height: 90upx;
			background: #454951;
			border-radius: 16upx;
			border: none;
			font-size: 32upx;
			font-weight: 600;
			color: #FFFFFF;
			& +.van-button{
				margin-left: 30upx;
			}
			&.van-button--primary{
				background: #1370FF;
			}
		}
	}
	.footer-seat{
		height: 198upx;
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
		.van-button{
			background: #454951;
			border-radius: 16upx;
			height: 100upx;
			font-size: 32upx;
			font-weight: 600;
			color: #FFFFFF;
			border: none;
			width: 200upx;
			&+.van-button{
				margin-left: 30upx;
			}
			&.van-button--primary{
				width: 460upx;
				background: #1370FF;
			}
		}
	}
}
</style>

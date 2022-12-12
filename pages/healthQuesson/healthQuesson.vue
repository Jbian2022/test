<template>
	<view class="content_style">
		<BgTheamCompontent :theamType="'currency'"></BgTheamCompontent>
		<NavBarCompontent :leftNavTitle="'健康问答'" ></NavBarCompontent>
		<view class="list_content_style">
			<view class="need_loop_style" v-for="(item, itemIndex) in healthList" :key="'key' + itemIndex">
		
				<view class="check_box_style" v-if="item.questionType=== 2">
					<van-collapse class="need_collapse_style" v-model="activeName">
					  <van-collapse-item :title="item.questionContent" :name="itemIndex">
						 <view class="collapes_conten_style">
							 <view class="collapes_tag_stylle" @click.stop="quesionClick(item, itemChild)" :class="itemChild.checked ? 'active' : ''" v-for="(itemChild, itemChildIndex) in item.answer" :key="'key' + itemChildIndex">{{itemChild.answerTitle}}</view>
							 
						 </view>
					  </van-collapse-item>
					</van-collapse>
					
				</view>
				<view class="radio_style"  v-if="item.questionType===1">
					<view class="radio_title_style">
						{{item.questionContent}}
					</view>
					<view class="radio_tag_style">
						<view class="tag_style" :class="radioItem.checked ? 'active' : ''"  v-for="(radioItem, radioItemIndex) in item.answer" :key="'key' + radioItemIndex">{{radioItem.answerTitle}}</view>
					</view>
					<view class="radio_remark_style" v-if="item.textType===1">
						 <van-field
							 class="supplement_style"
						      v-model="username"
						      placeholder="请补充具体信息"
						
						    />
					</view>
				</view>
				
				
			</view>
			
			
		</view>
	</view>
</template>

<script>
	import BgTheamCompontent from '@/components/bgTheamCompontent/bgTheamCompontent.vue'
	import NavBarCompontent from '@/components/navBarCompontent/navBarCompontent.vue'
	var businessCloudObject = uniCloud.importObject('businessCloudObject')
	export default {
		components: {
			BgTheamCompontent,
			NavBarCompontent
		},
		data() {
			return {
				healthList: [],
				activeName: [0],
				traineeNo: '',
				originList: [], // 源数据
				questionCode: ''
				
				
			}
		},
		onLoad(options) {
			if (JSON.stringify(options) !== '{}' && options.traineeNo) {
				this.traineeNo = options.traineeNo
			}
			if (JSON.stringify(options) !== '{}' && options.hasOwnProperty('childList')) {
				let originList = JSON.parse(options.childList) 
				this.originList = originList
				// console.log(this,'>>>',this.healthList)
				
			}
			if (JSON.stringify(options) !== '{}' && options.hasOwnProperty('questionCode')) {
				this.questionCode = options.questionCode	
			}
			
		},
		mounted() {
			this.requestList()
		},
		methods: {
			requestList() {

				businessCloudObject.opearConfigQuery({traineeNo: this.traineeNo, questionCode: this.questionCode}).then(res => {
					console.log(res, 'kkkkk')
					if (res.affectedDocs === 0) {
						let healthList = this.originList.map(item => {
						let answer = item.answer.length > 0 ? item.answer.map(config => {
								return {
									...config,
									checked: false
								}
							}) : []
						
						return {
							...item,
							answer
						}	
						})
						this.healthList = healthList
					} else {
						
						let healthList = this.originList.map(item => {
							let answer = item.answer.length > 0 ? item.answer.map(config => {
							// 需要对比的数组
							let compareData = res.data[0]
							var checked = false
							compareData.testResult.forEach(k => {
								// 挑出父节点
								// console.log(config, '>>>>>')
								if (item.code === k.code) {
									k.answer.length > 0 ? k.answer.map(z => {
										if (config.answerTitle === z) {
											checked = true
										}
									}) : checked = false
								}
							})
								
									return {
										...config,
										checked
									}
								}) : []
							return {
								...item,
								answer
							}	
						})
						console.log(healthList, 'hellow')
						this.healthList = healthList
					}
					
				}).catch((err) => {})
			},
			
		}
	}
</script>

<style lang="scss">
	.content_style {
		width: 100vw;
		// height: 100vh;
		overflow: hidden;
		position: relative;
	}
	.list_content_style {
		width: 100%;
		height: 90vh;
		overflow-x: hidden;
		overflow-y: auto;
		
		.need_loop_style {
			width: calc(100vw - 60upx);
			margin-left: 30upx;
			margin-top: 30upx;
			background: #383D46;
			border-radius: 24upx;
			height: auto;
			
			
		.check_box_style {
			.need_collapse_style {
				width: calc(100% - 60upx);
				margin-left: 30upx;
				height: auto;
				padding-top: 40upx;
				padding-bottom: 40upx;
				box-sizing: border-box;
				.collapes_conten_style {
					width: 100%;
					display: flex;
					align-items: center;
					flex-wrap: wrap;
					
					.collapes_tag_stylle {
						width: 187upx;
						height: 80upx;
						background: #4B525E;
						border-radius: 16upx;
						font-size: 28upx;
						// font-family: PingFangSC-Semibold, PingFang SC;
						font-weight: 600;
						color: #F4F7FF;
						text-align: center;
						line-height: 80upx;
						margin-right: 24upx;
						margin-bottom: 24upx;
						
						
					}
					.active {
						background: #1370FF;
						color: #F4F7FF;
					}
					.collapes_tag_stylle:nth-child(3n) {
						margin-right: 0;
					}
				}
				
				
			}
			
		}
		.radio_style {
			width: 100%;
			
			margin-top: 30upx;
			background: #383D46;
			border-radius: 24upx;
			height: auto;
			.radio_title_style {
				font-size: 32upx;
				font-family: PingFangSC-Semibold, PingFang SC;
				font-weight: 600;
				color: #F4F7FF;
				padding-top: 40upx;
				margin-left: 30upx;
				
			}
			.radio_tag_style {
				width: 100%;
				display: flex;
				align-items: center;
				margin-left: 30upx;
				margin-top: 36upx;
				padding-bottom: 30upx;
				.tag_style {
					width: 160upx;
					height: 80upx;
					background: #4B525E;
					border-radius: 16upx;
					line-height: 80upx;
					margin-right: 30upx;
					text-align: center;
					font-size: 30upx;
					font-family: PingFangSC-Regular, PingFang SC;
					font-weight: 400;
					color: #F4F7FF;
				
				}
				.active {
					background: #1370FF;
					color: #F4F7FF;
				}
				
			}
			.radio_remark_style {
				width: calc(100% - 60upx);
				margin-left: 30upx;
				padding-bottom: 30upx;
				.supplement_style {
					width: 100%;
					height: 160px;
					background: #4B525E;
					border-radius: 16px;
					input{
					    &::placeholder { /* Chrome, Firefox, Opera, Safari 10.1+ */
					      color: red !important;
					    }
					
					  }
			
				}
				
			}
			
			
		}
			
		}
	}
	
	::v-deep .van-field__control {
			font-size: 32upx !important;
			font-family: PingFangSC-Semibold, PingFang SC;
			font-weight: 600;
			color: #F4F7FF;
	}
	::v-deep .van-field__control::placeholder {
	
		font-size: 32upx;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: #BDC3CE;
	
	
	}


::v-deep .van-cell::after {
	border-bottom-width: 0 !important;
	border-top-width: 0 !important;
	border: none;
}
::v-deep .van-collapse-item::after {
	border-bottom-width: 0 !important;
	border-top-width: 0 !important;
	border: none;
}
::v-deep .van-collapse::after {
	border: none;
}
::v-deep .van-collapse-item {
	
	.van-cell {
		background: #383D46 !important;
			padding-left: 0;
			padding-right: 0;
		.van-cell__title {
			color: #ffff;
			font-size: 32upx;
			// font-family: PingFangSC-Semibold, PingFang SC;
			font-weight: 600;
			color: #F4F7FF;
		}
		
		
	}
	.van-collapse-item__wrapper {
	
		.van-collapse-item__content {
			background: #383D46 !important;
			padding-left: 0;
			padding-right: 0;
		}
	}
}
</style>

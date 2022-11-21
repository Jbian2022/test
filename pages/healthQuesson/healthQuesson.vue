<template>
	<view class="content_style">
		<BgTheamCompontent :theamType="'currency'"></BgTheamCompontent>
		<NavBarCompontent :leftNavTitle="'健康问答'" ></NavBarCompontent>
		<view class="list_content_style">
			<view class="need_loop_style" v-for="(item, itemIndex) in healthList" :key="'key' + itemIndex">
				<view class="check_box_style" v-if="item.problemType==='checkbox'">
					<van-collapse class="need_collapse_style" v-model="activeName">
					  <van-collapse-item :title="item.title" :name="itemIndex">
						 <view class="collapes_conten_style">
							 <view class="collapes_tag_stylle" v-for="(itemChild, itemChildIndex) in item.child" :key="'key' + itemChildIndex">{{itemChild.title}}</view>
							 
						 </view>
					  </van-collapse-item>
					</van-collapse>
					
				</view>
				<view class="radio_style"  v-if="item.problemType==='radio'">
					<view class="radio_title_style"></view>
				</view>
				
				
			</view>
			
			
		</view>
	</view>
</template>

<script>
	import BgTheamCompontent from '@/components/bgTheamCompontent/bgTheamCompontent.vue'
	import NavBarCompontent from '@/components/navBarCompontent/navBarCompontent.vue'
	export default {
		components: {
			BgTheamCompontent,
			NavBarCompontent
		},
		data() {
			return {
				healthList: [
					{
						title: '如果您有以下疾病请点击选择',
						problemType: 'checkbox',
						child: [
							{
								title: '高血压',
								activeFlag: true
							},
							{
								title: '高血压',
								activeFlag: true
							},
							{
								title: '高血压',
								activeFlag: true
							}
						]
					},
					{
						title: '您是否有其他被确诊的疾病',
						problemType: 'radio',
						supplementaryInformation: 'y'
					}
				],
				activeName: [0]
				
			}
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
					.collapes_tag_stylle {
						width: 187upx;
						height: 80upx;
						background: #1370FF;
						border-radius: 16upx;
						font-size: 28upx;
						// font-family: PingFangSC-Semibold, PingFang SC;
						font-weight: 600;
						color: #F4F7FF;
						text-align: center;
						line-height: 80upx;
						margin-right: 24upx;
						
					}
				}
				
				
			}
			
		}
			
		}
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

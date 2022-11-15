<template>
	<view class="content_style">
		<view class="header_style">
			<view class="header_left_style">
				<view class="left_content_style">
					<image class="left_content_img_style" src="https://img2.baidu.com/it/u=2490939159,251868101&fm=253&fmt=auto&app=120&f=JPEG?w=1200&h=750"></image>
					<view class="left_header_style">我的会员</view>
					
				</view>
			</view>
			<view class="header_right_style">
				<image class="right_img_style" src="../../static/app-plus/mebrs/fangdajing.svg"></image>
			</view>
		</view>
		<view></view>
	</view>
</template>

<script>
	
import 'vant/lib/index.css'
	
	export default {
		data() {
			return {
				
			};
		}
	}
</script>

<style lang="scss">
	.content_style {
		width: 100vw;
		height: 100vh;
		overflow: hidden;
		.header_style {
			width: 100vw;
			height: 80upx;
			margin-top: 30upx;
			display: flex;
			justify-content: space-around;
			align-items: center;
			.header_left_style {
				width: 50%;
				height: 100%;
				.left_content_style {
					display: flex;
					align-items: center;
					height: 80upx;
					
					
					.left_content_img_style {
						width: 80upx;
						height: 100%;
						object-fit: contain;
						border-radius: 50%;
						margin-right: 20upx;
						margin-left: 30upx;
						
					}
				}
				
			}
			.header_right_style {
				width: 50%;
				display: block;
				.right_img_style {
					height: 48.59upx;
					height: 48.59upx;
					
				}
				
			}
			
		}
		
	}

</style>

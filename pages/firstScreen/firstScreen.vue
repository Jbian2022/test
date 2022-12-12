<template>

 <view class="start_app_style">
	
		<view class="app_content_style">
			<image class="content_img_style" src="../../static/app-plus/other/slogan.png"></image>
	
			
		</view>
		<image class="footer_style" src="@/static/app-plus/other/footerlogo.png"></image>
	</view>

</template>

<script>

	export default {
		components: {
	
		},
		data() {
			return {
				
			}
		}
	}
</script>

<style scoped lang="scss">
	.start_app_style {
		width: 100vw;
		height: 100vh;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		align-items: center;
		background: #383D46;
		z-index: -1;
		.app_content_style {
			margin-top: 290upx;
			width: calc(100% - 280upx);
			height: auto;
			.content_img_style {
				width: 100%;
				height: 370upx;
			}
		}
		.footer_style {
			width: 178upx;
			height: 64upx;
			margin-bottom: 188upx;
		}
	}

</style>

<template>
	<view class="bg_content">
		<view v-if="theamType==='currency'" class="currency_style">
			<image class="currency_img_style" src="../../static/app-plus/bg/currency.png"></image>
			<view class="currency_content_style"></view>
		</view>
		
	</view>
</template>

<script>
	export default {
		name:"bgTheamCompontent",
		props: ['theamType'],
		data() {
			return {
				
			};
		}
	}
</script>

<style lang="scss">
	.bg_content {
		width: 100%;
		height: 100%;
		position: absolute;
		left: 0;
		top: 0;
		.currency_style {
			width: 100%;
			height: 100%;
			display: flex;
			flex-direction: column;
			.currency_img_style {
				width: 100%;
				height: 372upx;
				object-fit: contain;
			}
			.currency_content_style {
				width: 100%;
				flex: 1;
				background: #212328;
			}
		}
	}

</style>
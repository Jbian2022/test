<template>
	<view class="content_style">
		<BgTheamCompontent :theamType="'currency'"></BgTheamCompontent>
		<NavBarCompontent :leftNavTitle="'体能评估'"></NavBarCompontent>
		<van-button 
		type="primary" 
		class="shareButton" 
		icon="../../static/app-plus/other/share.svg"
		@click="showShare = true">分享报告</van-button>
		<van-share-sheet
		  v-model:show="showShare"
		  :options="options"
		  @select="onSelect"
		  cancel-text=""
		  class="shareBlock"
		/>
	</view>
</template>

<script>
	import BgTheamCompontent from '@/components/bgTheamCompontent/bgTheamCompontent.vue';
	import NavBarCompontent from '@/components/navBarCompontent/navBarCompontent.vue';
	export default {
		data() {
			return {
				showShare:false,
				options:[
				  { name: '分享到微信', icon: '../../static/app-plus/other/saveWechat.svg' },
				  { name: '分享到朋友圈', icon: '../../static/app-plus/other/wechatMoments.svg' },
				  { name: '保存到相册', icon: '../../static/app-plus/other/savePhone.svg' }
				]
			}
		},
		methods: {
			
		}
	}
</script>

<style>
.content_style{
		width: 100vw;
		height: 100vh;
		overflow: hidden;
		position: relative;
		background: #383D46;
		text-align: center;
	}
.shareButton{
	width: 690upx;
	height: 100upx;
	background: #1370FF;
	border-radius: 16upx;
}
::v-deep .van-popup{
	width: 100vw;
	height: 388upx;
	background: #383D46;
	border-radius: 24upx 24upx 0upx 0upx;
}
::v-deep .van-share-sheet__name{
	color: #F4F7FF;
}
::v-deep .van-share-sheet__options{
	margin: 80upx 0 0 0;
}
::v-deep .van-share-sheet__option{
	margin-left: 94upx;
	margin-right: -44upx;
}
</style>

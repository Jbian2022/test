<template>
	<view class="content_style">
		<BgTheamCompontent :theamType="'currency'"></BgTheamCompontent>
		<NavBarCompontent :leftNavTitle="leftNavTitle"></NavBarCompontent>
		<view class="body_content">
			
		</view>
	</view>
</template>

<script>
	import BgTheamCompontent from '@/components/bgTheamCompontent/bgTheamCompontent.vue'
	import NavBarCompontent from '@/components/navBarCompontent/navBarCompontent.vue'
	import { ref } from 'vue';
	export default {
		setup() {
		    const activeNames = ref(['1']);
		    return { activeNames };
		  },
		onLoad: function (item) {
				console.log(item.pageName);
				let leftNavTitle = item.pageName
				this.leftNavTitle = leftNavTitle
		},
		components: {
			BgTheamCompontent,
			NavBarCompontent
		},
		data() {
			return {
				leftNavTitle:''
			}
		},
		methods: {
			
		}
	}
</script>

<style>
.content_style {
	width: 100vw;
	height: 100vh;
	overflow: hidden;
	position: relative;

}
.collapseBlock{
	background-color: #383D46;
	--van-collapse-item-content-background-color:#383D46;
}
::v-deep .van-cell__title{
	text-align: center;
	font-size: 30upx;
	font-weight: 400;
	color: #BDC3CE;
	line-height: 42upx;
}
</style>

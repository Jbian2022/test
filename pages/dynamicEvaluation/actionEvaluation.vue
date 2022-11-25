<template>
	<view class="content_style">
		<BgTheamCompontent :theamType="'currency'"></BgTheamCompontent>
		<NavBarCompontent :leftNavTitle="leftNavTitle"></NavBarCompontent>
		<view>
			<van-collapse v-model="activeNames" 
			class="collapseBlock"
			border=false>
			  <van-collapse-item title="标题1" name="1">
			    代码是写出来给人看的，附带能在机器上运行。
			  </van-collapse-item>
			</van-collapse>
		</view>
		<view>
			
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
			setTitle(item){
				leftNavTitle = item.pageName
			}
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
</style>

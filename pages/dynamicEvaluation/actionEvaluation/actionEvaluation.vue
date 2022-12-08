<template>
	<view class="content_style">
		<BgTheamCompontent :theamType="'currency'"></BgTheamCompontent>
		<NavBarCompontent :leftNavTitle="leftNavTitle"></NavBarCompontent>
		<view class="headBox">
			<view class="block"
			v-for="(item, index) in actionobs"
			:key="index"
			:class="num==index?'block0': ''"
			@click.native="changeFunction(index)">{{item.name}}</view>
		</view>
		<view class="contentBody" v-if="changeValue">
			
			<van-image
			  class="imagebg"
			  :src="backimg1"
			/>
			<!-- <image
			  src="../../static/app-plus/bg/actionImg.png"
			></image> -->
		</view>
		<view class="contentBody" v-else>
			
			<van-image
			  class="imagebg"
			  :src="backimg2"
			/>
			<!-- <image
			  src="../../static/app-plus/bg/actionImg.png"
			></image> -->
		</view>
		<van-button type="primary" block class="buttontrue">确认</van-button>
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
		onLoad: function (item) {
						console.log(item.pageTitle);
						let leftNavTitle = item.pageTitle
						this.leftNavTitle = leftNavTitle
				},
		data() {
			return {
				actionobs:[
					{name:'正面观'},
					{name:'侧面观'}
				],
				icon: true,
				backimg1: "../../static/app-plus/bg/positiveAction.jpg",
				backimg2: "../../static/app-plus/bg/positiveAction2.jpg",
				changeValue: true,
				num: 0
			}
		},
		methods: {
			setup() {
			  const onClickLeft = () => history.back()
			  return {
			    onClickLeft
			  }
			},
			changeFunction(index){
				if(index==0){
					this.changeValue = true
					this.num = index
				}else{
					this.changeValue = false
					this.num = index
				}
			}
		}
	}
</script>

<style>
.content_style{
	width: 100vw;
	height: 100vh;
	overflow: hidden;
	position: relative;
}
.headBox{
	width: calc(100vw - 60upx);
	height: 90upx;
	margin: 0 auto;
	margin-top: 20upx;
	margin-left: 30upx;
}
.block{
	width: 335upx;
	height: 90upx;
	border-radius: 16upx;
	float: left;
	font-size: 30upx;
	font-family: PingFangSC-Semibold, PingFang SC;
	font-weight: 600;
	color: #F4F7FF;
	line-height: 90upx;
	text-align: center;
	background: #383D46;
}
.block0{
	background: #195BC2;
}
.headBox :last-child{
	float: right;
}
.contentBody{
	width: calc(100vw - 60upx);
	height: 1130upx;
	margin: 0 auto;
	margin-top: 20upx;
}
.imagebg {
      width: 100%;
      height: 1130upx;
	  border-radius: 120px;
    }
.buttontrue {
  width: calc(100vw - 60upx);
  height: 100upx;
  background: #1370ff;
  border-radius: 16upx;
  margin-left: 30upx;
  margin-top: 30upx;
}
</style>

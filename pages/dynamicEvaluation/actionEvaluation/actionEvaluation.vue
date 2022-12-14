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
			<view
			class="clickAction" 
			@click.native="showPopup">标准动作描述
			<image src="../../../static/app-plus/mebrs/openarrit.png"></image>
			</view>
			<van-popup 
			v-model:show="show" 
			position="top" 
			round
			:overlay="false"
			class="clickActionContent">
				<view class="clickActionBody">
					<video :src="squatFrontVideoUrl" wid autoplay>
					</video>
					<view class="clickActionText">
						<view class="Actionname">标准动作：</view>
						<view>
							<p>1.双脚与肩同宽双臂自然下垂。</p>
							<p>2.不提醒会员任何技巧，自然下蹲n次。</p>
							<p>3.每次下蹲频率在5秒左右。</p>
							<p>4.下蹲过程中，教练需观察会员，正面肢体状态，侧面肢体状态。</p>
						</view>
					</view>
				</view>
				<view class="clickActionEnd" @click.native="closePopup">收起
				<image src="../../../static/app-plus/other/close.png"></image>
				</view>
			</van-popup>
			<van-image
			  class="imagebg"
			  :src="backimg1"
			/>
			<!-- <image
			  src="../../static/app-plus/bg/actionImg.png"
			></image> -->
		</view>
		<view class="contentBody" v-else>
			<view
			class="clickAction" 
			@click.native="showPopup">标准动作描述
			<image src="../../../static/app-plus/mebrs/openarrit.png"></image>
			</view>
			<van-popup 
			v-model:show="show" 
			position="top" 
			round
			:overlay="false"
			class="clickActionContent">
				<view class="clickActionBody">
					<video :src="squatSideVideoUrl" wid autoplay>
					</video>
					<view class="clickActionText">
						<view class="Actionname">标准动作：</view>
						<view>
							<p>1.双脚与肩同宽双臂自然下垂。</p>
							<p>2.不提醒会员任何技巧，自然下蹲n次。</p>
							<p>3.每次下蹲频率在5秒左右。</p>
							<p>4.下蹲过程中，教练需观察会员，正面肢体状态，侧面肢体状态。</p>
						</view>
					</view>
				</view>
				<view class="clickActionEnd" @click.native="closePopup">收起
				<image src="../../../static/app-plus/other/close.png"></image>
				</view>
			</van-popup>
			
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
	import { ref } from 'vue';
	export default {
		components: {
		  BgTheamCompontent,
		  NavBarCompontent
		},
		setup() {
			const show = ref(false);
			    const showPopup = () => {
			      show.value = true;
			    };
				const closePopup = () =>{
				  show.value = false;
				};
			    return {
			      show,
			      showPopup,
				  closePopup,
			    };
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
				num: 0,
				squatFrontVideoUrl: "../../../static/app-plus/video/squatFront.mp4",
				squatSideVideoUrl: "../../../static/app-plus/video/squatSide.mp4"
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

.clickAction{
	width: 260upx;
	height: 70upx;
	background: #000000;
	border-radius: 36upx;
	opacity: 0.5;
	position:absolute;
	top: 240upx;
	left: 60upx;
	z-index: 1;
	font-size: 26upx;
	font-weight: 400;
	color: rgb(244, 247, 255);
	line-height: 70upx;
	text-align: center;
}
.clickAction image{
	width: 32upx;
	height: 32upx;
	top: 6upx;
}
.clickActionBody{
	height: 1500upx;
	background: #383D46;
	border-radius: 16upx;
	backdrop-filter: blur(3upx);
	z-index: 999;
}
::v-deep .clickActionContent{
	width: calc(100vw - 60upx);
	margin-top: 100upx;
	margin-left: 30upx;
	--van-popup-background-color: #383D46;
	border-radius: 32upx;
}
.clickActionBody video{
	width: calc(100vw - 140upx);
	height: 400upx;
	margin-left: 40upx;
	margin-top: 40upx;
	border-radius: 20upx;
}
.clickActionText{
	width: calc(100vw - 140upx);
	height: 174upx;
	margin-top: 40upx;
	margin-left: 40upx;
}
.Actionname{
	font-size: 30upx;
	font-weight: 600;
	color: #F4F7FF;
	line-height: 42upx;
	margin-bottom: 20upx;
}
.clickActionText p{
	font-size: 26upx;
	font-weight: 400;
	color: #BDC3CE;
	line-height: 36upx;
}
.clickActionEnd{
	width: 240upx;
	height: 80upx;
	background: #000000;
	border-radius: 40upx;
	font-size: 26upx;
	font-weight: 400;
	color: #F4F7FF;
	line-height: 70upx;
	text-align: center;
	margin: 0 auto;
	margin-bottom: 40upx;
}
.clickActionEnd image{
	width: 32upx;
	height: 32upx;
	top: 6upx;
}
</style>

<template>
	<view class="content_style">
		<BgTheamCompontent :theamType="'currency'"></BgTheamCompontent>
		<NavBarCompontent :leftNavTitle="leftNavTitle"></NavBarCompontent>
		<view class="headBox">
			<view class="block"
			v-for="(item, index) in actionobs"
			:key="index"
			:class="num==index?'block0': ''"
			@click.native="changeFunction(index)">{{item.questionContent}}</view>
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
					<video :src="FrontVideoUrl" wid autoplay loop :controls="false">
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
					<view class="clickActionEnd" @click.native="closePopup">收起
					<image src="../../../static/app-plus/other/close.png"></image>
					</view>
				</view>
			</van-popup>
			<image class="imagebg" :src="backimgFront"/>
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
					<video :src="SideVideoUrl" wid autoplay loop :controls="false">
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
					<view class="clickActionEnd" @click.native="closePopup">收起
					<image src="../../../static/app-plus/other/close.png"></image>
					</view>
				</view>
			</van-popup>
			
			<image class="imagebg" :src="backimgSide"
			/>
			<!-- <image
			  src="../../static/app-plus/bg/actionImg.png"
			></image> -->
		</view>
		
		<view class="bottom_style" @click.stop="actionResDate">确认</view>
	</view>
</template>

<script>
	import BgTheamCompontent from '@/components/bgTheamCompontent/bgTheamCompontent.vue'
	import NavBarCompontent from '@/components/navBarCompontent/navBarCompontent.vue'
	import { ref } from 'vue';
	const tesOb = uniCloud.importObject("testResults");
	const busOb = uniCloud.importObject("businessCloudObject");
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
					console.log(item);
					this.traineeNo = item.traineeNo;
					this.questionCode = item.questionCode;
					let leftNavTitle = item.pageTitle
					this.type = item.type;
					this.leftNavTitle = leftNavTitle
					switch(leftNavTitle){
						case "胸椎活动评估":
							this.backimgFront = this.thoracicSpineActivityimg;
							this.backimgSide = this.thoracicSpineActivity2img;
							this.FrontVideoUrl = this.thoracicSpineActivityUrl;
							this.SideVideoUrl = this.thoracicSpineActivityUrl;
							break;
						case "自重深蹲评估" :
							this.backimgFront = this.backimg1;
							this.backimgSide = this.backimg2;
							this.FrontVideoUrl = this.squatFrontVideoUrl;
							this.SideVideoUrl = this.squatSideVideoUrl;
							break;
						case "柔韧性测试" :
							this.backimgFront = this.thomasimg;
							this.backimgSide = this.straightLegLiftimg;
							this.FrontVideoUrl = this.StraightLegLiftUrl;
							this.SideVideoUrl = this.ThomasUrl;
							break;
						case "关节灵活测试" :
							this.backimgFront = this.shoulderTest1img;
							this.backimgSide = this.shoulderTest2img;
							this.FrontVideoUrl = this.shoulderTest1Url;
							this.SideVideoUrl = this.shoulderTest2Url;
							break;
						case "俯卧撑稳定性测试" :
							this.backimgFront = this.pushUpTestimg;
							this.FrontVideoUrl = this.pushUpTestUrl;
							break;
					}
					this.getActionInfo();
					this.traineeNo = item.traineeNo;
					this.questionCode = item.questionCode;
				},
		data() {
			return {
				actionobs:[
					{name:'正面观'},
					{name:'侧面观'}
				],
				type:'',
				traineeNo:'',
				questionCode:'',
				icon: true,
				backimgFront:"",
				backimgSide:"",
				FrontVideoUrl:"",
				SideVideoUrl:"",
				backimg1: "../../../static/app-plus/bg/positiveAction.jpg",
				backimg2: "../../../static/app-plus/bg/positiveAction2.jpg",
				thoracicSpineActivityimg:"../../../static/app-plus/bg/thoracicSpineActivity.jpg",
				thoracicSpineActivity2img:"../../../static/app-plus/bg/thoracicSpineActivity2.jpg",
				thomasimg: "../../../static/app-plus/bg/Thomas.jpg",
				straightLegLiftimg: "../../../static/app-plus/bg/StraightLegLift.jpg",
				shoulderTest1img: "../../../static/app-plus/bg/shoulderTest1.jpg",
				shoulderTest2img: "../../../static/app-plus/bg/shoulderTest2.jpg",
				pushUpTestimg:"../../../static/app-plus/bg/pushUpTest.jpg",
				changeValue: true,
				num: 0,
				squatFrontVideoUrl: "../../../static/app-plus/video/squatFront.mp4",
				squatSideVideoUrl: "../../../static/app-plus/video/squatSide.mp4",
				//胸椎活动视频
				thoracicSpineActivityUrl:"../../../static/app-plus/video/thoracicSpineActivity.mp4",
				//直抬腿
				StraightLegLiftUrl:"../../../static/app-plus/video/StraightLegLift.mp4",
				//托马斯
				ThomasUrl:"../../../static/app-plus/video/Thomas.mp4",
				//肩关节灵活性测试1
				shoulderTest1Url:"../../../static/app-plus/video/shoulderTest1.mp4",
				//肩关节灵活性测试2
				shoulderTest2Url:"../../../static/app-plus/video/shoulderTest2.mp4",
				//五，俯卧撑稳定性测试
				pushUpTestUrl:"../../../static/app-plus/video/pushUpTest.mp4"
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
			},
			getActionInfo(){
				if(this.type!==''){
					busOb.getPhysicalChildAssessmentList(this.type).then((res)=>{
						console.log(res);
						if(res.success){
							this.actionobs = res.data
						}
						console.log(this.actionobs);
					})
				}
			},
			actionResDate(){
				console.log(this.traineeNo)
					// const data = {};
					// const actinData = {};
					// data["traineeNo"] = this.traineeNo;
					// data["questionCode"] = this.questionCode;
					// data["code"] = this.actionData.code;
					// actinData["actionVlue"] = this.resultValue;
					// actinData["actionTypeText"] = this.typeText
					// data["testDate"] = new Date();
					// data["physicalData"] = actinData;
					// data["status"] = "0";
					// console.log(data)
					// const res = testOb.opearConfig(data,"bodyTestReport").then(res => {
					// 	console.log(res, '我要保存了')
					// 	if (res.success) {
							uni.redirectTo({
								url: '/pages/dynamicEvaluation/dynamicEvaluation' +'?traineeNo=' + this.traineeNo + '&questionCode=' + this.questionCode
							})
					// 		uni.showToast({
					// 		  icon: 'success',
					// 		  title: res.message,
					// 		  duration: 800
					// 		})
					// 	}
					// }).catch(() =>{})
					// console.log(res)
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
	overflow-x: hidden;
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
	margin-right: 25upx;
}
.block0{
	background: #195BC2;
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
	  border-radius: 16upx;
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
	top: 310upx;
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
	height: 1400upx;
	background: #383D46;
	border-radius: 16upx;
	/* backdrop-filter: blur(3upx); */
	z-index: 999;
}
::v-deep .clickActionContent{
	width: calc(100vw - 60upx);
	height: 1400upx;
	margin-top: 270upx;
	margin-left: 30upx;
	--van-popup-background-color: #383D46;
	border-radius: 16upx;
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
	width: 230upx;
	height: 80upx;
	background: #000000;
	border-radius: 40upx;
	font-size: 26upx;
	font-weight: 400;
	color: #F4F7FF;
	line-height: 70upx;
	text-align: center;
	margin: 0 auto;
	margin-top: 600upx;
}
.clickActionEnd image{
	width: 32upx;
	height: 32upx;
	top: 6upx;
}
.bottom_style {
  width: calc(100vw - 60upx);
  margin-left: 30upx;
  height: 100upx;
  background: #1370ff;
  border-radius: 16upx;
  margin-top: 30upx;
  margin-bottom: 30upx;
  font-size: 32upx;
  font-family: PingFangSC-Semibold, PingFang SC;
  font-weight: 600;
  color: #ffffff;
  line-height: 100upx;
  text-align: center;
}
</style>

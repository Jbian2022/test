<template>
	<view class="content_style" @touchstart="start" @touchend="end">
		<BgTheamCompontent :theamType="'currency'"></BgTheamCompontent>
		<NavBarCompontent :leftNavTitle="leftNavTitle"></NavBarCompontent>
		<view class="headBox" v-if="leftNavTitle==='肩关节灵活性测试'">
			<view class="block1"
			v-for="(item, index) in actionobs"
			:key="index"
			:class="num==index?'block0': ''"
			@click.native="changeFunction(index)">{{item.questionContent}}</view>
		</view>
		<view class="headBox" v-else>
			<view class="block"
			v-for="(item, index) in actionobs"
			:key="index"
			:class="num==index?'block0': ''"
			@click.native="changeFunction(index)">{{item.questionContent}}</view>
		</view>
		<view class="contentBody" v-if="changeValue">
			<view
			class="clickAction" 
			@click.native="showPopup">点击查看标准动作描述
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
							<p v-for="(item,index) in testText1">{{item}}</p>
						</view>
					</view>
					<view class="clickActionEnd" @click.native="closePopup">收起
					<image src="../../../static/app-plus/other/close.png"></image>
					</view>
				</view>
			</van-popup>
			<view class="actinQuessonContent">
				<view
				 v-for="(item,index) in quession1"
				 :style="item.style">
					<view class="quessonName" v-if="item.status" @click.stop="clickQ(item,0)">
						<p>{{item.answerTitle}}</p>
					</view>
					<view class="clickQuessonName" v-if="!item.status" @click.stop="clickQ(item,0)">
						<view class="quessonTitle">
							{{item.answerTitle}}
						</view>
						<view class="quessonText">
							<p style="color: #F04242;display: initial;">问题描述：</p>{{item.answeerContent}}
						</view>
					</view>
				</view>
				<!-- <view style="position: absolute;
							z-index: 2;
							top: 670upx;
							left: 530upx;">
					<view class="quessonName" v-if="true">
						<p>躯干一侧偏移</p>
					</view>
					<view class="clickQuessonName" v-if="false">
						<view class="quessonTitle">
							躯干一侧偏移
						</view>
						<view class="quessonText">
							问题描述：股四头肌和髋关节屈肌活跃，臀部
						</view>
					</view>
				</view>
				<view style="position: absolute;
							z-index: 2;
							top: 1040upx;
							left: 530upx;">
					<view class="quessonName" v-if="true">
						<p>足背屈不足</p>
					</view>
					<view class="clickQuessonName" v-if="false">
						<view class="quessonTitle">
							足背屈不足
						</view>
						<view class="quessonText">
							问题描述：股四头肌和髋关节屈肌活跃，臀部
						</view>
					</view>
				</view> -->
			</view>
			<image class="imagebg" :src="backimgFront"/>
			<view class="imgbgText">
				点击上方蓝色标签选择问题部位，可多选
			</view>
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
					<video :src="SideVideoUrl" 
					wid 
					autoplay 
					loop 
					:controls="false"
					:custom-cache="false">
					</video>
					<view class="clickActionText">
						<view class="Actionname">标准动作：</view>
						<view>
							<p v-for="(item,index) in testText1">{{item}}</p>
						</view>
					</view>
					<view class="clickActionEnd" @click.native="closePopup">收起
					<image src="../../../static/app-plus/other/close.png"></image>
					</view>
				</view>
			</van-popup>
			
			<view class="actinQuessonContent">
				<view
				 v-for="(item,index) in quession2"
				 :style="item.style">
					<view class="quessonName" v-if="item.status" @click.stop="clickQ(item,1)">
						<p>{{item.answerTitle}}</p>
					</view>
					<view class="clickQuessonName" v-if="!item.status" @click.stop="clickQ(item,1)">
						<view class="quessonTitle">
							{{item.answerTitle}}
						</view>
						<view class="quessonText">
							<p style="color: #F04242;display: initial;">问题描述：</p>{{item.answeerContent}}
						</view>
					</view>
				</view>
				<!-- <view style="position: absolute;
							z-index: 2;
							top: 800upx;
							left: 60upx;">
					<view class="quessonName" v-if="false">
						<p>背部过度拱起</p>
					</view>
					<view class="clickQuessonName" v-if="true">
						<view class="quessonTitle">
							背部过度拱起
						</view>
						<view class="quessonText">
							问题描述：股四头肌和髋关节屈肌活跃，臀部
						</view>
					</view>
				</view>
				<view style="position: absolute;
							z-index: 2;
							top: 670upx;
							left: 530upx;">
					<view class="quessonName" v-if="true">
						<p>头部过度抬起</p>
					</view>
					<view class="clickQuessonName" v-if="false">
						<view class="quessonTitle">
							头部过度抬起
						</view>
						<view class="quessonText">
							问题描述：股四头肌和髋关节屈肌活跃，臀部
						</view>
					</view>
				</view>
				<view style="position: absolute;
							z-index: 2;
							top: 1040upx;
							left: 530upx;">
					<view class="quessonName" v-if="true">
						<p>胫骨和躯干不平衡</p>
					</view>
					<view class="clickQuessonName" v-if="false">
						<view class="quessonTitle">
							胫骨和躯干不平衡
						</view>
						<view class="quessonText">
							问题描述：股四头肌和髋关节屈肌活跃，臀部
						</view>
					</view>
				</view> -->
			</view>
			
			<image class="imagebg" :src="backimgSide"
			/>
			<view class="imgbgText">
				点击标签选择问题部位
			</view>
			<!-- <image
			  src="../../static/app-plus/bg/actionImg.png"
			></image> -->
		</view>
		<view class="bottom_style" @click.stop="actionResDate">保存</view>
	</view>
</template>

<script>
	import BgTheamCompontent from '@/components/bgTheamCompontent/bgTheamCompontent.vue'
	import NavBarCompontent from '@/components/navBarCompontent/navBarCompontent.vue'
	import { ref } from 'vue';
	const tesOb = uniCloud.importObject("testResults",{
		customUI : true
	});
	const busOb = uniCloud.importObject("businessCloudObject",{
		customUI : true
	});
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
						case "肩关节灵活性测试" :
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
					this.getData();
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
				clickQuession1:true,
				clickQuession2:true,
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
				squatFrontVideoUrl: "https://mp-4e6f1c48-a4dc-4897-a866-0a1a071023c3.cdn.bspapp.com/cloudstorage/5599d329-4a47-4db2-a2a5-1ee1bc5deb35.mp4",
				squatSideVideoUrl: "https://mp-4e6f1c48-a4dc-4897-a866-0a1a071023c3.cdn.bspapp.com/cloudstorage/925865b3-3f5d-4c4a-9cbf-27ba8cdc8f65.mp4",
				//胸椎活动视频
				thoracicSpineActivityUrl:"https://mp-4e6f1c48-a4dc-4897-a866-0a1a071023c3.cdn.bspapp.com/cloudstorage/6f77e7d9-77b3-455e-a378-75b05fb0848b.mp4",
				//直抬腿
				StraightLegLiftUrl:"https://mp-4e6f1c48-a4dc-4897-a866-0a1a071023c3.cdn.bspapp.com/cloudstorage/bda98240-b083-41da-bbf4-7168183791a1.mp4",
				//托马斯
				ThomasUrl:"https://mp-4e6f1c48-a4dc-4897-a866-0a1a071023c3.cdn.bspapp.com/cloudstorage/e971accd-2928-429b-86a1-e33f2d9e10aa.mp4",
				//肩关节灵活性测试1
				shoulderTest1Url:"https://mp-4e6f1c48-a4dc-4897-a866-0a1a071023c3.cdn.bspapp.com/cloudstorage/f682d0b8-f3e6-4159-9242-01854025d3a6.mp4",
				//肩关节灵活性测试2
				shoulderTest2Url:"https://mp-4e6f1c48-a4dc-4897-a866-0a1a071023c3.cdn.bspapp.com/cloudstorage/580f6bf5-c503-40d9-819c-b4a11412791e.mp4",
				//五，俯卧撑稳定性测试
				pushUpTestUrl:"https://mp-4e6f1c48-a4dc-4897-a866-0a1a071023c3.cdn.bspapp.com/cloudstorage/e27801c0-b63f-42f0-a5a4-68574a123e69.mp4",
				quession1:[],
				quession2:[],
				quession3:[],
				testText1:[],
				testText2:[],
				testText3:[],
				startData:[
					{clientX:'',clientY:''}
				]
			}
		},
		methods: {
			    start(e) {
			      console.log('开始下滑坐标', e.changedTouches[0].clientY)
			      this.startData.clientX = e.changedTouches[0].clientX
			      this.startData.clientY = e.changedTouches[0].clientY
			    },
			    end(e) {
			      console.log('结束下滑坐标', e.changedTouches[0].clientY)
			      const subX = e.changedTouches[0].clientX - this.startData.clientX
			      const subY = e.changedTouches[0].clientY - this.startData.clientY
			      if (subY < -50) {
			        console.log('下滑')
			        // 翻页
			      } else if (subY > 50) {
			        console.log('上滑')
			      } else if (subX > 50) {
			        console.log('左滑')
			        uni.reLaunch({
			          url: '/pages/dynamicEvaluation/dynamicEvaluation?'+'traineeNo=' + this.traineeNo+ '&questionCode=' + this.questionCode
			        })
			      } else if (subX < -50) {
			        console.log('右滑')
					uni.reLaunch({
					  url: '/pages/dynamicEvaluation/dynamicEvaluation?'+'traineeNo=' + this.traineeNo+ '&questionCode=' + this.questionCode
					})
			      } else {
			        console.log('无效')
			      }
			    },
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
						console.log(res.data);
						let index = res.data.length
						console.log(index);
						if(res.success){
							this.actionobs = res.data
							this.quession1 = this.actionobs[0].answer
							this.testText1 = this.actionobs[0].answerRemark.detailArray
							if(this.actionobs.length>1){
								this.quession2 = this.actionobs[1].answer
								this.testText2 = this.actionobs[1].answerRemark.detailArray
							}
							// console.log(this.actionobs);
							if(this.actionobs.length>2){
								this.quession3 = this.actionobs[2].answer
								this.testText3 = this.actionobs[2].answerRemark.detailArray
							}
						}
					})
				}
			},
			actionResDate(){
				console.log(this.actionobs)
					const data = {};
					data["traineeNo"] = this.traineeNo;
					data["questionCode"] = this.questionCode;
					data["code"] = this.type;
					data["actionTestResult"] = this.actionobs;
					data["status"] = "0";
					console.log(data)
					tesOb.opearConfig(data,"bodyTestReport").then(res => {
						console.log(res, '我要保存了')
						if (res.success) {
							uni.redirectTo({
								url: '/pages/dynamicEvaluation/dynamicEvaluation' +'?traineeNo=' + this.traineeNo + '&questionCode=' + this.questionCode
							})
							uni.showToast({
							  icon: 'success',
							  title: res.message,
							  duration: 800
							})
						}
					}).catch(() =>{})
			},
			clickQ(item,num){
				console.log(item)
				if(item.status){
					item.status = 0;
				}else{
					item.status = 1;
				}
				this.actionobs[num].answer.forEach((ans)=>{
					if(ans.answerTitle===item.answerTitle){
						ans.status = item.status
					}
				})
			}, 
			getData(){
				const data = {};
				data["traineeNo"] = this.traineeNo;
				data["questionCode"] = this.questionCode;
				data["code"] = this.type;
				const index = 0
				tesOb.opearPHConfigQuery(data).then((res)=>{
					if(res.success&&res.data.length!=0){
						console.log(res.data[0].actionTestResult);
						this.actionobs = res.data[0].actionTestResult
						this.quession1 = this.actionobs[0].answer
						this.testText1 = this.actionobs[0].answerRemark.detailArray
						if(this.actionobs.length>1){
							this.quession2 = this.actionobs[1].answer
							this.testText2 = this.actionobs[1].answerRemark.detailArray
						}
						if(this.actionobs.length>2){
							this.quession3 = this.actionobs[2].answer
							this.testText3 = this.actionobs[2].answerRemark.detailArray
						}
					}else{
						this.getActionInfo();
					}
				})
			}
		}
	}
</script>

<style>
.content_style{
	width: 100vw;
	overflow: hidden;
	position: relative;
}
.headBox{
	width: 100vw;
	height: 90upx;
	margin: 0 auto;
	margin-top: 20upx;
	margin-left: 30upx;
	overflow-x: hidden;
}
.block{
	width: 45vw;
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
	margin-right: 22upx;
}
.block1{
	width: 29vw;
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
	margin-right: 22upx;
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
.imgbgText{
	width: 100%;
	height: 80upx;
	background: #000000;
	opacity: 0.5;
	margin-top: -85upx;
	border-bottom-radius: 16upx;
	color: #BDC3CE;
	font-weight: 400;
	font-size: 28upx;
	text-align: center;
	line-height: 80upx;
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
	width: 660upx;
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
	margin-top: 620upx;
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
.actinQuesson1{
	position: absolute;
	z-index: 2;
	top: 800upx;
	left: 80upx;
}
.quessonName{
	width: 180upx;
	/* height: 80upx; */
	background: rgba(19,112,255,0.9);
	border-radius: 16upx;
	font-size: 26upx;
	font-weight: 600;
	color: #F4F7FF;
	/* line-height: 80upx; */
	padding-top: 20upx;
	padding-bottom: 24upx;
	padding-left: 15upx;
	padding-right: 10upx;
	/* text-align: center; */
}
.clickQuessonName{
	width: 200upx;
	/* height: 164upx; */
	background: rgba(19,112,255,0.9);
	border-radius: 16upx;
	border: 2upx solid #1370FF;
	padding: 20upx;
}
.quessonTitle{
	font-size: 26upx;
	font-weight: 600;
	color: #F4F7FF;
}
.quessonText{
	font-size: 18upx;
	font-weight: 400;
	color: #FFFFFF;
	margin-top: 20upx;
}
::v-deep .van-popup{
	background: #383D46;
}
</style>

<template>
	<view class="content_style">
		<BgTheamCompontent :theamType="'currency'"></BgTheamCompontent>
		<NavBarCompontent :leftNavTitle="leftNavTitle"></NavBarCompontent>
		<view class="body_content" id="bodycontent">
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
					<video src="../../../static/app-plus/video/pedalTest.mp4" wid autoplay>
					</video>
					<view class="clickActionText">
						<view class="Actionname">标准动作：</view>
						<view>
							<p>1.踏板高度，30厘米高度。4块支撑即可。</p>
							<p>2.在做测试前，热身放松5分钟。</p>
							<p>3.踏步频率，正常上下楼梯频率。大概每分钟96步。</p>
							<p>4.在评估结束后，立刻检测心率。记录下来。</p>
						</view>
					</view>
				</view>
				<view class="clickActionEnd" @click.native="closePopup">收起
				<image src="../../../static/app-plus/other/close.png"></image>
				</view>
			</van-popup>
			<image :src="imgUrl" class="contentImg"></image>
			<view class="contentBlock">
				<van-row>
				  <van-col span="16">
					  <view class="testText">请填写心率</view>
					  <view class="testInput">
						  <view>
							  <van-field 
							  v-model.number="resultValue" 
							  class="inputBlock"
							  @blur="testResult()"
							  type="number"/>
						  </view>
						  <view class="inputText">/分</view>
					  </view>
				  </van-col>
				  <van-col span="8">
					  <view class="dynamicshow_right">
					    <van-circle
					      v-model:current-rate="currentRate"
					      :rate="100"
					      :speed="400"
					      :text="typeText"
					      :layer-color="typeColor"
					      :color="typeColor"
					      :style="'--van-circle-text-color:'+ typeColor"
					    />
					  </view>
				  </van-col>
				</van-row>
			</view>
		</view>
		<view>
		  <van-button type="primary" class="postureButton">确认</van-button>
		</view>
	</view>
</template>

<script>
	import BgTheamCompontent from '@/components/bgTheamCompontent/bgTheamCompontent.vue'
	import NavBarCompontent from '@/components/navBarCompontent/navBarCompontent.vue'
	import { ref } from 'vue';
	const testOb = uniCloud.importObject("testResults");
	export default {
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
				gender:"1",
				age:29,
				resValue:80,
				resultValue:0,
				typeText:"待测",
				typeColor:"#4B525E",
				imgUrl:'../../../static/app-plus/bg/pedalTest.png',
				leftNavTitle:''
			}
		},
		methods: {
			async testResult(){
				const gender = this.gender;
				const age = this.age;
				const resValue = this.resultValue;
				console.log(gender,age,resValue)
				const res = testOb.method1(gender,age,resValue)
				console.log(res)
				const type = (await res).data;
				if(type.length == 0){
					this.typeText = "待测";
				}else{
				this.typeText = type[0].resultLevel;
				this.levelColor(this.typeText)
				}
			},
			levelColor(levelType){
				switch(levelType){
					case "优秀":
					case "良好":
						this.typeColor = "#01E08C";
						break;
					case "中等":
					case "中上等":
					case "中下等":
						this.typeColor = "#FFC13C";
						break;
					case "较差":
					case "非常差":
						this.typeColor = "#F04242";
						break;
					default:
						this.typeColor = "#4B525E";
						break;
				}
			}
		}
	}
</script>

<style>
.content_style {
	width: 100vw;
	height: 100vh;
	overflow: hidden;
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
.contentImg{
	width: calc(100vw - 60upx);
	height: 1062upx;
	margin-top: 20upx;
	margin-left: 30upx;
	position: relative;
}
.contentBlock{
	width: calc(100vw - 60upx);
	height: 280upx;
	background: #383D46;
	margin-top: -5upx;
	margin-left: 30upx;
	border-radius: 0px 0px 16px 16px;
}
.testText{
	width: 180upx;
	height: 50upx;
	font-size: 36upx;
	font-family: PingFangSC-Semibold, PingFang SC;
	font-weight: 600;
	color: #F4F7FF;
	line-height: 50upx;
	margin-top: 40upx;
	margin-left: 40upx;
}
.testInput{
	width: 240upx;
	height: 90upx;
	background: #4B525E;
	border-radius: 16upx;
	margin-top: 40upx;
	margin-top: 40upx;
	margin-left: 40upx;
	position: relative;
}
::v-deep .inputBlock{
	width: 120upx;
	background-color: #4B525E;
	border-radius: 16upx;
	position: absolute;
	--van-field-input-text-color:#F4F7FF;
}

.inputText{
	width: 46upx;
	height: 42upx;
	font-size: 30upx;
	font-weight: 400;
	color: #BDC3CE;
	line-height: 42upx;
	position: absolute;
	top:23upx;
	left: 160upx;
}
.dynamicshow_right{
	width: 180upx;
	height: 180upx;
	margin-top: 40upx;
}
.postureButton {
  width: 690upx;
  height: 100upx;
  background: #1370ff;
  border-radius: 16upx;
  margin-left: 30upx;
  margin-top: 40upx;
}
.clickAction{
	width: 260upx;
	height: 70upx;
	background: #000000;
	border-radius: 36upx;
	opacity: 0.5;
	position:absolute;
	top: 125upx;
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
}
.clickActionEnd image{
	width: 32upx;
	height: 32upx;
	top: 6upx;
}
</style>

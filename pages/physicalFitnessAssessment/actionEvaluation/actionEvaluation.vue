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
					<video :src="videoUrl" wid autoplay>
					</video>
					<view class="clickActionText">
						<view class="Actionname">标准动作：</view>
						<view>
							<p v-for="(item,index) in actionData.answerRemark.detailArray">{{item}}</p>
						</view>
					</view>
					<view class="clickActionEnd" @click.native="closePopup">收起
					<image src="../../../static/app-plus/other/close.png"></image>
					</view>
				</view>
			</van-popup>
			<image :src="imgUrl" class="contentImg"></image>
			<view class="contentBlock">
				<van-row>
				  <van-col span="16">
					  <view class="testText" v-if="actionData.code=='F0001'">请填写心率</view>
					  <view class="testText" v-else>请填写数量</view>
					  <view class="testInput">
						  <view>
							  
							  <!-- <van-field 
							  v-model.number="resultValue" 
							  class="inputBlock"
							  @blur="testResult()"
							  type="number"/> -->
							  <input class="inputBlock" type="number" v-model="resultValue" placeholder="请填写"/>
						  </view>
						  <view class="inputText" v-if="actionData.code=='F0001'">/分</view>
						  <view class="inputText" v-else>/个</view>
					  </view>
				  </van-col>
				  <van-col span="8">
					  <view class="dynamicshow_right">
					    <!-- <van-circle
					      v-model:current-rate="currentRate"
					      :rate="100"
					      :speed="400"
					      :text="typeText"
					      :layer-color="typeColor"
					      :color="typeColor"
					      :style="'--van-circle-text-color:'+ typeColor"
					    /> -->
						<view class="circle" :style="'border: 4px solid '+typeColor+';'+'background-color:'+backgroundColor+';'">
							<view class="circleText" :style="'color:'+typeColor+';'">{{typeText}}</view>
						</view>
					  </view>
				  </van-col>
				</van-row>
			</view>
		</view>
		<view>
		  <view class="postureButton" @click.native="actionResDate()">确认</view>
		</view>
	</view>
</template>

<script>
	import BgTheamCompontent from '@/components/bgTheamCompontent/bgTheamCompontent.vue';
	import NavBarCompontent from '@/components/navBarCompontent/navBarCompontent.vue';
	import { ref } from 'vue';
	const testOb = uniCloud.importObject("testResults",{
		customUI : true
	});
	const actionOb = uniCloud.importObject("businessCloudObject",{
		customUI : true
	});
	import { debounce } from '@/common/util.js';
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
		  created() {
		  	uni.hideLoading();
		  },
		onLoad: function (item) {
				// console.log(JSON.parse(item.data));
				let data = JSON.parse(item.data);
				this.actionData = data
				console.log(this.actionData)
				this.leftNavTitle = this.actionData.questionContent
				this.imgUrl = this.actionData.url;
				this.videoUrl = this.actionData.answerRemark.url;
				// console.log(this.imgUrl+"||"+this.videoUrl)
				this.traineeNo = item.traineeNo;
				this.questionCode = item.questionCode;
				this.codes = this.actionData.code;
				this.getTraineeInfo();
				this.getData();
		},
		watch:{
			resultValue(newResultValue,oldResultValue){
				debounce(this.testResult(),400)
			}
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
				resultValue:'',
				codes:'',
				typeText:"待测",
				actionData:[],
				typeColor:"#4B525E",
				imgUrl:'',
				leftNavTitle:'',
				videoUrl:'',
				traineeNo:'',
				questionCode:'',
				restData:[{
					traineeNo:'',
					questionCode:'',
					testResult:[],
					userId:'',
					status:"0"
				}],
				backgroundColor:'rgba(56,61,70, 1)'
			}
		},
		methods: {
			async testResult(){
				const gender = this.gender;
				const age = this.age;
				const resValue = Number(this.resultValue);
				const type = {};
				// console.log(gender,age,resValue)
				testOb.method1(gender,age,resValue,this.codes).then((res)=>{
					console.log(res.data)
					let numberAge = Number(this.age);
					res.data.forEach((r)=>{
						// console.log(r)
						// console.log(this.age)
						if(numberAge>r.minimumAge&&numberAge<r.maximumAge){
							console.log(r)
							if((resValue>r.minimumResult&&resValue<r.maximumResult)||resValue==r.minimumResult||resValue==r.maximumResult){
								console.log(r)
								this.typeText = r.resultLevel;
								this.levelColor(this.typeText)
							}
						}
					})
				})
				console.log(resValue)
			},
			async getTraineeInfo(){
				const data = {};
				let birth = '';
				data["traineeId"] = this.traineeNo;
				const res = testOb.getOnlyList(data).then((res)=>{
					if(res.success){
						console.log(res.data[0].birthday)
						this.gender = res.data[0].gender;
						birth = res.data[0].birthday
						this.age = Number(this.getAge(birth));
						// console.log(this.age+"-----"+this.gender)
					}
				});
			},
			getAge(birthday){//根据日期算年龄
			          birthday=birthday.split('-');
			          // 新建日期对象
			          let date = new Date();
			          // 今天日期，数组，同 birthday
			          let today = [date.getFullYear(), date.getMonth() + 1, date.getDate()];
			          // 分别计算年月日差值
			          let age = today.map((val, index) => {
			              return val - birthday[index]
			          })
			          // 当天数为负数时，月减 1，天数加上月总天数
			          if (age[2] < 0) {
			              // 简单获取上个月总天数的方法，不会错
			              let lastMonth = new Date(today[0], today[1], 0)
			              age[1]--
			              age[2] += lastMonth.getDate()
			          }
			          // 当月数为负数时，年减 1，月数加上 12
			          if (age[1] < 0) {
			              age[0]--
			              age[1] += 12
			          }
			          console.log(age[0]+'岁'+age[1]+'月'+age[2]+'天');
					  return age[0];
			},
			levelColor(levelType){
				console.log(levelType)
				switch(levelType){
					case "优秀":
					case "良好":
						this.typeColor = "rgba(1, 224, 140, 1)";
						this.backgroundColor = "rgba(53, 68, 73, 0.5)"
						break;
					case "中等":
					case "中上等":
					case "中下等":
					case "尚可":
						this.typeColor = "rgba(255, 193, 60, 1)";
						this.backgroundColor = "rgba(66, 67, 69, 0.5)"
						break;
					case "较差":
					case "非常差":
					case "需改善":
						this.typeColor = "rgba(240, 66, 66, 1)";
						this.backgroundColor = "rgba(65, 60, 69, 0.5)"
						break;
					default:
						this.typeColor = "rgba(75, 82, 94, 1)";
						break;
				}
			},
			actionResDate(){
					const data = {};
					const actinData = {};
					data["traineeNo"] = this.traineeNo;
					data["questionCode"] = this.questionCode;
					data["code"] = this.actionData.code;
					actinData["actionVlue"] = this.resultValue;
					actinData["actionTypeText"] = this.typeText
					data["testDate"] = new Date();
					data["physicalData"] = actinData;
					data["status"] = "0";
					console.log(data)
					const res = testOb.opearConfig(data,"bodyTestReport").then(res => {
						console.log(res, '我要保存了')
						if (res.success) {
							uni.redirectTo({
								url: '/pages/physicalFitnessAssessment/physicalFitnessAssessment' +'?traineeNo=' + this.traineeNo + '&questionCode=' + this.questionCode
							})
							uni.showToast({
							  icon: 'success',
							  title: res.message,
							  duration: 800
							})
						}
					}).catch(() =>{})
					console.log(res)
			},
			getData(){
				const data = {}
				data['traineeNo'] = this.traineeNo
				data['questionCode'] = this.questionCode;
				data['code'] = this.codes
				testOb.opearPHConfigQuery(data).then((res)=>{
					console.log(res.data)
					this.resultValue = res.data[0].physicalData.actionVlue
				}).catch(()=>{
					this.resultValue = ''
				})
			}
		}
	}
</script>

<style>
.content_style {
	width: 100vw;
	height: 100vh;
	overflow: hidden;
	padding-top: 40upx;
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
	margin-bottom: -10upx;
	position: relative;
	border-radius: 16px 16px 0px 0px;
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
.inputBlock{
	width: 120upx;
	background-color: #4B525E;
	border-radius: 16upx;
	position: absolute;
	color: #F4F7FF;
	top:20upx;
	left: 40upx;
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
  justify-content: center;
  
  width: calc(100vw - 80upx);
  margin-left: 40upx;
  
  display: flex;
}
.clickAction{
	width: 260upx;
	height: 70upx;
	background: #000000;
	border-radius: 36upx;
	opacity: 0.5;
	position:absolute;
	top: 220upx;
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
	height: 1491upx;
	background: #383D46;
	border-radius: 16upx;
	z-index: 999;
}
::v-deep .clickActionContent{
	width: calc(100vw - 60upx);
	height: 1490upx;
	margin-top: 200upx;
	margin-left: 30upx;
	background-color: #383D46;
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
	margin-top: 666upx;
}
.clickActionEnd image{
	width: 32upx;
	height: 32upx;
	top: 6upx;
}
.circle{
	width: 100px;
	 height: 100px; 
	 border: 4px solid #4B525E;    
	 border-radius: 100px;
	 line-height: 100px;
}
.circleText{
	width: 120upx;
	height: 50upx;
	font-size: 36upx;
	font-weight: 600;
	color: #BDC3CE;
	text-align: center;
	margin: 0 auto;
}
/* ::-webkit-input-placeholder { 
  color: white;
} */
</style>

<template>
  <view class="content_style">
    <BgTheamCompontent :theamType="'currency'"></BgTheamCompontent>
    <!-- <NavBarCompontent :leftNavTitle="'体能评估'"></NavBarCompontent> -->
	<view class="arrow-left" :class="{show:isFixedTop}" @click="onClickBack">
		<van-icon name="arrow-left" />
		<view class="title">体能评估</view>
		<view class="z" style="opacity: 0;">8888</view>
	</view>
	<view class="watermark">数据评测来源于世界权威机构</view>
    <van-row style="background-color: #343a44">
      <van-col class="need_scoll" span="24">
        <view
          class="dynamicshow"
          v-for="(item, index) in queryData"
          :key="index"
        >
          <view class="dynamicshow_left" v-if="item.type > 0">
            <text class="evaluationdata">
              {{ item.questionContent }}
            </text>
			<button class="dynamicshow_button buttonYes" @click.native="jumpModular(item)">重新测试<image src="../../static/app-plus/other/arrows.png"/></button>
          </view>
          <view class="dynamicshow_left" v-else>
            <text class="evaluationdata">
              {{ item.questionContent }}
            </text>
            <!-- <van-button
              round
              type="primary"
              color="#1370FF"
              class="dynamicshow_button"
              icon="../../static/app-plus/other/arrows.png"
              icon-position="right"
			  @click.native="jumpModular(item)"
              >开始测试</van-button
            > -->
			<button class="dynamicshow_button buttonNo" @click.native="jumpModular(item)">开始测试<image src="../../static/app-plus/other/arrows.png"/></button>
          </view>
          <view class="dynamicshow_right">
            <!-- <van-circle
              v-model:current-rate="currentRate"
              :rate="100"
              :speed="400"
              :text="item.typeText"
              :layer-color="item.typeColor"
              :color="item.typeColor"
              :style="'--van-circle-text-color:'+ item.typeColor"
            /> -->
			<view class="circle" :style="'border: 4px solid '+item.typeColor+';'">
				<view class="circleText" :style="'color:'+item.typeColor+';'">{{item.typeText}}</view>
			</view>
          </view>
        </view>
      </van-col>
    </van-row>
    <view>
    <!--  <van-button type="primary" class="postureButton" @click.native="getdynamicEvaluationdata()">确认</van-button> -->
	  <view class="bottom_style" @click.stop="getdynamicEvaluationdata()">确认</view>
    </view>
  </view>
</template>

<script>
import BgTheamCompontent from '@/components/bgTheamCompontent/bgTheamCompontent.vue'
import NavBarCompontent from '@/components/navBarCompontent/navBarCompontent.vue'
const testOb = uniCloud.importObject("testResults");
const busOb = uniCloud.importObject("businessCloudObject");
export default {
  components: {
    BgTheamCompontent,
    NavBarCompontent
  },
  data() {
    return {
	  traineeNo:'',
	  questionCode:'',
      currentRate: 50,
	  age:29,
	  gender:"1",
	  resultValue:0,
	  typeText:"待测",
	  typeColor:"#4B525E",
	  queryData:{},
      queryUserActionData:{}
    }
  },
  onLoad:function(item){
		console.log(item)
		this.traineeNo = item.traineeNo;
		this.questionCode = item.questionCode;
		this.getconfingActionName();
  },
  methods: {
    jumpModular(item) {
      console.log(item.path, '>>>>')
      uni.navigateTo({
        url: item.path + '?' + 'data=' + JSON.stringify(item) + '&traineeNo=' + this.traineeNo + '&questionCode=' + item.parentCode ,
        success: (res) => {},
        fail: () => {},
        complete: () => {}
      })
    },
	//通过传入的type值来更新等级颜色
	levelColor(levelType){
		switch(levelType){
			case "优秀":
			case "良好":
				return "rgba(1, 224, 140, 1)";
				break;
			case "中等":
			case "中上等":
			case "中下等":
				return "#FFC13C";
				break;
			case "较差":
			case "非常差":
				return "#F04242";
				break;
			default:
				return "#4B525E";
				break;
		}
	},
	//获取运动表
	getconfingActionName(){
		const data = {};
		data["traineeNo"] = this.traineeNo;
		data["questionCode"] = this.questionCode;
		testOb.opearConfigQuery(data).then((res)=>{
			console.log(res)
			if(res.success){
				this.queryUserActionData = res.data
				busOb.getPhysicalChildAssessmentList("A0005").then((res)=>{
					this.queryData = res.data;
					this.queryData.forEach((item)=>{
						item['typeText']='待测';
						item['type']=0;
						item['typeColor'] = this.levelColor(item.typeText);
						item['path'] = '/pages/physicalFitnessAssessment/actionEvaluation/actionEvaluation';
						console.log(item)
					})
					for(let j = 0;j<this.queryUserActionData.length;j++){
						for(let i=0;i<this.queryData.length;i++){
							console.log(this.queryData[i].code===this.queryUserActionData[j].code)
							if(this.queryData[i].code===this.queryUserActionData[j].code){
								this.queryData[i].typeText=this.queryUserActionData[j].physicalData.actionTypeText;
								this.queryData[i].type=this.queryUserActionData[j].physicalData.actionVlue;
								this.queryData[i].typeColor = this.levelColor(this.queryUserActionData[j].physicalData.actionTypeText);
								continue;
							}
						}
					}
					console.log(this.queryData)
				}).catch((err)=>{
				});
			}
		}).catch();
		
	},
	getdynamicEvaluationdata(){
		uni.redirectTo({
			url: '/pages/physicalAssessment/physicalAssessment' +'?traineeNo=' + this.traineeNo + '&questionCode=' + this.questionCode
		})
	},
	onClickBack(){
		uni.redirectTo({
			url: '/pages/physicalAssessment/physicalAssessment' +'?traineeNo=' + this.traineeNo + '&questionCode=' + this.questionCode
		})
	}
	// actionResDate(){
		
	// }
  }
}
</script>

<style lang="scss" scoped>
.content_style {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  position: relative;
  background: rgba(33, 35, 40, 1);
.arrow-left{
  	// top: var(--status-bar-height);
  	// left: 0;
  	// right: 0;
  	z-index: 88;
  	height: 88upx;
  	display: flex;
  	align-items: center;
  	padding-left: 30upx;
  	color: #bdc3ce;
  	position: relative;
	margin-top: 40upx;
  	.van-icon{
  		font-size: 40upx;
  		color: #bdc3ce;
  	}
  	// &.show{
  	// 	position: sticky;
  	// 	background: #212328;
  	// 	top: 0;
  	// 	padding-top: var(--status-bar-height);
  	// }
  }
}
.title{
	    margin-left: 10px;
	    font-size: 24px;
	    font-weight: 600;
	    color: #FFFFFF;
}
/* .dynamicshow {
  width: calc(100vw - 220upx);
  overflow-y: auto;
  background-color: rgba(33, 35, 40, 1);
  margin-left: 30upx;
  margin-top: 30upx;
  padding: 0 30upx 0 30upx;
  height: 280upx;
  border-radius: 24upx;
  position: relative;
} */
.need_scoll{
	background-color: rgba(33, 35, 40, 1);
}
.dynamicshow {
  width: calc(100vw - 60upx);
  overflow-y: auto;
  background-color: #383d46;
  margin-left: 30upx;
  margin-top: 30upx;
  height: 280upx;
  border-radius: 24upx;
  position: relative;
  font-size: 36upx;
  color: #f4f7ff;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.dynamicshow_left {
  /* display: flex; */
  margin-left: 30upx;
  align-items: center;
}
.buttonNo{
	background: #1370FF;
}
.buttonYes{
	background: #4B525E;
}
.dynamicshow_button {
  width: 220upx;
  height: 80upx;
  
  border-radius: 42px;
  border: 0px none;
  line-height: 80upx;
  font-size: 30upx;
  font-weight: 600;
  color: #F4F7FF;
  margin: 0;
}
.dynamicshow_button image{
	width: 30upx;
	height: 32upx;
	top: 7upx;
}
.dynamicshow_right {
  margin-right: 70upx;
  --van-circle-text-font-weight: 600;
  --van-circle-text-font-size: 36upx;
}
.evaluationdata {
  font-size: 36upx;
  color: #f4f7ff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 252upx;
  height: 50upx;
  margin-bottom: 74upx;
  font-weight: 600;
  color: #ffffff;
  /* line-height: 50px; */
}
.postureButton {
  width: calc(100vw - 60upx);
  height: 100upx;
  background: #1370ff;
  border-radius: 16upx;
  margin-left: 30upx;
  margin-top: 40upx;
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
	margin: 0 auto;
	text-align: center;
}
.watermark{
	position: absolute;
	font-size: 24upx;
	font-family: PingFangSC-Regular, PingFang SC;
	font-weight: 400;
	color: #7A7F89;
	top: 70upx;
	right: 50upx;
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

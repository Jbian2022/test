<template>
  <view class="content_style">
    <BgTheamCompontent :theamType="'currency'"></BgTheamCompontent>
    <NavBarCompontent :leftNavTitle="'体能评估'"></NavBarCompontent>
    <van-row style="background-color: #343a44">
      <van-col class="need_scoll" span="24">
        <view
          class="dynamicshow"
          v-for="(item, index) in dynamicEvaluationdata"
          :key="index"
        >
          <view class="dynamicshow_left" v-if="item.type > 0">
            <text class="evaluationdata">
              {{ item.title }}
            </text>
            <van-button
              round
              type="primary"
              class="dynamicshow_button"
              icon="../../static/app-plus/other/arrows.svg"
              icon-position="right"
              @click.native="jumpModular(item)"
              >重新测试</van-button
            >
          </view>
          <view class="dynamicshow_left" v-else>
            <text class="evaluationdata">
              {{ item.title }}
            </text>
            <van-button
              round
              type="primary"
              color="#1370FF"
              class="dynamicshow_button"
              icon="../../static/app-plus/other/arrows.svg"
              icon-position="right"
              >开始测试</van-button
            >
          </view>
          <view class="dynamicshow_right">
            <van-circle
              v-model:current-rate="currentRate"
              :rate="100"
              :speed="400"
              :text="item.typeText"
              :layer-color="item.typeColor"
              :color="item.typeColor"
              :style="'--van-circle-text-color:'+ item.typeColor"
            />
          </view>
        </view>
      </van-col>
    </van-row>
    <view>
      <van-button type="primary" class="postureButton">确认</van-button>
    </view>
  </view>
</template>

<script>
import BgTheamCompontent from '@/components/bgTheamCompontent/bgTheamCompontent.vue'
import NavBarCompontent from '@/components/navBarCompontent/navBarCompontent.vue'
const testOb = uniCloud.importObject("testResults");
export default {
  components: {
    BgTheamCompontent,
    NavBarCompontent
  },
  data() {
    return {
      currentRate: 50,
	  age:29,
	  gender:"1",
	  resultValue:0,
	  typeText:"待测",
	  typeColor:"#4B525E",
      dynamicEvaluationdata: [
        {
          title: '俯卧撑耐力测试',
          type: 60,
          path: '/pages/physicalFitnessAssessment/actionEvaluation/actionEvaluation?pageName=俯卧撑耐力测试',
		  typeColor: "#4B525E",
		  typeText:"待测"
		},
        {
          title: '卷腹测试',
          type: 30,
          path: '/pages/physicalFitnessAssessment/actionEvaluation/actionEvaluation?pageName=卷腹测试',
		  typeColor: "#4B525E",
		  typeText:"待测"
		},
        {
          title: '三分钟踏板测试',
          type: 80,
          path: '/pages/physicalFitnessAssessment/actionEvaluation/actionEvaluation?pageName=三分钟踏板测试',
		  typeColor: "#4B525E",
		  typeText:"待测"
		},
        {
          title: '自重深蹲测试',
          type: 0,
          path: '/pages/physicalFitnessAssessment/actionEvaluation/actionEvaluation?pageName=自重深蹲测试',
          typeColor: "#4B525E",
		  typeText:"待测"
		}
      ]
    }
  },
  onShow () {
  	this.pedalTest();
  },
  methods: {
    jumpModular(item) {
      console.log(item.path, '>>>>')
      uni.navigateTo({
        url: item.path,
        success: (res) => {},
        fail: () => {},
        complete: () => {}
      })
    },
	async pedalTest(){
		const length = this.dynamicEvaluationdata.length;
		let i = 0; 
		for(i; i < length; i++){
			if(this.dynamicEvaluationdata[i].title == '三分钟踏板测试'){
				console.log(this.dynamicEvaluationdata[i].type)
				this.resultValue = this.dynamicEvaluationdata[i].type;
				break;
			}
			// this.dynamicEvaluationdata[i]["typeColor"]=this.typeColor;
		}
		const gender = this.gender;
		const age = this.age;
		const resValue = this.resultValue;
		console.log(gender+","+age+","+resValue)
		const res = testOb.method1(gender,age,resValue)
		// const res = testOb.method1("1",29,80)
		console.log(res)
		const type = (await res).data;
		if(type.length == 0){
			this.typeText = "待测";
		}else{
		this.typeText = type[0].resultLevel;
		this.dynamicEvaluationdata[i].typeText = this.typeText;
		this.levelColor(this.typeText)
		}
		// this.dynamicEvaluationdata[i]["typeColor"]=this.typeColor;
		this.dynamicEvaluationdata[i].typeColor = this.typeColor;
		console.log(this.dynamicEvaluationdata[i])
		console.log(type[0].resultLevel)
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
  position: relative;
  background: #383d46;
}
.dynamicshow {
  width: calc(100vw - 220upx);
  overflow-y: auto;
  background-color: #383d46;
  margin-left: 30upx;
  margin-top: 30upx;
  padding: 0 30upx 0 30upx;
  height: 280upx;
  background: #383d46;
  border-radius: 24upx;
  position: relative;
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
.dynamicshow_button {
  width: 220upx;
  height: 80upx;
  background: #4b525e;
  border-radius: 42px;
  border: 0px none;
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
  line-height: 50px;
}
.postureButton {
  width: 690upx;
  height: 100upx;
  background: #1370ff;
  border-radius: 16upx;
  margin-left: 30upx;
  margin-top: 40upx;
}
</style>

<template>
  <view class="content_style">
    <BgTheamCompontent :theamType="'currency'"></BgTheamCompontent>
    <NavBarCompontent :leftNavTitle="'体能评估'"></NavBarCompontent>
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
              {{ item.questionContent }}
            </text>
            <van-button
              round
              type="primary"
              color="#1370FF"
              class="dynamicshow_button"
              icon="../../static/app-plus/other/arrows.svg"
              icon-position="right"
			  @click.native="jumpModular(item)"
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
      <van-button type="primary" class="postureButton" @click.native="getdynamicEvaluationdata()">确认</van-button>
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
  onShow() {
  	this.getconfingActionName();
  },
  onLoad:function(item){
		const res = JSON.parse(item.childList);
		console.log(item)
		this.traineeNo = item.traineeNo;
		this.questionCode = item.questionCode;
		
		// const actionData = 
		// const res1 = this.queryData.find((datas) => datas.code+'' == 'F0002' );
		// console.log(res1);
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
	//获取当前用户已有锻炼数据
	async pedalTest(){
		const datas = (await this.findConfigData()).data;
		this.queryUserActionData = datas;
		console.log(this.queryUserActionData)
	},
	//通过传入的type值来更新等级颜色
	levelColor(levelType){
		switch(levelType){
			case "优秀":
			case "良好":
				return "#01E08C";
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
	findConfigData(){
		const data = {};
		data["traineeNo"] = this.traineeNo;
		data["questionCode"] = this.questionCode;
		const res = busOb.opearConfigQuery(data);
		return res;
	},
	//获取运动表
	async getconfingActionName(){
		this.pedalTest();
		const res = await busOb.getPhysicalChildAssessmentList("A0005");
		this.queryData = res.data;
		for(let z=0;z<this.queryData.length;z++){
			this.queryData[z]['typeText']='待测';
			this.queryData[z]['type']=0;
			this.queryData[z]['typeColor'] = this.levelColor(this.queryData[z].typeText);
			this.queryData[z]['path'] = '/pages/physicalFitnessAssessment/actionEvaluation/actionEvaluation';
		}
		console.log(this.queryData)
		for(let j = 0;j<this.queryUserActionData.length;j++){
			for(let i=0;i<this.queryData.length;i++){
				console.log(this.queryData[i].code===this.queryUserActionData[j].code)
				if(this.queryData[i].code===this.queryUserActionData[j].code){
					this.queryData[i].typeText=this.queryUserActionData[j].testResult.actionTypeText;
					this.queryData[i].type=this.queryUserActionData[j].testResult.actionVlue;
					this.queryData[i].typeColor = this.levelColor(this.queryUserActionData[j].testResult.actionTypeText);
					continue;
				}
			}
		}
		
	},
	
	// actionResDate(){
		
	// }
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
  /* line-height: 50px; */
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

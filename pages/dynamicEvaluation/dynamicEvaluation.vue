<template>
  <view class="content_style" @touchstart="start" @touchend="end">
    <BgTheamCompontent :theamType="'currency'"></BgTheamCompontent>
    <!-- <NavBarCompontent :leftNavTitle="'动态评估'"></NavBarCompontent> -->
	<view class="arrow-left" :class="{show:isFixedTop}" @click="onClickBack">
		<van-icon name="arrow-left" />
		<view class="title">动态评估</view>
		<view class="z" style="opacity: 0;">8888</view>
	</view>
	<view class="watermark">数据评测来源于世界权威机构</view>
    <van-row>
      <van-col class="need_scoll" span="24">
        <view
          class="dynamicshow"
          v-for="(item, index) in dynamicEvaluationdata"
		  @click.native="jumpModular(item)"
          :key="index"
        >
          <view class="dynamicshow_left">
            <view class="correct" v-if="!item.icon">
              <image
                class="correct_img_style"
                src="../../static/app-plus/other/yesActive.png"
              ></image>
            </view>

            <view class="correct" v-if="item.icon">
              <image
                class="correct_img_style"
                src="../../static/app-plus/other/yesNoActive.png"
              ></image>
            </view>
            <text class="evaluationdata">
              {{ item.title }}
            </text>
          </view>

          <view class="dynamicshow_right">
            <image
              class="back_img_style"
              src="../../static/app-plus/mebrs/backRight.png"
            ></image>
          </view>
        </view>
      </van-col>
    </van-row>
    <!-- <van-button type="primary" block class="buttontrue" @click.native="getdynamicEvaluationdata()">确认</van-button> -->
	<view class="bottom_style" @click.stop="getdynamicEvaluationdata()">保存</view>
  </view>
</template>

<script>
import BgTheamCompontent from '@/components/bgTheamCompontent/bgTheamCompontent.vue'
import NavBarCompontent from '@/components/navBarCompontent/navBarCompontent.vue'
const busOb = uniCloud.importObject("businessCloudObject",{
		customUI : true
	})
const testOb = uniCloud.importObject("testResults",{
		customUI : true
	})
export default {
  components: {
    BgTheamCompontent,
    // NavBarCompontent
  },
  data() {
    return {
      dynamicEvaluationdata: [
        { title: '自重深蹲评估', type: 'E0001',path:'/pages/dynamicEvaluation/actionEvaluation/actionEvaluation?pageTitle=自重深蹲评估',icon:true},
        { title: '胸椎活动评估', type: 'E0002' ,path:'/pages/dynamicEvaluation/actionEvaluation/actionEvaluation?pageTitle=胸椎活动评估',icon:true},
        { title: '柔韧性测试', type: 'E0003' ,path:'/pages/dynamicEvaluation/actionEvaluation/actionEvaluation?pageTitle=柔韧性测试',icon:true},
        { title: '肩关节灵活性测试', type: 'E0004' ,path:'/pages/dynamicEvaluation/actionEvaluation/actionEvaluation?pageTitle=肩关节灵活性测试',icon:true},
        { title: '俯卧撑稳定性测试', type: 'E0005' ,path:'/pages/dynamicEvaluation/actionEvaluation/actionEvaluation?pageTitle=俯卧撑稳定性测试',icon:true}
      ],
      icon: true,
	  traineeNo:'',
	  questionCode:'',
	  startData:[
	  	{clientX:'',clientY:''}
	  ]
    }
  },
  created() {
  	this.getPageData()
  },
  onLoad: function (item) {
		console.log(item)
		this.traineeNo = item.traineeNo;
		this.questionCode = item.questionCode;
		this.getPageData()
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
	            url: '/pages/physicalAssessment/physicalAssessment?'+'traineeNo=' + this.traineeNo
	          })
	        } else if (subX < -50) {
	          console.log('右滑')
			  uni.reLaunch({
			    url: '/pages/physicalAssessment/physicalAssessment?'+'traineeNo=' + this.traineeNo
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
	jumpModular(item) {
	  console.log(item.path,'>>>>')
	  uni.navigateTo({
	    url: item.path+"&type=" + item.type+'&traineeNo=' + this.traineeNo + '&questionCode=' + this.questionCode,
	    success: (res) => {},
	    fail: () => {},
	    complete: () => {}
	  })
	},
	getPageData(){
		const data = {};
		data["traineeNo"] = this.traineeNo;
		data["questionCode"] = this.questionCode;
		console.log(data)
		busOb.opearConfigQuery(data).then((res)=>{
			console.log(res.data)
			res.data.forEach((item)=>{
				this.dynamicEvaluationdata.filter((v)=>{
					let resq = item.code == v.type;
					console.log(resq)
					if(resq){
						v.icon = false;
					}
				})
			})
		})
	},
	getdynamicEvaluationdata(){
		console.log(this.traineeNo)
		uni.redirectTo({
			url: '/pages/physicalAssessment/physicalAssessment' +'?traineeNo=' + this.traineeNo + '&questionCode=' + this.questionCode
		})
	},
	onClickBack(){
		uni.redirectTo({
			url: '/pages/physicalAssessment/physicalAssessment' +'?traineeNo=' + this.traineeNo + '&questionCode=' + this.questionCode
		})
	}
  }
}
</script>

<style lang="scss" scoped>
.content_style {
  width: 100vw;
  overflow: hidden;
  position: relative;
  padding-top: 40upx;
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
  		font-size: 45upx;
  		color: #fff;
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
.need_scoll{
	// background-color: rgba(33, 35, 40, 1);
}
.dynamicshow {
  width: calc(100vw - 60upx);

  overflow-y: auto;
  background-color: #383d46;
  margin-left: 30upx;
  margin-top: 30upx;
  height: 210upx;
  border-radius: 24upx;
  position: relative;

  font-size: 36upx;
  color: #f4f7ff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .dynamicshow_left {
    display: flex;
    align-items: center;
    .correct {
      width: 34upx;
      height: 29upx;
      // position: absolute;
      margin-left: 60upx;
      margin-right: 30upx;
      .correct_img_style {
        width: 40upx;
        height: 42upx;
        object-fit: contain;
      }
    }
    .evaluationdata {
      // width: 216upx;
      height: 50upx;
      font-size: 36upx;
	  font-weight: 600;
      color: #f4f7ff;
      text-align: center;
      // margin: 80upx 130upx;
    }
  }
  .dynamicshow_right {
    margin-right: 40upx;
    .back_img_style {
      width: 40upx;
      height: 40upx;
    }
  }
}
.buttontrue {
  width: calc(100vw - 60upx);
  height: 100upx;
  background: #1370ff;
  border-radius: 16upx;
  margin-left: 30upx;
  margin-top: 30upx;
}

::v-deep .van-icon-success:before {
  position: absolute;
  color: #7a7f89;
  font-size: 60upx;
  margin-left: 64upx;
  margin-bottom: 98upx;
}
::v-deep .van-icon-arrow {
  position: absolute;
  width: 14px;
  height: 14px;
  opacity: 0.3;
  /* color: #CCCCCC ; */
  text-align: right;
  margin-left: 600upx;
  margin-top: 85upx;
}
.need_scoll {
  height: 82vh !important;
  overflow-y: auto;
}
.watermark{
	position: absolute;
	font-size: 24upx;
	font-family: PingFangSC-Regular, PingFang SC;
	font-weight: 400;
	color: #7A7F89;
	top: 110upx;
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

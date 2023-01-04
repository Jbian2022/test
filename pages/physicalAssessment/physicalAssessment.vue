<template>
  <view class="content_style">
    <BgTheamCompontent :theamType="'currency'"></BgTheamCompontent>
    <NavBarCompontent :leftNavTitle="'身体评测'" :jumpType="'STPC'" :isAuthority="true"></NavBarCompontent>
    <view class="need_scoll list_style">
      <view
        class="dynamicshow"
        @click.native.stop="jumpModular(item)"
        v-for="(item, index) in dynamicEvaluationdata"
        :key="index"
      >
        <view class="dynamicshow_left">
          <view class="correct" v-if="item.isFinsh">
            <image
              class="correct_img_style"
              src="../../static/app-plus/other/yesActive.png"
            ></image>
          </view>

          <view class="correct" v-else>
            <image
              class="correct_img_style"
              src="../../static/app-plus/other/yesNoActive.png"
            ></image>
          </view>
          <text class="evaluationdata">
            {{ item.questionContent }}
          </text>
        </view>

        <view class="dynamicshow_right">
          <image
            class="back_img_style"
            src="../../static/app-plus/mebrs/backRight.png"
          ></image>
        </view>
      </view>
    </view>
    <view class="buttontrue" @click.native="getReport()">生成报告</view>
  </view>
</template>

<script>
import BgTheamCompontent from '@/components/bgTheamCompontent/bgTheamCompontent.vue'
import NavBarCompontent from '@/components/navBarCompontent/navBarCompontent.vue'
var businessCloudObject = uniCloud.importObject('businessCloudObject')
export default {
  components: {
    BgTheamCompontent,
    NavBarCompontent
  },
  data() {
    return {
      dynamicEvaluationdata: [
        // {
        //   title: '健康问答',
        //   type: 'zzsdpg',
        //   path: '/pages/healthQuesson/healthQuesson'
        // },
        // {
        //   title: '填写体测报告',
        //   type: 'xzhdpg',
        //   path: '/pages/bodyTestReport/bodyTestReport'
        // },
        // {
        //   title: '体态评估',
        //   type: 'rrxcs',
        //   path: '/pages/bodyAssessment/bodyAssessment'
        // },
        // {
        //   title: '动态评估',
        //   type: 'gjlhcs',
        //   path: '/pages/dynamicEvaluation/dynamicEvaluation'
        // },
        // { title: '体能评估', type: 'fwcwdxcs' }
      ],
      icon: true,
      traineeNo: ''
    }
  },
  created() {
    this.requestDynamicEvaluationdata()
  },
  onLoad(options) {
    if (JSON.stringify(options) !== '{}' && options.traineeNo) {
      this.traineeNo = options.traineeNo
    }
  },
  methods: {
	getReport(){
		uni.redirectTo({
			url: '/pages/viewReport/viewReport'+"?traineeNo="+this.traineeNo+"&key=1"
		})
	},
    jumpModular(item) {
      // console.log(item.path,'>>>>')

      if (item.hasOwnProperty('path') && item.path && this.traineeNo) {
        // 请求下级数据并携带过去
        businessCloudObject
          .getPhysicalChildAssessmentList(item.code)
          .then((res) => {
            if (res.success) {
              let childList = res.data
              uni.navigateTo({
                url:
                  item.path +
                  '?' +
                  'childList=' +
                  JSON.stringify(childList) +
                  '&traineeNo=' +
                  this.traineeNo +
                  '&questionCode=' +
                  item.code,
                success: (res) => {},
                fail: () => {},
                complete: () => {}
              })
            }
            console.log(res, '我是子选项')
            // this.dynamicEvaluationdata = res.data
          })
          .catch((err) => {})
      }
    },
    requestDynamicEvaluationdata() {
      businessCloudObject
        .getPhysicalAssessmentList()
        .then((res) => {
          let firstData = res.data
          businessCloudObject
            .opearConfigAllList(this.traineeNo)
            .then((allRes) => {
              console.log(allRes, 'allRes')
              firstData = firstData.map((item) => {
                let isFinsh = false
                // 查询结果表进行对应的过滤
                // console.log(item.code, '你是大傻逼')
                if (allRes.affectedDocs > 0) {
                  allRes.data.forEach((v) => {
                    console.log(v, '什么鬼')
                    if (v.questionCode === item.code) {
                      let needCompareData = v.hasOwnProperty('testResult')
                        ? v.testResult.filter((c) => c.answer.length > 0)
                        : []
                      let compareBodyTestResport =
                        v.hasOwnProperty('bodyTestReport') &&
                        JSON.stringify(v.bodyTestReport) !== '{}'
                          ? true
                          : false
					  let postureAssessment =
					    v.hasOwnProperty('postData') &&
					    JSON.stringify(v.postData) !== '{}'
					      ? true
					      : false
					  let dynamicEvaluation = v.hasOwnProperty('actionTestResult')
					    ? v.actionTestResult.filter((c) => c.length > 0)
					    : []
					  let physicalFitnessAssessment =
					    v.hasOwnProperty('physicalData') &&
					    JSON.stringify(v.physicalData) !== '{}'
					      ? true
					      : false
                      // console.log(needCompareData, '逆势')
                      if (needCompareData.length > 0) {
                        isFinsh = true
                      }
                      if (compareBodyTestResport) {
                        isFinsh = true
                      }
					  if (postureAssessment) {
					    isFinsh = true
					  }
					  if (dynamicEvaluation){
						  isFinsh = true
					  }
					  if (physicalFitnessAssessment){
						  isFinsh = true
					  }
                    }
                  })
                }

                return {
                  ...item,
                  isFinsh
                }
              })
              console.log(firstData, '我恒强')
              this.dynamicEvaluationdata = firstData
            })
        })
        .catch((err) => {})
    }
  }
}
</script>

<style lang="scss" scoped>
.content_style {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  position: relative;
  display: flex;
  flex-direction: column;
}
.list_style {
  flex: 1;
  overflow-y: auto;
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
	  margin-bottom: 8upx;
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
      font-family: PingFangSC-Semibold, PingFang SC;
      color: #f4f7ff;
      text-align: center;
	  font-weight: 600;
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
  // height: 74vh !important;
}
::v-deep .van-row {
  background: none;
  flex: 1;
  overflow-y: auto;
}
</style>

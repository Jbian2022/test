<template>
  <view class="content_style" @touchstart="start" @touchend="end">
    <BgTheamCompontent :theamType="'currency'"></BgTheamCompontent>
    <NavBarCompontent
      :leftNavTitle="'体能评估'"
      :jumpType="'TNPG'"
      :traineeNo="traineeNo"
    ></NavBarCompontent>
    <!-- <view class="arrow-left" :class="{show:isFixedTop}" @click="onClickBack">
		<van-icon name="arrow-left" />
		<view class="title">体能评估</view>
		<view class="z" style="opacity: 0;">8888</view>
	</view> -->
    <view class="watermark">数据评测来源于世界权威机构</view>
    <van-row class="list_style">
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
            <button
              class="dynamicshow_button buttonYes"
              @click.native="jumpModular(item)"
            >
              重新测试<image src="../../static/app-plus/other/arrows.png" />
            </button>
          </view>
          <view class="dynamicshow_left" v-else>
            <text class="evaluationdata">
              {{ item.questionContent }}
            </text>
            <button
              class="dynamicshow_button buttonNo"
              @click.native="jumpModular(item)"
            >
              开始测试<image src="../../static/app-plus/other/arrows.png" />
            </button>
          </view>
          <view class="dynamicshow_right">
            <view
              class="circle"
              :style="
                'border: 4px solid ' +
                item.typeColor +
                ';background-color:' +
                item.typeColor +
                '0D;'
              "
            >
              <view
                class="circleText"
                :style="'color:' + item.typeColor + ';'"
                >{{ item.typeText }}</view
              >
            </view>
          </view>
        </view>
      </van-col>
    </van-row>
    <view class="bottom_style" @click.stop="getdynamicEvaluationdata()"
      >保存</view
    >
  </view>
</template>

<script>
import BgTheamCompontent from '@/components/bgTheamCompontent/bgTheamCompontent.vue'
import NavBarCompontent from '@/components/navBarCompontent/navBarCompontent.vue'
const testOb = uniCloud.importObject('testResults', {
  customUI: true
})
const busOb = uniCloud.importObject('businessCloudObject', {
  customUI: true
})
export default {
  components: {
    BgTheamCompontent,
    NavBarCompontent
  },
  data() {
    return {
      traineeNo: '',
      questionCode: '',
      currentRate: 50,
      age: 29,
      gender: '1',
      resultValue: 0,
      typeText: '待测',
      typeColor: '#4B525E',
      backColor: '',
      queryData: {},
      queryUserActionData: {},
      startData: [{ clientX: '', clientY: '' }]
    }
  },
  onLoad: function (item) {
    console.log(item)
    this.traineeNo = item.traineeNo
    this.questionCode = item.questionCode
    this.getconfingActionName()
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
          url:
            '/pages/physicalAssessment/physicalAssessment?' +
            'traineeNo=' +
            this.traineeNo
        })
      } else if (subX < -50) {
        console.log('右滑')
        uni.reLaunch({
          url:
            '/pages/physicalAssessment/physicalAssessment?' +
            'traineeNo=' +
            this.traineeNo
        })
      } else {
        console.log('无效')
      }
    },
    jumpModular(item) {
      console.log(item.path, '>>>>')
      uni.navigateTo({
        url:
          item.path +
          '?' +
          'data=' +
          JSON.stringify(item) +
          '&traineeNo=' +
          this.traineeNo +
          '&questionCode=' +
          item.parentCode,
        success: (res) => {},
        fail: () => {},
        complete: () => {}
      })
    },
    //通过传入的type值来更新等级颜色
    levelColor(levelType) {
      switch (levelType) {
        case '优秀':
        case '良好':
        case '非常好':
          return '#01E08C'
        case '中等':
        case '中上等':
        case '中下等':
        case '尚可':
          return '#FFC13C'
        case '较差':
        case '非常差':
        case '需改善':
          return '#F04242'
        default:
          return '#4B525E'
      }
    },
    //获取运动表
    getconfingActionName() {
      const data = {}
      data['traineeNo'] = this.traineeNo
      data['questionCode'] = this.questionCode
      testOb
        .opearConfigQuery(data)
        .then((res) => {
          console.log(res)
          if (res.success) {
            this.queryUserActionData = res.data
            busOb
              .getPhysicalChildAssessmentList('A0005')
              .then((res) => {
                this.queryData = res.data
                this.queryData.forEach((item) => {
                  item['typeText'] = '待测'
                  item['type'] = 0
                  item['typeColor'] = this.levelColor(item.typeText)
                  item['path'] =
                    '/pages/physicalFitnessAssessment/actionEvaluation/actionEvaluation'
                  console.log(item)
                })
                for (let j = 0; j < this.queryUserActionData.length; j++) {
                  for (let i = 0; i < this.queryData.length; i++) {
                    console.log(
                      this.queryData[i].code ===
                        this.queryUserActionData[j].code
                    )
                    if (
                      this.queryData[i].code ===
                      this.queryUserActionData[j].code
                    ) {
                      this.queryData[i].typeText =
                        this.queryUserActionData[j].physicalData.actionTypeText
                      this.queryData[i].type =
                        this.queryUserActionData[j].physicalData.actionVlue
                      this.queryData[i].typeColor = this.levelColor(
                        this.queryUserActionData[j].physicalData.actionTypeText
                      )
                      continue
                    }
                  }
                }
                console.log(this.queryData)
              })
              .catch((err) => {})
          }
        })
        .catch()
    },
    getdynamicEvaluationdata() {
      uni.redirectTo({
        url:
          '/pages/physicalAssessment/physicalAssessment' +
          '?traineeNo=' +
          this.traineeNo +
          '&questionCode=' +
          this.questionCode
      })
    },
    onClickBack() {
      uni.redirectTo({
        url:
          '/pages/physicalAssessment/physicalAssessment' +
          '?traineeNo=' +
          this.traineeNo +
          '&questionCode=' +
          this.questionCode
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
  display: flex;
  flex-direction: column;
  // background: rgba(33, 35, 40, 1);
  .arrow-left {
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
    margin-top: 80upx;
    .van-icon {
      font-size: 40upx;
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
.title {
  margin-left: 10px;
  font-size: 24px;
  font-weight: 600;
  color: #ffffff;
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
.need_scoll {
  // background-color: rgba(33, 35, 40, 1);
}
.list_style {
  flex: 1;
  overflow-y: auto;
}
.dynamicshow {
  width: calc(100vw - 60upx);
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
  width: calc(100vw - 180upx);
  margin-left: 30upx;
  align-items: center;
}
.buttonNo {
  background: #1370ff;
}
.buttonYes {
  background: #4b525e;
}
.dynamicshow_button {
  width: 220upx;
  height: 80upx;

  border-radius: 42px;
  border: 0px none;
  line-height: 80upx;
  font-size: 30upx;
  font-weight: 600;
  color: #f4f7ff;
  margin: 0;
}
.dynamicshow_button image {
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
  width: 350upx;
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
.circle {
  width: 100px;
  height: 100px;
  border: 4px solid #4b525e;
  border-radius: 100px;
  line-height: 100px;
}
.circleText {
  width: 120upx;
  height: 50upx;
  font-size: 36upx;
  font-weight: 600;
  color: #bdc3ce;
  margin: 0 auto;
  text-align: center;
}
.watermark {
  position: absolute;
  font-size: 24upx;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #7a7f89;
  top: 110upx;
  right: 50upx;
}
.bottom_style {
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

  width: calc(100vw - 60upx);
  margin-left: 30upx;

  display: flex;
}
</style>

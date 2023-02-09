<template>
  <view class="content_style">
    <view class="list_style">
      <BgTheamCompontent :theamType="'currency'"></BgTheamCompontent>
      <NavBarCompontent :leftNavTitle="leftNavTitle"></NavBarCompontent>
      <!-- <view class="arrow-left" @click="onClickBack(show)">
        <van-icon name="arrow-left" v-if="!show" />
        <view class="title">{{ leftNavTitle }}</view>
        <view class="z" style="opacity: 0">8888</view>
      </view> -->
      <view class="headBox" v-if="leftNavTitle === '肩关节灵活性测试'">
        <view
          class="block1"
          v-for="(item, index) in actionobs"
          :key="index"
          :class="num == index ? 'block0' : ''"
          @click.native="changeFunction(index)"
          >{{ item.questionContent }}</view
        >
      </view>
      <view class="headBox" v-else>
        <view
          class="block"
          v-for="(item, index) in actionobs"
          :key="index"
          :class="num == index ? 'block0' : ''"
          @click.native="changeFunction(index)"
          >{{ item.questionContent }}</view
        >
      </view>
      <view class="contentBody" v-if="changeValue">
        <view class="clickAction" @tap="openOne"
          >点击查看标准动作描述
          <image src="../../../static/app-plus/mebrs/openarrit.png"></image>
        </view>
        <view> </view>
        <view class="actinQuessonContent">
          <view v-for="(item, index) in quession1" :style="item.style">
            <view
              class="quessonName"
              v-if="item.status"
              @click.stop="clickQ(item, 0)"
            >
              <p>{{ item.answerTitle }}</p>
            </view>
            <view
              class="clickQuessonName"
              v-if="!item.status"
              @click.stop="clickQ(item, 0)"
            >
              <view class="quessonTitle">
                {{ item.answerTitle }}
              </view>
              <view class="quessonText">
                <p style="color: #f04242; display: initial">问题描述：</p>
                {{ item.answeerContent }}
              </view>
            </view>
          </view>
        </view>
        <image class="imagebg" :src="backimgFront" />
        <view class="imgbgText"> 点击上方蓝色标签选择问题部位，可多选 </view>
      </view>
      <view class="contentBody" v-else>
        <view class="clickAction" @tap="openTwo"
          >点击查看标准动作描述
          <image src="../../../static/app-plus/mebrs/openarrit.png"></image>
        </view>
        <view>
          <view class="shouxie_pop" v-show="popFlagTwo">
            <view class="clickActionBody">
              <video
                :src="SideVideoUrl"
                wid
                autoplay
                loop
                :controls="false"
                :custom-cache="false"
                muted
                id="video_style_two"
              ></video>
              <view class="clickActionText">
                <view class="Actionname">标准动作：</view>
                <view>
                  <p v-for="(item, index) in testText1">{{ item }}</p>
                </view>
              </view>
              <view class="clickActionEnd" @click.native="closeTwo"
                >收起
                <image src="../../../static/app-plus/other/close.png"></image>
              </view>
            </view>
          </view>
        </view>
        <view class="actinQuessonContent">
          <view v-for="(item, index) in quession2" :style="item.style">
            <view
              class="quessonName"
              v-if="item.status"
              @click.stop="clickQ(item, 1)"
            >
              <p>{{ item.answerTitle }}</p>
            </view>
            <view
              class="clickQuessonName"
              v-if="!item.status"
              @click.stop="clickQ(item, 1)"
            >
              <view class="quessonTitle">
                {{ item.answerTitle }}
              </view>
              <view class="quessonText">
                <p style="color: #f04242; display: initial">问题描述：</p>
                {{ item.answeerContent }}
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

        <image class="imagebg" :src="backimgSide" />
        <view class="imgbgText"> 点击上方蓝色标签选择问题部位 </view>
        <!-- <image
			  src="../../static/app-plus/bg/actionImg.png"
			></image> -->
      </view>
    </view>
    <view class="bottom_style" @click.stop="actionResDate">保存</view>
  </view>
</template>

<script>
import BgTheamCompontent from '@/components/bgTheamCompontent/bgTheamCompontent.vue'
import NavBarCompontent from '@/components/navBarCompontent/navBarCompontent.vue'
import { ref } from 'vue'
const tesOb = uniCloud.importObject('testResults', {
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
  setup() {
    const show = ref(false)

    return {
      show
    }
  },
  onLoad: function (item) {
    console.log(item)
    this.traineeNo = item.traineeNo
    this.questionCode = item.questionCode
    let leftNavTitle = item.pageTitle
    this.type = item.type
    this.leftNavTitle = leftNavTitle
    switch (leftNavTitle) {
      case '胸椎活动评估':
        this.backimgFront = this.thoracicSpineActivityimg
        this.backimgSide = this.thoracicSpineActivity2img
        this.FrontVideoUrl = this.thoracicSpineActivityUrl
        this.SideVideoUrl = this.thoracicSpineActivityUrl
        break
      case '自重深蹲评估':
        this.backimgFront = this.backimg1
        this.backimgSide = this.backimg2
        this.FrontVideoUrl = this.squatFrontVideoUrl
        this.SideVideoUrl = this.squatSideVideoUrl
        break
      case '柔韧性测试':
        this.backimgFront = this.thomasimg
        this.backimgSide = this.straightLegLiftimg
        this.FrontVideoUrl = this.ThomasUrl
        this.SideVideoUrl = this.StraightLegLiftUrl
        break
      case '肩关节灵活性测试':
        this.backimgFront = this.shoulderTest1img
        this.backimgSide = this.shoulderTest2img
        this.FrontVideoUrl = this.shoulderTest1Url
        this.SideVideoUrl = this.shoulderTest2Url
        break
      case '俯卧撑稳定性测试':
        this.backimgFront = this.pushUpTestimg
        this.FrontVideoUrl = this.pushUpTestUrl
        break
    }
    this.getData()
    this.traineeNo = item.traineeNo
    this.questionCode = item.questionCode
  },
  data() {
    return {
      actionobs: [{ name: '正面观' }, { name: '侧面观' }],
      backIcon: true,
      type: '',
      traineeNo: '',
      questionCode: '',
      icon: true,
      showpop: false,
      clickQuession1: true,
      clickQuession2: true,
      backimgFront: '',
      backimgSide: '',
      FrontVideoUrl: '',
      SideVideoUrl: '',
      backimg1: '../../../static/app-plus/bg/positiveAction.jpg',
      backimg2: '../../../static/app-plus/bg/positiveAction2.jpg',
      thoracicSpineActivityimg:
        '../../../static/app-plus/bg/thoracicSpineActivity.jpg',
      thoracicSpineActivity2img:
        '../../../static/app-plus/bg/thoracicSpineActivity2.jpg',
      thomasimg: '../../../static/app-plus/bg/Thomas.jpg',
      straightLegLiftimg: '../../../static/app-plus/bg/StraightLegLift.jpg',
      shoulderTest1img: '../../../static/app-plus/bg/shoulderTest1.jpg',
      shoulderTest2img: '../../../static/app-plus/bg/shoulderTest2.jpg',
      pushUpTestimg: '../../../static/app-plus/bg/pushUpTest.jpg',
      changeValue: true,
      num: 0,
      squatFrontVideoUrl:
        'https://mp-4e6f1c48-a4dc-4897-a866-0a1a071023c3.cdn.bspapp.com/cloudstorage/39e6eb66-787c-4615-b346-f80c490c69cf.mp4',
      squatSideVideoUrl:
        'https://mp-4e6f1c48-a4dc-4897-a866-0a1a071023c3.cdn.bspapp.com/cloudstorage/6eb8e467-5798-49fd-9785-bfcde1fbb1e3.mp4',
      //胸椎活动视频
      thoracicSpineActivityUrl:
        'https://mp-4e6f1c48-a4dc-4897-a866-0a1a071023c3.cdn.bspapp.com/cloudstorage/6f77e7d9-77b3-455e-a378-75b05fb0848b.mp4',
      //直抬腿
      StraightLegLiftUrl:
        'https://mp-4e6f1c48-a4dc-4897-a866-0a1a071023c3.cdn.bspapp.com/cloudstorage/bda98240-b083-41da-bbf4-7168183791a1.mp4',
      //托马斯
      ThomasUrl:
        'https://mp-4e6f1c48-a4dc-4897-a866-0a1a071023c3.cdn.bspapp.com/cloudstorage/e971accd-2928-429b-86a1-e33f2d9e10aa.mp4',
      //肩关节灵活性测试1
      shoulderTest1Url:
        'https://mp-4e6f1c48-a4dc-4897-a866-0a1a071023c3.cdn.bspapp.com/cloudstorage/f682d0b8-f3e6-4159-9242-01854025d3a6.mp4',
      //肩关节灵活性测试2
      shoulderTest2Url:
        'https://mp-4e6f1c48-a4dc-4897-a866-0a1a071023c3.cdn.bspapp.com/cloudstorage/580f6bf5-c503-40d9-819c-b4a11412791e.mp4',
      //五，俯卧撑稳定性测试
      pushUpTestUrl:
        'https://mp-4e6f1c48-a4dc-4897-a866-0a1a071023c3.cdn.bspapp.com/cloudstorage/e27801c0-b63f-42f0-a5a4-68574a123e69.mp4',
      quession1: [],
      quession2: [],
      quession3: [],
      testText1: [],
      testText2: [],
      testText3: [],
      startData: [{ clientX: '', clientY: '' }],
      popFlagOne: false,
      popFlagTwo: false
    }
  },
  methods: {
    openOne() {
      console.log(11111)
      this.popFlagOne = true
    },
    closeOne() {
      this.popFlagOne = false
    },
    openTwo() {
      console.log(22222)
      this.popFlagTwo = true
    },
    closeTwo() {
      this.popFlagTwo = false
    },
    onClickBack(boo) {
      if (!boo) {
        uni.redirectTo({
          url:
            '/pages/dynamicEvaluation/dynamicEvaluation' +
            '?traineeNo=' +
            this.traineeNo +
            '&questionCode=' +
            this.questionCode
        })
      }
    },
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
            '/pages/dynamicEvaluation/dynamicEvaluation?' +
            'traineeNo=' +
            this.traineeNo +
            '&questionCode=' +
            this.questionCode
        })
      } else if (subX < -50) {
        console.log('右滑')
        uni.reLaunch({
          url:
            '/pages/dynamicEvaluation/dynamicEvaluation?' +
            'traineeNo=' +
            this.traineeNo +
            '&questionCode=' +
            this.questionCode
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
    changeFunction(index) {
      if (index == 0) {
        this.changeValue = true
        this.num = index
      } else {
        this.changeValue = false
        this.num = index
      }
    },
    getActionInfo() {
      if (this.type !== '') {
        busOb.getPhysicalChildAssessmentList(this.type).then((res) => {
          console.log(res.data)
          let index = res.data.length
          console.log(index)
          if (res.success) {
            this.actionobs = res.data
            this.quession1 = this.actionobs[0].answer
            this.testText1 = this.actionobs[0].answerRemark.detailArray
            if (this.actionobs.length > 1) {
              this.quession2 = this.actionobs[1].answer
              this.testText2 = this.actionobs[1].answerRemark.detailArray
            }
            // console.log(this.actionobs);
            if (this.actionobs.length > 2) {
              this.quession3 = this.actionobs[2].answer
              this.testText3 = this.actionobs[2].answerRemark.detailArray
            }
          }
        })
      }
    },
    actionResDate() {
      console.log(this.actionobs)
      const data = {}
      data['traineeNo'] = this.traineeNo
      data['questionCode'] = this.questionCode
      data['code'] = this.type
      data['actionTestResult'] = this.actionobs
      data['status'] = '0'
      console.log(data)
      tesOb
        .opearConfig(data, 'bodyTestReport')
        .then((res) => {
          console.log(res, '我要保存了')
          if (res.success) {
            uni.redirectTo({
              url:
                '/pages/dynamicEvaluation/dynamicEvaluation' +
                '?traineeNo=' +
                this.traineeNo +
                '&questionCode=' +
                this.questionCode
            })
            uni.showToast({
              icon: 'success',
              title: res.message,
              duration: 800
            })
          }
        })
        .catch(() => {})
    },
    clickQ(item, num) {
      console.log(item)
      if (item.status) {
        item.status = 0
      } else {
        item.status = 1
      }
      this.actionobs[num].answer.forEach((ans) => {
        if (ans.answerTitle === item.answerTitle) {
          ans.status = item.status
        }
      })
    },
    getData() {
      const data = {}
      data['traineeNo'] = this.traineeNo
      data['questionCode'] = this.questionCode
      data['code'] = this.type
      const index = 0
      tesOb.opearPHConfigQuery(data).then((res) => {
        if (res.success && res.data.length != 0) {
          console.log(res.data[0].actionTestResult)
          this.actionobs = res.data[0].actionTestResult
          this.quession1 = this.actionobs[0].answer
          this.testText1 = this.actionobs[0].answerRemark.detailArray
          if (this.actionobs.length > 1) {
            this.quession2 = this.actionobs[1].answer
            this.testText2 = this.actionobs[1].answerRemark.detailArray
          }
          if (this.actionobs.length > 2) {
            this.quession3 = this.actionobs[2].answer
            this.testText3 = this.actionobs[2].answerRemark.detailArray
          }
        } else {
          this.getActionInfo()
        }
      })
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
      font-size: 45upx;
      color: #fff;
    }
  }
}
.title {
  margin-left: 10px;
  font-size: 24px;
  font-weight: 600;
  color: #ffffff;
}
.headBox {
  width: 100vw;
  height: 90upx;
  margin: 0 auto;
  margin-top: 20upx;
  margin-left: 30upx;
  overflow-x: hidden;
}
.block {
  width: 45vw;
  height: 90upx;
  border-radius: 16upx;
  float: left;
  font-size: 30upx;
  font-family: PingFangSC-Semibold, PingFang SC;
  font-weight: 600;
  color: #f4f7ff;
  line-height: 90upx;
  text-align: center;
  background: #383d46;
  margin-right: 22upx;
}
.block1 {
  width: 29vw;
  height: 90upx;
  border-radius: 16upx;
  float: left;
  font-size: 30upx;
  font-family: PingFangSC-Semibold, PingFang SC;
  font-weight: 600;
  color: #f4f7ff;
  line-height: 90upx;
  text-align: center;
  background: #383d46;
  margin-right: 22upx;
}
.block0 {
  background: #195bc2;
}
.contentBody {
  width: calc(100vw - 60upx);
  margin: 0 auto;
  margin-top: 20upx;
}
.imagebg {
  width: calc(100vw - 60upx);
  height: calc(100vh - 440upx);
  border-radius: 16upx;
}
.imgbgText {
  width: 100%;
  height: 80upx;
  background: #000000;
  opacity: 0.5;
  margin-top: -85upx;
  border-bottom-radius: 16upx;
  color: #bdc3ce;
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

.clickAction {
  width: 660upx;
  height: 70upx;
  background: #000000;
  border-radius: 36upx;
  opacity: 0.5;
  position: absolute;
  top: 330upx;
  left: calc(100vw - 717upx);
  z-index: 1;
  font-size: 26upx;
  font-weight: 400;
  color: rgb(244, 247, 255);
  line-height: 70upx;
  text-align: center;
}
.clickAction image {
  width: 32upx;
  height: 32upx;
  top: 6upx;
}

.clickActionText {
  width: calc(100vw - 140upx);
  height: 650upx;
  overflow-y: auto;
  overflow-x: hidden;
  margin-top: 40upx;
  margin-left: 40upx;
}
.Actionname {
  font-size: 30upx;
  font-weight: 600;
  color: #f4f7ff;
  line-height: 42upx;
  margin-bottom: 20upx;
}
.clickActionText p {
  font-size: 26upx;
  font-weight: 400;
  color: #bdc3ce;
  line-height: 36upx;
}
.clickActionEnd {
  width: 230upx;
  height: 80upx;
  background: #000000;
  border-radius: 40upx;
  font-size: 26upx;
  font-weight: 400;
  color: #f4f7ff;
  line-height: 70upx;
  text-align: center;
  margin: auto;
  margin-bottom: 80px;
}
.clickActionEnd image {
  width: 32upx;
  height: 32upx;
  top: 6upx;
}
.bottom_style {
  background: #1370ff;
  border-radius: 16upx;
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
.actinQuesson1 {
  position: absolute;
  z-index: 2;
  top: 800upx;
  left: 80upx;
}
.quessonName {
  width: 180upx;
  /* height: 80upx; */
  background: rgba(19, 112, 255, 0.9);
  border-radius: 16upx;
  font-size: 26upx;
  font-weight: 600;
  color: #f4f7ff;
  /* line-height: 80upx; */
  padding-top: 20upx;
  padding-bottom: 24upx;
  padding-left: 15upx;
  padding-right: 10upx;
  /* text-align: center; */
}
.clickQuessonName {
  width: 200upx;
  /* height: 164upx; */
  background: rgba(19, 112, 255, 0.9);
  border-radius: 16upx;
  border: 2upx solid #1370ff;
  padding: 20upx;
}
.quessonTitle {
  font-size: 26upx;
  font-weight: 600;
  color: #f4f7ff;
}
.quessonText {
  font-size: 18upx;
  font-weight: 400;
  color: #ffffff;
  margin-top: 20upx;
}
::v-deep .van-popup {
  background: #383d46;
}
.list_style {
  flex: 1;
}

// 重写样式
.shouxie_pop {
  position: fixed;
  left: 0;
  background: #383d46;
  border-radius: 16upx;
  width: calc(100vw - 40upx);
  margin-left: 20upx;
  z-index: 999;
  box-sizing: border-box;
  height: calc(100vh - 300upx);
}
#video_style {
  width: calc(100% - 80upx);
  margin-left: 40upx !important;
  margin-top: 40upx;
  .clickActionBody {
    display: flex;
    flex-direction: column;
    position: relative;
    .clickActionEnd {
      position: absolute;
    }
  }
}
#video_style_two {
  width: calc(100% - 80upx);
  margin-left: 40upx !important;
  margin-top: 40upx;
  .clickActionBody {
    display: flex;
    flex-direction: column;
    position: relative;
    .clickActionEnd {
      position: absolute;
    }
  }
}
</style>

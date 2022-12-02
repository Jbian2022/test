<template>
  <view class="content_style">
    <BgTheamCompontent :theamType="'currency'"></BgTheamCompontent>
    <BetterSticky :scrollTop="scrollTop">
      <template v-slot:header> </template>
      <template v-slot:content>
        <!--内容 start-->
        <view class="header_style">
          <view class="header_left_style">
            <view class="left_content_style">
              <image
                class="left_content_img_style"
                src="https://img2.baidu.com/it/u=2490939159,251868101&fm=253&fmt=auto&app=120&f=JPEG?w=1200&h=750"
              ></image>
              <view class="left_header_style">我的会员</view>
              <view class="left_num_style">{{ meberList.length }}</view>
            </view>
          </view>
          <view
            class="header_right_style"
            :class="ceilingFlag ? 'search_anmition_style' : ''"
          >
            <image
              class="right_img_style"
              src="../../static/app-plus/mebrs/fangdajing.svg"
            ></image>
          </view>
        </view>

        <view
          class="is_buy_style"
          :class="ceilingFlag ? 'celling_animation_style' : ''"
        >
          <view
            class="buy_left"
            :class="isActive === 'y' ? 'active' : ''"
            @click.native="buyClick('y')"
            >已购课</view
          >
          <view
            class="buy_right"
            :class="isActive === 'n' ? 'active' : ''"
            @click.native="buyClick('n')"
            >未购课</view
          >
        </view>
        <view class="mebers_content">
          <view class="no_data_style" v-if="meberList.length === 0">
            <image
              class="no_data_meber_img_style"
              src="../../static/app-plus/mebrs/nomebers.png"
            ></image>
          </view>
          <uni-swipe-action
            class="slide_stylle"
            v-for="(item, itemIndex) in meberList"
            :key="'itemIndex' + itemIndex"
          >
            <uni-swipe-action-item
              :disabled="controlSwiperFlag"
              @change="swipeChange($event, 0)"
            >
              <template v-slot:right>
                <view
                  class="slot-button"
                  @click.native.stop="bindClick($event)"
                >
                  <image
                    class="slot_btn_img_style"
                    src="../../static/app-plus/mebrs/delete.svg"
                  ></image>
                </view>
                <van-popup v-model:show="deleteRemarkFlag" teleport="body">
                  <view class="confirm_dakuang_style">
                    <view class="confirm_top_style">
                      <text class="config_top_title_style">是否确认删除</text>
                      <image
                        class="delete_waring_style"
                        src="../../static/app-plus/mebrs/delete.svg"
                      ></image>
                    </view>
                    <view class="delet_remark"
                      >确认删除该学员吗？删除后无法恢复</view
                    >
                    <view class="delete_btn_style">
                      <view class="delete_cacel_style">取消</view>
                      <view class="delete_sure_style">确认</view>
                    </view>
                  </view>
                </van-popup>
              </template>
              <view class="add_student_style">
                <view class="need_loop_style">
                  <view class="loop_top_style">
                    <view class="top_left_style">
                      <text class="top_left_name_style">赵思远</text>
                      <image
                        class="top_left_img_style"
                        src="../../static/app-plus/mebrs/man.svg"
                      ></image>
                    </view>
                    <view class="top_right_style" @click="goToNewWorkout">
                      <image
                        class="top_right_img_style"
                        src="../../static/app-plus/mebrs/trainingProgram.svg"
                      ></image>
                      <text>生产训练计划</text>
                    </view>
                  </view>
                  <view class="loop_bottom_style">
                    <view class="bottom_style">
                      <image
                        class="bootom_img_style"
                        src="../../static/app-plus/mebrs/meberMessage.svg"
                      ></image>
                      <text class="message_style">会员信息</text>
                    </view>
                    <view class="bottom_style">
                      <image
                        class="bootom_img_style"
                        src="../../static/app-plus/mebrs/evaluationInformation.svg"
                      ></image>
                      <text class="message_style">评测信息</text>
                    </view>
                    <view class="bottom_style" @click="goToTrainingRecord">
                      <image
                        class="bootom_img_style"
                        src="../../static/app-plus/mebrs/trainingLog.svg"
                      ></image>
                      <text class="message_style">训练记录</text>
                    </view>
                  </view>
                </view>
              </view>
            </uni-swipe-action-item>
          </uni-swipe-action>
        </view>
      </template>
    </BetterSticky>

    <view class="btn_add" :class="loginNum == 0 ? 'guid_style' : ''">
      <van-popover
        @click-overlay="clickOverlay"
        :overlay="true"
        v-model:show="showPopover"
        placement="left"
      >
        <view class="pop_tips_style pad_style">Hi～你来了</view>
        <view class="pop_tips_style">点这里添加会员吧</view>

        <template #reference>
          <image
            class="add_img_style"
            src="../../static/app-plus/mebrs/add.svg"
            @click.stop="addClick"
          ></image>
        </template>
      </van-popover>

      <!-- <image
        class="add_img_style"
        src="../../static/app-plus/mebrs/add.svg"
        @click="addClick"
      ></image> -->
    </view>
  </view>
</template>

<script>
import BgTheamCompontent from '@/components/bgTheamCompontent/bgTheamCompontent.vue'
import BetterSticky from '@/components/better-sticky/better-sticky.vue'

export default {
  components: {
    BgTheamCompontent,
    BetterSticky
  },
  data() {
    return {
      meberList: [
        {
          name: 1
        },
        {
          name: 1
        },
        {
          name: 1
        },
        {
          name: 1
        },
        {
          name: 1
        }
      ],
      isActive: 'y',
      controlSwiperFlag: false,
      deleteRemarkFlag: false,
      loginNum: 0,
      showPopover: false,
      scrollTop: 0,
      ceilingFlag: false
    }
  },
  onLoad(options) {},
  mounted() {
    let self = this
    uni.getStorage({
      key: 'loginNum',
      success: function (res) {
        if (res.data) {
          self.loginNum = res.data
          self.showPopover = res.data == '0' ? true : false

          // console.log(res, '次数',self.loginNum )
        }
      },
      fail: function (err) {}
    })
  },
  //页面滚动执行方式
  onPageScroll(e) {
    this.scrollTop = e.scrollTop

    this.ceilingFlag = e.scrollTop > 50 ? true : false
    console.log(e.scrollTop, '????', this.ceilingFlag)
  },
  methods: {
    clickOverlay() {
      console.log('拜拜')
      uni.setStorageSync('loginNum', '1')
    },
    bindClick(e) {
      console.log(e, '>>>')
      this.deleteRemarkFlag = true
    },
    swipeChange(e, index) {
      if (e === 'right') {
        this.controlSwiperFlag = true
      }
      console.log('当前状态：' + e + '，下标：' + index)
    },
    addClick() {
      // let addData = {
      // 	  studentName: '张三'
      //   }
      // this.meberList.push(addData)

      uni.navigateTo({
        url: '/pages/addMyMebers/addMyMebers',
        success: (res) => {},
        fail: () => {},
        complete: () => {}
      })
    },
    buyClick(type) {
      this.isActive = type
    },
    goToTrainingRecord() {
      uni.navigateTo({
        url: '/pages/trainingRecord/trainingRecord?traineeNo='+'63899b9ef5cf3a1773072cd4'
      })
    },
    goToNewWorkout() {
      uni.navigateTo({
        url: '/pages/newWorkout/newWorkout?traineeNo='+'63899b9ef5cf3a1773072cd4'
      })
    }
  }
}
</script>

<style lang="scss">
.content_style {
  width: 100vw;
  // height: 100vh;
  // overflow: hidden;
  overflow-x: hidden;
  overflow-y: auto;
  position: relative;
  display: flex;
  flex-direction: column;
  .header_style {
    width: calc(100vw - 60upx);
    margin-left: 30upx;
    height: 80upx;
    margin-top: 30upx;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .header_left_style {
      // width: 50%;
      height: 100%;
      .left_content_style {
        display: flex;
        align-items: center;
        height: 80upx;

        .left_content_img_style {
          width: 80upx;
          height: 100%;
          object-fit: contain;
          border-radius: 50%;
          margin-right: 20upx;
          // margin-left: 30upx;
        }
        .left_header_style {
          font-size: 48upx;
          font-family: PingFangSC-Semibold, PingFang SC;
          font-weight: 600;
          color: #ffffff;
        }
        .left_num_style {
          margin-left: 16upx;
          width: 50upx;
          height: 50upx;
          background: #454951;
          border-radius: 16upx;
          line-height: 50upx;
          text-align: center;
          font-size: 28upx;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 500;
          color: #bdc3ce;
        }
      }
    }
    .header_right_style {
      display: block;
      .right_img_style {
        width: 48.59upx;
        height: 48.59upx;
      }
    }
  }
  .is_buy_style {
    width: calc(100vw - 60upx);
    height: 82upx;
    margin-left: 30upx;
    display: flex;
    align-items: center;
    margin-top: 36upx;

    .buy_left {
      width: 50%;
      height: 100%;
      text-align: center;
      background: linear-gradient(180deg, #343a44 0%, #212328 100%);
      line-height: 82upx;
      color: #a8adb6;

      border-radius: 200upx 0px 0px 200upx;
    }
    .buy_right {
      width: 50%;
      height: 100%;
      color: #a8adb6;
      line-height: 82upx;
      text-align: center;
      background: linear-gradient(180deg, #343a44 0%, #212328 100%);
      border-radius: 0px 200upx 200upx 0px;
    }
    .active {
      background: #1370ff;
      color: #fff;
    }
  }
  .mebers_content {
    width: 100vw;
    flex: 1;
    .no_data_style {
      width: 100%;
      display: flex;
      height: 100%;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      .no_data_meber_img_style {
        // width: 100%;
        width: 382upx;
        height: 382upx;
        object-fit: contain;
      }
    }
    .slide_stylle {
      width: 100%;
      flex: 1;

      .add_student_style {
        width: 100%;
        display: flex;
        // flex: 1;
        align-items: center;
        flex-direction: column;
        .need_loop_style {
          width: calc(100% - 60upx);
          margin: 30upx;

          display: flex;

          flex-direction: column;
          justify-content: space-around;
          background: #383d46;
          border-radius: 24upx;
          height: 260upx;

          .loop_top_style {
            width: 100%;
            display: flex;
            justify-content: space-around;
            // margin-top: 40upx;
            .top_left_style {
              width: 50%;
              display: flex;

              .top_left_name_style {
                font-size: 40upx;
                font-family: PingFangSC-Semibold, PingFang SC;
                font-weight: 600;
                color: #f4f7ff;
              }
              .top_left_img_style {
                width: 36upx;
                height: 38upx;
                object-fit: contain;
                margin-left: 10upx;
              }
            }
            .top_right_style {
              width: 238upx;
              height: 60upx;
              background: rgba(1, 224, 140, 0.1);
              border-radius: 12upx;
              // opacity: 0.1;
              font-size: 28upx;
              text-align: center;
              line-height: 60upx;
              font-weight: 600;
              color: #01e08c;
              .top_right_img_style {
                width: 20upx;
                height: 22upx;
                object-fit: contain;
                margin-right: 10upx;
              }
            }
          }
          .loop_bottom_style {
            width: 100%;
            display: flex;
            justify-content: space-around;
            align-items: center;
            .bottom_style {
              display: flex;
              align-items: center;
              .bootom_img_style {
                width: 28upx;
                height: 30upx;
                margin-right: 8upx;
                object-fit: contain;
              }
              .message_style {
                font-size: 28upx;
                font-weight: 400;
                color: #bdc3ce;
              }
            }
          }
        }
      }
    }
  }
  .btn_add {
    width: 130upx;
    height: 130upx;
    position: fixed;
    right: 30upx;
    bottom: calc(50px + 30upx);
    .add_img_style {
      width: 130upx;
      height: 100%;
      border-radius: 50%;
      object-fit: contain;
    }
  }
  .guid_style {
    z-index: 2200;
  }
}
.slot-button {
  width: 100upx !important;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  .slot_btn_img_style {
    width: 100upx;
    height: 100upx;
  }
}

::v-deep .van-popup {
  // width: 100vw;
  background: none !important;
}
.confirm_dakuang_style {
  width: calc(100vw - 60upx);
  margin-left: 30upx;
  height: 420upx;
  background: #383d46;
  border-radius: 24px;
  .confirm_top_style {
    width: calc(100% - 100upx);
    margin-left: 50upx;
    padding-top: 50upx;
    display: flex;
    align-items: center;
    font-size: 52upx;
    color: #f4f7ff;
    .delete_waring_style {
      width: 57upx;
      height: 48upx;
    }
  }
  .delet_remark {
    width: calc(100% - 100upx);
    margin-left: 50upx;
    font-size: 30upx;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #bdc3ce;
    margin-top: 30upx;
  }
  .delete_btn_style {
    width: calc(100% - 100upx);
    margin-left: 50upx;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 80upx;
    .delete_cacel_style {
      width: 240upx;
      height: 90upx;
      background: #454951;
      border-radius: 16upx;
      font-size: 32upx;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
      color: #ffffff;
      text-align: center;
      line-height: 90upx;
    }
    .delete_sure_style {
      width: 240upx;
      height: 90upx;
      background: #1370ff;
      border-radius: 16px;
      backdrop-filter: blur(18px);
      font-size: 32upx;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
      color: #ffffff;
      text-align: center;
      line-height: 90upx;
    }
  }
}

uni-app,
uni-page,
uni-page-wrapper,
uni-page-body {
  height: calc(100vh - 50px);
}
::v-deep.van-popover__wrapper {
  width: 100%;
  height: 100% !important;
}
::v-deep .van-popover__content {
  width: 322upx;
  height: 150upx;
  background: linear-gradient(180deg, #2ba9ff 0%, #1370ff 100%);
}
.pop_tips_style {
  font-size: 30upx;
  font-weight: 600;
  color: #f4f7ff;
  padding-left: 36upx;
}
.pad_style {
  padding-top: 34upx;
}
::v-deep .van-overlay {
  background: #141517 !important;
  opacity: 0.8;
}
::v-deep.tui-sticky-class {
  padding-bottom: 110upx;
  height: 100%;
}
.celling_animation_style {
  position: fixed;
  left: 0;
  top: 0;
  z-index: 1000;
  width: 100vw !important;
  background: #212328;
  margin-top: 0 !important;
  padding-top: 36upx;
  padding-bottom: 36upx;
  animation-name: cellingAnmation;
  animation-duration: 0.3s;
  .buy_left {
    width: 40% !important;
  }
  .buy_right {
    width: 40% !important;
  }
}
.search_anmition_style {
  position: fixed;
  right: 30upx;
  top: 56upx;
  animation-name: seachAnmation;
  animation-duration: 0.3s;
  z-index: 30000;
}
@keyframes seachAnmation {
  0% {
    top: 0upx;
  }

  100% {
    top: 56upx;
  }
}
@keyframes cellingAnmation {
  0% {
    top: -45upx;
  }

  100% {
    //
    top: 0upx;
  }
}
.celling_style {
  position: fixed;
  left: 0;
  top: 0;
}
::v-deep.tui-sticky-fixed {
  top: 0 !important;
}
</style>

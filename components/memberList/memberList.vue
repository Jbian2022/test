<template>
  <view class="mebers_content">
    <uni-popup
      class="new_popup_style_inner_style"
      ref="popup"
      type="center"
      mask-background-color="rgba(20, 21, 23, 0.6)"
    >
      <view class="dialog">
        <view class="dialog-section">
          <view class="dialog-title">是否确认删除</view>
          <view class="dialog-content">确认删除该学员吗？删除后无法恢复！</view>
          <view class="dialog-btn-box">
            <van-button type="default" @click="close">取消</van-button>
            <van-button type="primary" @click="sureDeleteConfirm"
              >确认</van-button
            >
          </view>
        </view>
      </view>
    </uni-popup>

    <template v-if="needFlag">
      <view class="no_data_style">
        <image
          class="no_data_meber_img_style"
          src="../../static/app-plus/mebrs/nomebers.png"
          v-if="type === 'home'"
        ></image>
        <image
          class="no_data_meber_img_style"
          src="../../static/app-plus/mebrs/searchNoData.png"
          v-if="type === 'detail' && isFirstFlag"
        ></image>

        <view class="quckliy_add_style">{{
          type === 'home'
            ? '快去添加第一个学员吧'
            : isFirstFlag
            ? '什么内容都没搜到'
            : ''
        }}</view>
      </view>
    </template>
    <template v-else>
      <uni-swipe-action
        class="slide_stylle"
        v-for="(item, itemIndex) in resultMeberList"
        :key="'itemIndex' + itemIndex"
      >
        <uni-swipe-action-item
          :show="item.isOpened"
          :auto-close="false"
          @change="swipeChange($event, itemIndex, item)"
        >
          <template v-slot:right>
            <view class="slot-button" @click.stop="bindClick($event)">
              <image
                class="slot_btn_img_style"
                src="../../static/app-plus/mebrs/delete.svg"
              ></image>
            </view>
          </template>
          <view class="add_student_style">
            <view
              class="need_loop_style"
              :class="{ prohibit_style: item.prohibitUserOpear }"
              @click.native.stop="jumpMy(item)"
            >
              <view class="loop_top_style">
                <view class="top_left_style">
                  <text class="top_left_name_style">{{
                    item.traineeName
                  }}</text>
                  <image
                    class="top_left_img_style"
                    src="../../static/app-plus/mebrs/man.svg"
                    v-if="item.gender == 1"
                  ></image>
                  <image
                    class="top_left_img_style"
                    src="../../static/app-plus/mebrs/woman.svg"
                    v-if="item.gender == 2"
                  ></image>
                </view>
                <view
                  class="top_right_style"
                  @click.stop="goToNewWorkout(item)"
                >
                  <image
                    class="top_right_img_style"
                    src="../../static/app-plus/mebrs/trainingProgram.svg"
                  ></image>
                  <text>新建训练计划</text>
                </view>
              </view>
              <view class="loop_bottom_style">
                <view class="bottom_style" @click.stop="updateMember(item)">
                  <image
                    class="bootom_img_style"
                    src="../../static/app-plus/mebrs/meberMessage.svg"
                  ></image>
                  <text class="message_style">修改信息</text>
                </view>
                <view
                  class="bottom_style"
                  @click.stop.native="jumpPhysicalAssessment(item)"
                >
                  <image
                    class="bootom_img_style"
                    src="../../static/app-plus/mebrs/evaluationInformation.svg"
                  ></image>
                  <text class="message_style">身体评估</text>
                </view>
                <view
                  class="bottom_style"
                  @click.stop="goToTrainingRecord(item)"
                >
                  <image
                    class="bootom_img_style"
                    src="../../static/app-plus/mebrs/trainingLog.svg"
                  ></image>
                  <text class="message_style">训练记录</text>
                </view>
              </view>
              <view
                class="loop_bottom_result_style"
                @click.stop="getReport(item)"
              >
                <view class="result_last_remark_style">查看评估报告</view>
                <image
                  class="result_last_img_style"
                  src="../../static/app-plus/other/arrows.svg"
                ></image>
              </view>
            </view>
          </view>
        </uni-swipe-action-item>
      </uni-swipe-action>
    </template>
  </view>
</template>

<script>
var businessCloudObject = uniCloud.importObject('businessCloudObject', {
  customUI: true // 取消自动展示的交互提示界面
})
const train = uniCloud.importObject('train', {
  customUI: true // 取消自动展示的交互提示界面
})
import { debounce } from '../../common/util.js'

export default {
  name: 'memberList',
  data() {
    return {
      meberList: [],
      deleteRemarkFlag: true,
      delteIndex: 0,
      newActive: 0,
      isFirstActiveFlag: false,
      originList: [] //原始数据
    }
  },
  props: {
    isActive: Number,
    searchValue: String,
    type: String,
    isFirstFlag: Boolean,
    currentNum: Number,
    page: Number,
    termOfValidity: Boolean,
    userInfo: Object
  },

  created() {
    this.getOriginList()
  },
  mounted() {},
  onShow() {
    this.getOriginList()
  },

  computed: {
    needFlag() {
      let flag = false
      if (this.meberList.length === 0) {
        flag = true
      }
      // console.log(flag, ' LLLLL')
      return flag
    },
    // 最终的会员列表
    resultMeberList() {
      console.log(this.userInfo, 'this.meberList:你是快快快')
      let list = this.meberList

      if (this.userInfo && this.userInfo.vipLevel) {
        // 出现 vip 等级 它一定充钱了
        if (this.termOfValidity) {
          // 在有效期内不做任何逻辑处理
          list = list.map((item) => {
            return {
              ...item,
              prohibitUserOpear: false
            }
          })
        } else {
          if (this.originList.length <= 7) {
            // 充钱不添加会员的大shamao
            list = list.map((item) => {
              return {
                ...item,
                prohibitUserOpear: false
              }
            })
          }
          console.log(this.originList, '我是源数据')

          if (this.originList.length > 7) {
            // 充钱了且会员超过7
            let yesBuyList = this.originList.filter(
              (item) => item.buyStatus == 1
            )
            let noBuyList = this.originList.filter(
              (item) => item.buyStatus == 0
            )
            if (yesBuyList.length === 7) {
              noBuyList = noBuyList.map((item) => {
                return {
                  ...item,
                  prohibitUserOpear: true
                }
              })
              if (this.isActive == 0) {
                list = [...noBuyList]
              } else {
                list = [...yesBuyList]
              }
            }

            if (yesBuyList.length < 7) {
              // 差值，优先保留购课会员
              let differ = 7 - yesBuyList.length
              let sliceFirstList = noBuyList.slice(0, differ)
              let sliceLastList = noBuyList.slice(differ)
              sliceLastList = sliceLastList.map((item) => {
                return {
                  ...item,
                  prohibitUserOpear: true
                }
              })

              noBuyList = [...sliceFirstList, ...sliceLastList]
              if (this.isActive == 0) {
                list = [...noBuyList]
              } else {
                list = [...yesBuyList]
              }
            }
            if (yesBuyList.length > 7) {
              let sliceFirstList = yesBuyList.slice(0, 7)
              let sliceLastList = yesBuyList.slice(7)
              sliceLastList = sliceLastList.map((item) => {
                return {
                  ...item,
                  prohibitUserOpear: true
                }
              })
              yesBuyList = [...sliceFirstList, ...sliceLastList]
              noBuyList = noBuyList.map((item) => {
                return {
                  ...item,
                  prohibitUserOpear: true
                }
              })
              if (this.isActive == 0) {
                list = [...noBuyList]
              } else {
                list = [...yesBuyList]
              }
            }
          }
        }
      } else {
        // 不做任何处理
      }
      return list
    }
  },
  watch: {
    meberList: {
      handler: function (n, o) {
        this.$emit('getMemberList', n)
      },
      immediate: true
    },
    searchValue: {
      handler: function (n, o) {
        if (this.type === 'detail') {
          if (!n) {
            this.meberList = []
            return
          }
          console.log(n, '>>>>')
          if (n) {
            debounce(this.searchMemberList(n), 300)
          }
        }
      },
      deep: true
    }
  },
  methods: {
    close() {
      this.$refs.popup.close()
    },
    jumpPhysicalAssessment(item) {
      if (item.prohibitUserOpear) {
        uni.switchTab({
          url: '/pages/my/my'
        })
        uni.showToast({
          title: '您的金卡教练已过期，续费金卡教练可继续管理会员~',
          duration: 1000,
          width: 180,
          icon: 'none'
        })
        return
      }

      uni.navigateTo({
        url:
          '/pages/physicalAssessment/physicalAssessment' +
          '?traineeNo=' +
          item._id,
        // url: '/pages/physicalAssessment/physicalAssessment' + '?userId=' + item.userId,
        success: (res) => {},
        fail: () => {},
        complete: () => {}
      })
    },
    searchMemberList(data) {
      businessCloudObject
        .getMoreList(data)
        .then((meberListRes) => {
          console.log(meberListRes, 'meberListRes')
          this.meberList =
            meberListRes.data.map((item) => {
              return {
                ...item,
                isOpened: 'none'
              }
            }) || []
        })
        .catch((err) => {})
    },
    // 确认删除会员信息
    sureDeleteConfirm() {
      businessCloudObject
        .removeMember(this.meberList[this.delteIndex])
        .then((res) => {
          if (res.success) {
            uni.showToast({
              icon: 'success',
              title: res.message,
              duration: 800
            })

            if (this.type === 'detail') {
              if (!this.searchValue) {
                this.meberList = []
              } else {
                this.searchMemberList(this.searchValue)
              }
            } else {
              this.getMemberList(this.isActive)
            }
            this.$refs.popup.close()
          }
        })
        .catch((err) => {
          uni.showToast({
            icon: 'fail',
            title: err.message,
            duration: 800
          })
        })
    },
    // 编辑会员信息
    updateMember(item) {
      if (item.prohibitUserOpear) {
        uni.switchTab({
          url: '/pages/my/my'
        })
        uni.showToast({
          title: '您的金卡教练已过期，续费金卡教练可继续管理会员~',
          duration: 1000,
          width: 180,
          icon: 'none'
        })
        return
      }
      uni.navigateTo({
        url: '/pages/addMyMebers/addMyMebers?item=' + JSON.stringify(item),
        success: (res) => {},
        fail: () => {},
        complete: () => {}
      })
    },

    getOriginList() {
      let self = this

      this.$nextTick(() => {
        businessCloudObject
          .getMemberList()
          .then((meberListRes) => {
            let originList =
              meberListRes.data.map((item) => {
                return {
                  ...item,
                  prohibitUserOpear: false
                }
              }) || []
            // 判端是否过期

            self.$set(self, 'originList', originList)

            self.$forceUpdate()
          })
          .catch((err) => {})
      })
    },

    getMemberList(buyStatus) {
      let self = this

      this.$nextTick(() => {
        businessCloudObject
          .getMemberList(buyStatus)
          .then((meberListRes) => {
            console.log(meberListRes, 'meberListRes')
            let meberList =
              meberListRes.data.map((item) => {
                return {
                  ...item,
                  prohibitUserOpear: false
                }
              }) || []

            self.$set(self, 'meberList', meberList)
            console.log(self.meberList, '?????')
            self.$forceUpdate()
          })
          .catch((err) => {})
      })
    },
    bindClick(e) {
      console.log('你好')
      this.$refs.popup.open()
    },
    swipeChange(e, index, item) {
      if (item.prohibitUserOpear) {
        return
      }

      this.delteIndex = index
      console.log('当前状态：' + e + '，下标：' + index)
    },

    goToTrainingRecord(item) {
      if (item.prohibitUserOpear) {
        uni.switchTab({
          url: '/pages/my/my'
        })
        uni.showToast({
          title: '您的金卡教练已过期，续费金卡教练可继续管理会员~',
          duration: 1000,
          width: 180,
          icon: 'none'
        })
        return
      }
      try {
        uni.setStorageSync('isActive', String(this.isActive)) // 缓存标签激活信息
      } catch (e) {
        // error
      }
      uni.navigateTo({
        url:
          '/pages/trainingRecord/trainingRecord' +
          `?traineeNo=${item._id}&memberName=${item.traineeName}`
      })
    },
    async goToNewWorkout(item) {
      if (item.prohibitUserOpear) {
        uni.switchTab({
          url: '/pages/my/my'
        })
        uni.showToast({
          title: '您的金卡教练已过期，续费金卡教练可继续管理会员~',
          duration: 1000,
          width: 180,
          icon: 'none'
        })
        return
      }
      try {
        uni.setStorageSync('isActive', String(this.isActive)) // 缓存标签激活信息
      } catch (e) {
        // error
      }
      const res = await train.getTrainList({
        traineeNo: item._id,
        trainDate: this.getDay(new Date())
      })
      if (res.data && res.data.length > 0) {
        const { trainContent } = res.data[0]
        const list = JSON.parse(trainContent) || []
        if (list && list.length >= 3) {
          return uni.showToast({
            icon: 'none',
            title: '每日最多添加三次训练记录',
            duration: 2000
          })
        }
      }
      uni.navigateTo({
        url:
          '/pages/newWorkout/newWorkout' +
          `?traineeNo=${item._id}&traineeName=${item.traineeName}`
      })
    },
    getDay(val) {
      const formater = (temp) => {
        if (temp < 10) {
          return '0' + temp
        } else {
          return temp
        }
      }
      const d = new Date(val)
      const year = d.getFullYear()
      const month = formater(d.getMonth() + 1)
      const date = formater(d.getDate())
      return year + '-' + month + '-' + date
    },
    jumpMy(item) {
      if (item.prohibitUserOpear) {
        uni.switchTab({
          url: '/pages/my/my'
        })
        uni.showToast({
          title: '您的金卡教练已过期，续费金卡教练可继续管理会员~',
          duration: 2000,
          width: 180,
          icon: 'none'
        })
        return
      }
    },
    getReport(item) {
      if (item.prohibitUserOpear) {
        uni.switchTab({
          url: '/pages/my/my'
        })
        uni.showToast({
          title: '您的金卡教练已过期，续费金卡教练可继续管理会员~',
          duration: 1000,
          width: 180,
          icon: 'none'
        })
        return
      }
      try {
        uni.setStorageSync('isActive', String(this.isActive)) // 缓存标签激活信息
      } catch (e) {
        // error
      }
      uni.navigateTo({
        url:
          '/pages/viewReport/viewReport' +
          '?traineeNo=' +
          item._id +
          '&key=2' +
          '&buyStatus=' +
          item.buyStatus
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.mebers_content {
  width: 100vw;
  flex: 1;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  padding-bottom: 180upx;
  // background: #212328;
  .no_data_style {
    width: 100%;
    display: flex;
    flex: 1;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-top: calc((100% - 380upx) / 2);
    .no_data_meber_img_style {
      // width: 100%;
      width: 382upx;
      height: 382upx;
      object-fit: contain;
    }
    .quckliy_add_style {
      margin-top: 20upx;
      font-size: 28upx;
      font-weight: 400;
      color: #7a7f89;
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
      .prohibit_style {
        opacity: 0.3;
      }

      .need_loop_style {
        width: calc(100% - 60upx);
        margin-top: 30upx;
        display: flex;
        flex-direction: column;
        // justify-content: space-around;
        background: #383d46;
        border-radius: 24upx;
        height: 346upx;

        .loop_top_style {
          width: 100%;
          display: flex;
          justify-content: space-around;
          margin-top: 40upx;
          .top_left_style {
            width: 50%;
            display: flex;
            align-items: center;

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
          width: calc(100% - 60upx);
          margin-left: 30upx;
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 70upx;
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

      .loop_bottom_result_style {
        display: flex;
        width: calc(100% - 60upx);
        height: 70upx;
        margin-left: 30upx;
        background: #454951;
        border-radius: 16upx;
        align-items: center;
        justify-content: center;
        margin-top: 30upx;
        .result_last_remark_style {
          font-size: 24upx;
          font-weight: 400;
          color: #bdc3ce;
        }
        .result_last_img_style {
          width: 24upx;
          height: 24upx;
          object-fit: contain;
        }
      }
      // .need_loop_style:last-child {
      //  margin-bottom: 40upx;
      // }
    }
  }
}
.slot-button {
  // width: 100upx !important;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  .slot_btn_img_style {
    width: 100upx;
    height: 100upx;
    margin-right: 40upx;
  }
}

.dialog {
  background: #383d46;
  border-radius: 24upx;
}
.dialog-section {
  padding: 50upx;
  .dialog-title {
    display: flex;
    align-items: center;
    font-size: 52upx;
    color: #f4f7ff;
    line-height: 72upx;
    font-weight: 600;
    &::after {
      content: '';
      margin-left: 20upx;
      display: inline-block;
      width: 60upx;
      height: 60upx;
      background: url('../../static/newWorkout/pop-up.png');
      background-size: contain;
      background-repeat: no-repeat;
    }
  }
  .dialog-content {
    margin-top: 30upx;
    margin-bottom: 80upx;
    font-size: 30upx;
    font-weight: 400;
    color: #a8adb6;
    line-height: 48upx;
  }
}
.dialog-btn-box {
  ::v-deep .van-button {
    width: 240upx;
    height: 90upx;
    background: #454951;
    border-radius: 16upx;
    border: none;
    font-size: 32upx;
    font-weight: 600;
    color: #ffffff;
    & + .van-button {
      margin-left: 30upx;
    }
    &.van-button--primary {
      background: #1370ff;
    }
  }
}
::v-deep .uni-popup [name='mask'] {
  backdrop-filter: blur(3px);
}

.mask_popup_style {
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
}

::v-deep .uni-popup [name='mask'] {
  backdrop-filter: blur(3px);
}
::v-deep .new_popup_style_inner_style {
  position: relative !important;
  z-index: 1005;
}
</style>
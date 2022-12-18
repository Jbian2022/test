<template>
  <view class="content_style">
    <BgTheamCompontent :theamType="'currency'"></BgTheamCompontent>
    <NavBarCompontent :leftNavTitle="'体测报告填写'"></NavBarCompontent>

    <view class="contetnt_form_style">
      <uni-forms
        :modelValue="configForm"
        ref="studentForm"
        label-position="top"
      >
        <template v-for="(item, itemIndex) in bodyTestReport" :key="itemIndex">
          <uni-forms-item
            class="outer_form_item_style"
            :label="item.questionContent"
            :name="item.code"
          >
            <view class="change_picker_style">
              <hpy-form-select
                :dataList="item.configList"
                :title="
                  item.answerRemark && item.answerRemark.remarkTitle
                    ? item.answerRemark.remarkTitle
                    : '请选择'
                "
                text="text"
                name="value"
                v-model="configForm[item.key]"
              />
            </view>
          </uni-forms-item>
        </template>
      </uni-forms>
    </view>
    <view class="bottom_style" @click.stop="saveBodyTestReport">保存</view>
  </view>
</template>

<script>
import BgTheamCompontent from '../../components/bgTheamCompontent/bgTheamCompontent.vue'
import NavBarCompontent from '../../components/navBarCompontent/navBarCompontent.vue'
import hadleDate from '../../common/timeUtil.js'
var businessCloudObject = uniCloud.importObject('businessCloudObject')
export default {
  components: {
    BgTheamCompontent,
    NavBarCompontent
  },
  data() {
    return {
      configForm: {},

      traineeNo: '',
      questionCode: '',
      originList: [],
      bodyTestReport: [] //体测报告填写数组
    }
  },
  onLoad(options) {
    if (JSON.stringify(options) !== '{}' && options.traineeNo) {
      this.traineeNo = options.traineeNo
    }
    if (
      JSON.stringify(options) !== '{}' &&
      options.hasOwnProperty('childList')
    ) {
      let originList = JSON.parse(options.childList)
      this.originList = originList
      console.log(originList, '>>>')
    }
    if (
      JSON.stringify(options) !== '{}' &&
      options.hasOwnProperty('questionCode')
    ) {
      this.questionCode = options.questionCode
    }
  },
  mounted() {
    this.requestList()
  },
  methods: {
    saveBodyTestReport() {
      // 参数封装
      let saveParam = {
        traineeNo: this.traineeNo,
        questionCode: this.questionCode,
        bodyTestReport: this.configForm
      }
      businessCloudObject
        .opearConfig(saveParam, 'bodyTestReport')
        .then((res) => {
          console.log(res, '我要保存了')
          if (res.success) {
            uni.redirectTo({
              url:
                '/pages/physicalAssessment/physicalAssessment' +
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
    requestList() {
      console.log(
        this.traineeNo,
        'this.traineeNo',
        this.questionCode,
        'this.questionCode'
      )
      var self = this
      businessCloudObject
        .opearConfigQuery({
          traineeNo: this.traineeNo,
          questionCode: this.questionCode
        })
        .then((res) => {
          let opearConfigList = this.originList.map((item) => {
            let configList = []
            if (
              item.hasOwnProperty('configList') &&
              item.configList.length > 0
            ) {
              configList = item.configList
            }
            return {
              ...item,
              configList
            }
          })
          console.log(res, 'kkkkk')
          // 如果答案为空则表单为空
          if (res.affectedDocs === 0) {
            this.configForm = {}
            this.bodyTestReport = opearConfigList
          } else {
            // 如果有数据则证明有答案
            opearConfigList = opearConfigList.map((config) => {
              var saveKey = null
              res.data.forEach((v) => {
                for (var key in v.bodyTestReport) {
                  if (config.key === key) {
                    saveKey = {
                      [key]: v.bodyTestReport[key]
                    }

                    setTimeout(() => {
                      Object.assign(self.configForm, saveKey)
                    }, 500)
                  }
                }
              })
              return {
                ...config
              }
            })
            console.log(self.configForm, 'this.configForm', opearConfigList)

            self.bodyTestReport = opearConfigList
          }
        })
        .catch((err) => {})
    },
    /**
     * 格式化日期
     * @param type
     * @param val
     * @returns {string|*}
     */
    formatter(type, val) {
      if (type === 'year') {
        return `${val}年`
      } else if (type === 'month') {
        return `${val}月`
      } else if (type === 'day') {
        return `${val}日`
      } else if (type === 'hour') {
        return `${val}时`
      } else if (type === 'minute') {
        return `${val}分`
      }
      return val
    },
    genderChange(value) {},
    birthConfirm() {
      this.studentForm.birthday = hadleDate.timeFormat(
        this.currentDate,
        'yyyy-MM-dd'
      )
      this.dateShowpicker = false
    },
    genderConfirm(e) {
      this.studentForm.gender = e.value
      this.gender = e.text
      let defaultIndex = this.columns.findIndex((item) => {
        item.value = e.value
      })
      this.defaultIndex = defaultIndex
      this.showPicker = false
    },
    addDirectly(type) {
      debugger
      var that = this
      console.log(type, 'nishi')
      this.$refs.studentForm
        .validate()
        .then(() => {
          let businessCloudObject = uniCloud.importObject('businessCloudObject')
          console.log(that.requestItem, 'that.requestItem')
          if (type == 'edit' || that.requestItem) {
            businessCloudObject
              .updateMember(that.studentForm)
              .then((updateRes) => {
                if (updateRes.success) {
                  uni.switchTab({
                    url: '/pages/myMebers/myMebers',
                    success: (res) => {},
                    fail: () => {},
                    complete: () => {}
                  })

                  uni.showToast({
                    icon: 'success',
                    title: res.message,
                    duration: 800
                  })
                } else {
                  uni.showToast({
                    icon: 'fail',
                    title: res.message,
                    duration: 800
                  })
                }
              })
              .catch((err) => {
                uni.showToast({
                  icon: '编辑失败',
                  title: err.message,
                  duration: 800
                })
              })

            return
          }

          businessCloudObject
            .addMember(that.studentForm)
            .then((res) => {
              if (res.success) {
                console.log(type, '>>>>')
                if (type == 'body') {
                  businessCloudObject
                    .getOnlyList({
                      traineeName: that.studentForm.traineeName,
                      mobile: that.studentForm.mobile
                    })
                    .then((res) => {
                      console.log(res, '即将发送的res')
                      if (res.success) {
                        let data = res.data
                        uni.navigateTo({
                          url:
                            '/pages/physicalAssessment/physicalAssessment' +
                            '?traineeNo=' +
                            data[0]._id
                        })
                      }
                    })
                    .catch((err) => {})
                } else {
                  uni.switchTab({
                    url: '/pages/myMebers/myMebers',
                    success: (res) => {},
                    fail: () => {},
                    complete: () => {}
                  })
                }
                uni.showToast({
                  icon: 'success',
                  title: res.message,
                  duration: 800
                })
              } else {
                console.log(2)
                uni.showToast({
                  icon: 'fail',
                  title: res.message,
                  duration: 800
                })
              }
            })
            .catch((err) => {})
        })
        .catch((err) => {})
    },

    onConfirm() {},
    onSubmit() {},
    buyClick(type) {
      this.studentForm.buyStatus = type
    }
  }
}
</script>

<style lang="scss" scoped>
.van-hairline--bottom:after {
  border-bottom-width: 0;
  border-bottom-color: #212328;
}

::v-deep.van-nav-bar__content {
  background: #212328;
  border: none;
  height: 88upx;
  box-sizing: border-box;
}
::v-deep.van-nav-bar .van-icon {
  color: #fff;
}
::v-deep.van-nav-bar .van-nav-bar__text {
  color: #fff !important;
}
.content_style {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  position: relative;
  display: flex;
  flex-direction: column;
  .contetnt_form_style {
    width: 100%;
    flex: 1;
    margin-top: 30upx;
    overflow-y: auto;
  }
}

::v-deep.van-cell {
  display: flex;
  flex-direction: column;
  background: #383d46 !important;
  position: relative;
  border-bottom-width: 0 !important;

  .van-cell__title {
    width: 100% !important;
    color: #f4f7ff !important;
    label {
      font-size: 30upx;
      color: #f4f7ff !important;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
    }
  }
  .van-cell__value {
    margin-top: 40upx;
    display: flex;
    flex-wrap: nowrap;
    border-bottom-width: 0 !important;
    .van-field__body {
      .van-field__control {
        color: #f4f7ff !important;
      }
      input {
        color: #f4f7ff !important;
      }
    }
  }
  i {
    position: absolute;
    right: 30upx;
    top: 120upx;
  }
}
::v-deep.van-cell:after {
  border-bottom: none;
}
::v-deep.van-cell-group {
  background: #383d46 !important;
  margin-top: 30upx;
  border-bottom-width: 0 !important;
}
.is_buy_content_style {
  width: 100%;
  height: 140upx;
  display: flex;
  flex-direction: row !important;
  align-items: center;
  justify-content: space-between;
  border-radius: 16upx;
  .buy_text_style {
    font-size: 30upx;
    color: #f4f7ff !important;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
  }
  .is_buy_style {
    display: flex;
    align-items: center;
    width: 176upx;
    .buy_left {
      width: 50%;
      height: 100%;
      text-align: center;
      background: linear-gradient(180deg, #343a44 0%, #212328 100%);
      line-height: 82upx;
      color: #a8adb6;

      border-radius: 16upx 0px 0px 16upx;
    }
    .buy_right {
      width: 50%;
      height: 100%;
      color: #a8adb6;
      line-height: 88upx;
      text-align: center;
      background: linear-gradient(180deg, #343a44 0%, #212328 100%);
      border-radius: 0px 16upx 16upx 0px;
    }
    .active {
      background: #1370ff;
      color: #fff;
    }
  }
}

.add_method_style {
  box-sizing: border-box;
  width: calc(100vw - 60upx);
  // margin-left: 30upx;
  margin-top: 30upx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .add_left_style {
    width: calc(50% - 15upx);
    height: 100upx;
    font-size: 32upx;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: 600;
    color: #ffffff;
    background: #454951;
    border-radius: 16upx;
    z-index: 88;
    text-align: center;
    line-height: 100upx;
  }
  .add_right_style {
    width: calc(50% - 15upx);
    height: 100upx;
    font-size: 32upx;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: 600;
    color: #ffffff;
    background: #1370ff;
    border-radius: 16upx;
    z-index: 88;
    text-align: center;
    line-height: 100upx;
  }
}
.edit_save_style {
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
}
.bar_content_style {
  width: calc(100vw - 80upx);
  margin-left: 40upx;
  padding-top: 40upx;
  display: flex;
  justify-content: space-between;

  .bar_left_style {
    font-size: 36upx;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: 600;
    color: #f4f7ff;
  }
  .bar_right_style {
    width: 50upx;
    height: 50upx;
    object-fit: contain;
  }
}

.custom_bottom_style {
  width: calc(100vw - 80upx);
  margin-left: 40upx;
  margin-bottom: 68upx;
  height: 100upx;
  background: #1370ff;
  border-radius: 16upx;
  font-size: 32upx;
  font-family: PingFangSC-Semibold, PingFang SC;
  font-weight: 600;
  color: #ffffff;
  text-align: center;
  line-height: 100upx;
}

::v-deep .van-popup {
  background: #383d46 !important;
  border-radius: 24upx 24upx 0px 0px;
  .van-picker__mask {
    background-image: none;
  }
}
::v-deep .van-ellipsis {
  color: #f4f7ff;
  font-size: 32upx;
  font-family: PingFangSC-Semibold, PingFang SC;
  font-weight: 600;
  color: #f4f7ff;
}
::v-deep .van-hairline-unset--top-bottom:after {
  border-width: 0 !important;
  width: 100%;
  height: 100%;
}
::v-deep .van-hairline-unset--top-bottom {
  background: rgba(75, 82, 94, 0.5) !important;
  border-radius: 16px;
  z-index: -1;
}
::v-deep .van-picker {
  background: #383d46 !important;
  z-index: -3;
}

::v-deep .van-picker__confirm {
  color: #f4f7ff;
  font-size: 32upx;
  font-family: PingFangSC-Semibold, PingFang SC;
  font-weight: 600;
  color: #f4f7ff;
  line-height: 50upx;
}
::v-deep .van-picker__cancel {
  font-size: 32upx;
  font-family: PingFangSC-Semibold, PingFang SC;
  font-weight: 600;
  color: #7a7f89;
  line-height: 50upx;
}
::v-deep .van-picker__toolbar {
  margin-top: 10upx;
}

::v-deep .uni-forms {
  width: calc(100vw - 80upx);
  margin-left: 40upx;

  uni-form {
    span {
      .uni-forms-item {
        width: 100%;
        min-height: 186upx;
        padding: 30upx;
        box-sizing: border-box;
        display: block;
        background: rgba(75, 82, 94, 0.5) !important;
        border-radius: 16upx;

        .uni-forms-item__label {
          width: 100% !important;
          uni-text {
            width: 100% !important;
            width: 100% !important;
            font-size: 30upx;
            height: 44upx;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #f4f7ff;
            span {
              display: inline-block;
              width: 100% !important;
              font-size: 30upx;
              height: 44upx;
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: #f4f7ff;
            }
          }
        }

        .uni-forms-item__content {
          .uni-easyinput {
            font-size: 32upx;
            font-family: PingFangSC-Semibold, PingFang SC;
            font-weight: 600;
            color: #f4f7ff !important;
            .uni-easyinput__content {
              border-color: transparent !important;
              background-color: transparent !important;
            }
          }
          .uni-input-input {
            font-size: 32upx;
            font-family: PingFangSC-Semibold, PingFang SC;
            font-weight: 600;
            color: #f4f7ff !important;
          }
        }
      }
    }
  }
}

::v-deep .uni-picker-container {
  .uni-picker-custom {
    border-radius: 24upx 24upx 0px 0px;
    background: #383d46 !important;
    .uni-picker-header {
      background: transparent !important;
      border-bottom: none;
      .uni-picker-action-cancel {
        padding-left: 40upx;
        // padding-top: 40upx;
        font-size: 32upx;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        color: #7a7f89;
      }
      .uni-picker-action-confirm {
        padding-right: 40upx;
        // padding-top: 40upx;
        font-size: 32upx;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        color: #f4f7ff;
      }
    }
    .uni-picker-header::after {
      border-bottom: none !important;
    }
    .uni-picker-content {
      background: transparent !important;
      .uni-picker-item {
        color: #f4f7ff !important;
      }
    }
  }
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
::v-deep.uni-picker-view-mask {
  background: transparent !important;
}
::v-deep.uni-picker-view-indicator {
  border: none !important;
  // width: 80%;

  // margin-left: 40upx;
  background: rgba(75, 82, 94, 0.5) !important;
  border-radius: 16px;
  z-index: -1;
}

::v-deep.uni-picker-view-indicator:before {
  border-top: none;
}
::v-deep.uni-picker-view-indicator::after {
  border-bottom: none;
}
</style>

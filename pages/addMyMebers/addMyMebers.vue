<template>
  <view class="content_style">
    <BgTheamCompontent :theamType="'currency'"></BgTheamCompontent>
    <NavBarCompontent :leftNavTitle="leftNavTitle"></NavBarCompontent>

    <view class="contetnt_form_style">
      <uni-forms
        :modelValue="studentForm"
        ref="studentForm"
        :rules="rules"
        label-position="top"
      >
        <uni-forms-item
          class="outer_form_item_style"
          :label="'真实姓名(必填)'"
          name="traineeName"
        >
          <input
            type="text"
            clas="change_input_style"
            v-model="studentForm.traineeName"
            placeholder="请输入真实姓名"
          />
        </uni-forms-item>
        <uni-forms-item
          class="outer_form_item_style"
          :label="'性别(必填)'"
          name="gender"
        >
          <Mpicker
            mode="bottom"
            :show.sync="sexShow"
            :range="range"
            :rangeKey="'text'"
            @confirm="sexConfirm"
            @cancel="sexCancel"
            :pickerType="'ordinary'"
            :defaultIndex="handleSexDefaultIndex"
          ></Mpicker>
          <view class="change_picker_style" @click.stop="openDialog">
            <view
              class="label_style"
              :class="studentForm.gender ? '' : 'student_label_style'"
              >{{ !studentForm.gender ? '请选择性别' : genderLabel }}</view
            >
            <image
              class="back_img_style"
              src="../../static/app-plus/mebrs/back.png"
            ></image>
          </view>
        </uni-forms-item>
        <uni-forms-item
          class="outer_form_item_style"
          :label="'生日(必填)'"
          name="birthday"
        >
          <Mpicker
            mode="bottom"
            :range="range"
            :show.sync="birthShow"
            @confirm="dateConfirm"
            @cancel="dateCancel"
            :pickerType="'date'"
            :defaultIndex="0"
            :distinguishModel="studentForm.birthday"
          ></Mpicker>
          <view class="change_picker_style" @click.stop="birthShow = true">
            <view
              class="label_style"
              :class="studentForm.birthday ? '' : 'student_label_style'"
              >{{
                !studentForm.birthday ? '请选生日' : studentForm.birthday
              }}</view
            >
            <image
              class="back_img_style"
              src="../../static/app-plus/mebrs/back.png"
            ></image>
          </view>

          <!-- 		<DatePicker></DatePicker> -->
          <!--         <hpy-form-select
            mode="date"
            start="1872-01-01"
            end="2050-01-01"
            v-model="studentForm.birthday"
          /> -->
        </uni-forms-item>
        <uni-forms-item
          class="outer_form_item_style"
          :label="'手机号码(必填)'"
          name="mobile"
        >
          <input
           type="number"
            clas="change_input_style"
            v-model="studentForm.mobile"
            placeholder="请输入手机号码"
			maxlength="11"
          />
        </uni-forms-item>

        <view class="is_buy_content_style van-cell">
          <text class="buy_text_style">是否已购课</text>
          <view class="is_buy_style">
            <view
              class="buy_left"
              :class="studentForm.buyStatus == 0 ? 'active' : ''"
              @click.native="buyClick(0)"
              >否</view
            >
            <view
              class="buy_right"
              :class="studentForm.buyStatus == 1 ? 'active' : ''"
              @click.native="buyClick(1)"
              >是</view
            >
          </view>
        </view>

        <view class="add_method_style" v-if="leftNavTitle === '添加学员'">
          <view class="add_left_style" @click.native="addDirectly"
            >直接添加</view
          >
          <view class="add_right_style" @click.native="addDirectly('body')"
            >身体评测并添加</view
          >
        </view>
        <view
          class="add_method_style edit_save_style"
          @click.native="addDirectly('edit')"
          v-else
        >
          保存
        </view>
      </uni-forms>
    </view>
  </view>
</template>

<script>
import BgTheamCompontent from '../../components/bgTheamCompontent/bgTheamCompontent.vue'
import NavBarCompontent from '../../components/navBarCompontent/navBarCompontent.vue'
import hadleDate from '../../common/timeUtil.js'
import Mpicker from '../../components/mPicker.vue/mPicker.vue'

export default {
  components: {
    BgTheamCompontent,
    NavBarCompontent,
    Mpicker
  },
  data() {
    return {
      studentForm: {
        traineeName: '',
        gender: '',
        birthday: '',
        mobile: '',
        buyStatus: 0
      },
      sexShow: false,
      birthShow: false,
      gender: '',
      range: [
        { text: '男', value: '1' },
        { text: '女', value: '2' }
      ],
      showPicker: false,
      minDate: new Date(1888, 1, 1),
      maxDate: new Date(2025, 10, 1),
      dateShowpicker: false,
      currentDate: new Date(),
      customFieldName: { text: 'text', value: 'value' },
      gendDefaultIndex: 0,
      pattern:
        /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/,
      requestItem: null,
      leftNavTitle: '添加学员',
      rules: {
        // 对name字段进行必填验证
        traineeName: {
          // name 字段的校验规则
          rules: [
            // 校验 name 不能为空
            {
              required: true,
              errorMessage: '请输入真实姓名'
            }
          ],
          // 当前表单域的字段中文名，可不填写
          label: '真实姓名',
          validateTrigger: 'submit'
        },
        gender: {
          // name 字段的校验规则
          rules: [
            // 校验 name 不能为空
            {
              required: true,
              errorMessage: '请选择性别'
            }
          ],
          // 当前表单域的字段中文名，可不填写
          label: '性别',
          validateTrigger: 'submit'
        },
        birthday: {
          // name 字段的校验规则
          rules: [
            // 校验 name 不能为空
            {
              required: true,
              errorMessage: '请选择生日'
            }
          ],
          // 当前表单域的字段中文名，可不填写
          label: '姓名',
          validateTrigger: 'submit'
        },
        mobile: {
          // name 字段的校验规则
          rules: [
            // 校验 name 不能为空
            {
              required: true,
              errorMessage: '请输入手机号码'
            },
            // 对name字段进行长度验证
            {
              minLength: 11,
              maxLength: 11,

              errorMessage: '请输入正确的手机号码'
            }
          ],
          // 当前表单域的字段中文名，可不填写
          label: '手机号码',
          validateTrigger: 'submit'
        }
      },
	  isActive: ''
    }
  },
  onLoad(options) {
    if (JSON.stringify(options) !== '{}' && options.hasOwnProperty('item')) {
      let requestItem = options.hasOwnProperty('item')
        ? JSON.parse(options.item)
        : null
      this.studentForm = this.requestItem = requestItem
      this.gender = this.range.find((v) => v.value === requestItem.gender).text
      this.leftNavTitle = '基础信息'
    }
	if (JSON.stringify(options) !== '{}') {
		let isActive = options.hasOwnProperty('isActive') ? options.isActive : '1'
		this.isActive = isActive
	}
  },
  computed: {
	handleSexDefaultIndex() {
		let sexIndex = this.range.findIndex(k => k.value === this.studentForm.gender)
		return sexIndex
	},
    genderLabel() {
      let label = ''
      let findData = this.range.find(
        (item) => item.value === this.studentForm.gender
      )
      if (findData) {
        label = findData.text || ''
      }
      return label
    }
  },
  mounted() {},
  methods: {
    openDialog() {
      this.sexShow = true
    },
    sexConfirm(e) {
      this.studentForm.gender = this.range[e[0]].value
      this.sexShow = false
    },
    dateConfirm(e) {
      console.log(e, '我是日期')
      this.studentForm.birthday = e
      this.birthShow = false
    },
    dateCancel() {
      this.birthShow = false
    },
    sexCancel() {
      this.sexShow = false
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
      let defaultIndex = this.range.findIndex((item) => {
        item.value = e.value
      })
      this.defaultIndex = defaultIndex
      this.showPicker = false
    },
    addDirectly(type) {
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
                  uni.reLaunch({
                    url: '/pages/myMebers/myMebers' + '?isActive=' + this.isActive,
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
                  uni.reLaunch({
                     url: '/pages/myMebers/myMebers' + '?isActive=' + this.isActive,
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
		margin-bottom: 30upx !important;

        .uni-forms-item__label {
          width: 100% !important;
          uni-text {
            width: 100% !important;
            width: 100% !important;
            font-size: 30upx;
            height: 44upx;
            font-family: PingFangSC-Semibold !important;
            font-weight: 400;
            color: #f4f7ff;
            span {
              display: inline-block;
              width: 100% !important;
              font-size: 30upx;
              height: 44upx;
               font-family: PingFangSC-Semibold !important;
              font-weight: 400;
              color: #f4f7ff;
            }
          }
        }

        .uni-forms-item__content {
          .uni-easyinput {
            font-size: 32upx;
            font-family: PingFangSC-Semibold !important;
            font-weight: 600;
            color: #f4f7ff !important;
            .uni-easyinput__content {
              border-color: transparent !important;
              background-color: transparent !important;
            }
          }
          .uni-input-input {
            font-size: 32upx;
           font-family: PingFangSC-Semibold !important;
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

.change_picker_style {
  display: flex;
  width: 100%;
  height: 80upx;
  align-items: center;
  justify-content: space-between;
  .label_style {
    font-size: 32upx;
    font-family: PingFangSC-Semibold, PingFang SC; 
    font-weight: 600;
    color: #f4f7ff;
    line-height: 44upx;
  }
  .back_img_style {
    width: 30upx;
    height: 32upx;
    object-fit: contain;
    transform: rotate(180deg);
  }
}
.student_label_style {
  font-size: 32upx !important;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400 !important;
  color: #7a7f89 !important;
}
</style>

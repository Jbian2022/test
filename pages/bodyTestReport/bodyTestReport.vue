<template>
  <view class="content_style">
    <BgTheamCompontent :theamType="'currency'"></BgTheamCompontent>
    <NavBarCompontent :leftNavTitle="'体侧报告填写'"></NavBarCompontent>

    <view class="contetnt_form_style">
<!--      <van-form @submit="onSubmit" ref="studentForm">
        <van-cell-group inset>
          <van-field
            v-model="studentForm.traineeName"
            name="traineeName"
            label="真实姓名(必填)"
            placeholder="请填写姓名"
            :rules="[{ required: true, message: '请填写真实姓名' }]"
          />
        </van-cell-group>
        <van-cell-group inset>
          <van-field
            v-model="gender"
            is-link
            readonly
            name="gender"
            label="性别(必填)"
            placeholder="请选择性别"
            @click="showPicker = true"
            :rules="[{ required: true, message: '请选择性别' }]"
          />
          <van-popup v-model:show="showPicker" position="bottom">
            <van-picker
              :columns="columns"
              ref="gendPicker"
              @confirm="genderConfirm"
              @cancel="showPicker = false"
              :show-toolbar="true"
              title="请选择性别"
              :defaultIndex="gendDefaultIndex"
            >
            </van-picker>
          </van-popup>
        </van-cell-group>
        <van-cell-group inset>
          <van-field
            v-model="studentForm.birthday"
            is-link
            readonly
            name="picker"
            label="生日(必填)"
            placeholder="请选择生日"
            @click="dateShowpicker = true"
            :rules="[{ required: true, message: '请选择生日' }]"
          />
          <van-popup v-model:show="dateShowpicker" position="bottom">
            <van-datetime-picker
              v-model="currentDate"
              type="date"
              title="选择年月日"
              :min-date="minDate"
              :max-date="maxDate"
              @confirm="birthConfirm"
              @cancel="dateShowpicker = false"
              :formatter="formatter"
            />
          </van-popup>
        </van-cell-group>
        <van-cell-group inset>
          <van-field
            v-model="studentForm.mobile"
            name="pattern"
            label="手机号码(必填)"
            placeholder="请填写手机号码"
            type="tel"
            maxlength="11"
            :rules="[{ pattern, message: '请输入正确的手机号码' }]"
          />
        </van-cell-group>


        <view
          class="add_method_style edit_save_style"
          @click.native="addDirectly('edit')"
        
        >
          确认
        </view>
      </van-form> -->
    </view>
  </view>
</template>

<script>
import BgTheamCompontent from '@/components/bgTheamCompontent/bgTheamCompontent.vue'
import NavBarCompontent from '@/components/navBarCompontent/navBarCompontent.vue'
import hadleDate from '@/common/timeUtil.js'
export default {
  components: {
    BgTheamCompontent,
    NavBarCompontent
  },
  data() {
    return {
      studentForm: {
        traineeName: '',
        gender: '0',
        birthday: '',
        mobile: '',
        buyStatus: 0
      },
      gender: '',
      columns: [
        { text: '未知', value: '0' },
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
    }
  },
  onLoad(options) {
    if (JSON.stringify(options) !== '{}') {
      let requestItem = options.hasOwnProperty('item')
        ? JSON.parse(options.item)
        : null
      this.studentForm = this.requestItem = requestItem
      this.currentDate = new Date(requestItem.birthday)
      this.gender = this.columns.find(
        (v) => v.value === requestItem.gender
      ).text
      this.leftNavTitle = '基础信息'
    }
  },
  mounted() {
    // console.log(timeFormat.timeFormat(new Date(),"yyyy-MM-dd hh:mm:ss"))
  },
  methods: {
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
      var that = this
	  console.log(type,'nishi')
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
                  title: res.message,
                  duration: 800
                })
              })

            return
          }

          businessCloudObject
            .addMember(that.studentForm)
            .then((res) => {
              if (res.success) {
				  console.log(type,'>>>>')
               if (type == 'body') {
				uni.navigateTo({
				  url: '/pages/physicalAssessment/physicalAssessment'
				})
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
  .contetnt_form_style {
    width: 100%;
    margin-top: 30upx;
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
  width: calc(100vw - 60upx);
  margin-left: 30upx;
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
</style>

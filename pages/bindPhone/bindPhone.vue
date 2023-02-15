<template>
  <view class="counter content_style">
    <BgTheamCompontent :theamType="'currency'"></BgTheamCompontent>
    <!-- 返回图标 -->
    <view class="nav_style">
      <view class="nav_left_style" @click.native="goBack">
        <image
          class="back_img_style"
          src="../../static/app-plus/mebrs/back.svg"
        ></image>
      </view>
    </view>
    <view class="botter">
      <span class="botter-top">绑定手机号</span>
      <p class="a-i-c">{{ bindMessage }}</p>
    </view>

    <view class="contetnt_form_style">
      <uni-forms :modelValue="coachForm" ref="coachForm" label-position="left">
        <uni-forms-item
          class="outer_form_item_style"
          :label="'手机号'"
          name="nickname"
        >
          <input
            :value="phone"
            type="tel"
            :maxlength="11"
            @input="phoneInput"
            class="phone change_input_style"
            focus
            placeholder="请输入手机号"
            :adjust-position="false"
          />
        </uni-forms-item>
      </uni-forms>
      <button
        class="btn"
        :class="controlActiveFlag ? 'active_btn' : ''"
        @click.native="getSms"
      >
        <span class="btn-text">获取验证码</span>
      </button>
    </view>
  </view>
</template>

<script>
import BgTheamCompontent from '../../components/bgTheamCompontent/bgTheamCompontent.vue'
export default {
  data() {
    return {
      coachForm: {
        nickname: '',
        gender: ''
      },
      phone: '',
      sexShow: false,
      scanel: null,
      bindMessage: ''
    }
  },
  components: {
    BgTheamCompontent
  },
  onLoad(options) {
    // 判断来源渠道
    this.scanel = options.scanel || null
    this.bindMessage =
      options.scanel === 'wx'
        ? '您的微信账号已验证通过,请绑定手机号码'
        : '您的苹果账号已验证通过,请绑定手机号码'
  },
  computed: {
    controlActiveFlag() {
      console.log(this.phone, '????')
      let flag = false
      if (this.phone && this.phone.length === 11) {
        flag = true
      }
      return flag
    }
  },
  methods: {
    async getSms() {
      // 发送验证码
      const login = uniCloud.importObject('login', {
        customUI: true // 取消自动展示的交互提示界面
      }) //第一步导入云对象
      if (this.controlActiveFlag) {
        try {
          const smsRes = await login.sendSmsCode(this.phone, 'bind')
          if (smsRes.code == 0) {
            console.log(this.phone, '窝时', this.scanel)
            uni.navigateTo({
              url:
                '/pages/verificatioCode/verificatioCode?' +
                'mobile=' +
                this.phone +
                '&scanel=' +
                this.scanel
            })
          }
        } catch (err) {
          //TODO handle the exception
          console.log(err, '我是错误')
        }
      }
    },
    phoneInput(event) {
      console.log(event, '你tm')
      this.phone = event.detail.value
    },
    goBack() {
      uni.navigateBack()
    },
    savePersonInfo() {
      console.log('1111')
      if (this.coachForm.nickname || this.coachForm.gender) {
        const login = uniCloud.importObject('login', {
          customUI: true // 取消自动展示的交互提示界面
        }) //第一步导入云对象
        try {
          let param = {
            ...this.coachForm
          }

          console.log(param, 'param')
          login
            .perfectInfo(param)
            .then((res) => {
              if (res.success) {
                this.jump()
              }
            })
            .catch((err) => {})
        } catch (e) {
          //TODO handle the exception
        }
      }
    }
  }
}
</script>

<style  lang="scss" scoped>
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

// 性别
::v-deep.van-field__control {
  font-size: 30upx;

  font-weight: 500;
  color: #f4f7ff;
}
// 确认按钮
.btn {
  width: calc(100vw - 60upx) !important;
  margin-left: 30upx !important;
  margin-top: 80upx !important;

  .btn-b {
    margin: auto;
    text-align: center;
    width: 670upx;
    height: 110upx;
    background: #383d46;
    border-radius: 16upx;
    line-height: 100upx;
    .btn-text {
      width: 64upx;
      height: 44upx;
      font-size: 32upx;

      font-weight: 600;
      color: #ffffff;
    }
  }
}
::v-deep.van-field__control--right {
  font-size: 30upx;

  font-weight: 400;
  color: #7a7f89;
}
::v-deep.van-field__label {
  width: 60upx;
  height: 42upx;
  font-size: 30upx;

  font-weight: 500;
  color: #f4f7ff;
  line-height: 80upx;
}
.counter {
  // position: absolute;
  // background: url('@/static/general.png') no-repeat center center;
  // background-size: 100% 100%;
  width: 100vw;
  height: 100vh;

  .app-esc {
    margin-top: 80upx;
    margin-left: 30upx;
    color: #a8adb6;
  }

  .botter {
    margin-top: 40upx;
    .botter-top {
      margin-left: 40upx;
      // width: 288upx;
      height: 66upx;
      font-size: 48upx;

      font-weight: 600;
      color: #f4f7ff;
      line-height: 66upx;
    }
    .a-i-c {
      margin-left: 40upx;
      margin-top: 20upx;
      // width: 390upx;
      height: 42upx;
      font-size: 30upx;
      font-weight: 400;
      color: #a8adb6;
      line-height: 42upx;
    }
  }
  .input {
    margin-top: 40upx;
    .input-name {
      margin: auto;
      text-align: center;
      width: 670upx;
      height: 110upx;
      background: #383d46;
      border-radius: 16upx;
      line-height: 80upx;
      font-size: 30upx;
      font-weight: 400;
      color: #7a7f89;
    }
  }
  .options {
    margin-top: 40upx;
    .options-sex {
      margin: auto;
      text-align: center;
      width: 670upx;
      height: 110upx;
      background: #383d46;
      border-radius: 16upx;
      line-height: 80upx;
      font-size: 30upx;
      font-weight: 400;
      color: #7a7f89;
    }
  }
}

.nav_style {
  width: calc(100vw - 60upx);
  margin-left: 30upx;
  height: 80upx;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 80upx;
}
.nav_left_style {
  width: 40upx;
  height: 40upx;
  .back_img_style {
    width: 100%;
    height: 100%;
  }
}
.nav_text {
  font-size: 30upx;
  font-weight: 500;
  color: #bdc3ce;
}

::v-deep .uni-forms {
  width: calc(100vw - 60upx);
  margin-left: 30upx;

  uni-form {
    span {
      .uni-forms-item {
        width: 100%;
        height: 216upx;
        padding: 30upx;
        box-sizing: border-box;
        display: block;
        background: rgba(75, 82, 94, 0.5) !important;
        border-radius: 16upx;

        .uni-forms-item__label {
          width: 100% !important;
          margin-bottom: 46upx;
          uni-text {
            width: 100% !important;
            width: 100% !important;
            font-size: 30upx;
            height: 44upx;
            font-weight: 400;
            color: #f4f7ff;
            span {
              display: inline-block;
              width: 100% !important;
              font-size: 30upx;
              height: 44upx;
              font-weight: 400;
              color: #f4f7ff;
            }
          }
        }

        .uni-forms-item__content {
          .uni-easyinput {
            font-size: 32upx;
            font-weight: 600;
            color: #f4f7ff !important;
            .uni-easyinput__content {
              border-color: transparent !important;
              background-color: transparent !important;
            }
          }
          .uni-input-input {
            font-size: 32upx;
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
        font-weight: 600;
        color: #7a7f89;
      }
      .uni-picker-action-confirm {
        padding-right: 40upx;
        // padding-top: 40upx;
        font-size: 32upx;
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
  margin-top: 10upx;
  // height: 80upx;
  align-items: center;
  justify-content: space-between;
  .label_style {
    font-size: 32upx;
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
  font-weight: 400 !important;
  color: #7a7f89 !important;
}
.edit_save_style {
  width: calc(100vw - 80upx);
  margin-left: 40upx;
  background: #454951;
  border-radius: 16upx;
  margin-top: 30upx;
  margin-bottom: 30upx;
  font-size: 32upx;
  font-weight: 600;
  color: #ffffff;
  line-height: 100upx;
  text-align: center;
  justify-content: center;
}
.active {
  background: #1370ff;
}
::v-deep.uni-input-placeholder {
  font-size: 32upx !important;
  font-weight: 400 !important;
  color: #7a7f89 !important;
}
// 按钮
.btn {
  margin-top: 20upx;
  width: calc(100vw - 140upx);
  margin-left: 70upx;
  height: 100upx;
  background: #454951;
  border-radius: 16upx;
  cursor: not-allowed;
  .btn-text {
    height: 44upx;
    font-size: 32upx;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: 600;
    color: #f4f7ff;
    line-height: 100upx;
  }
}
.active_btn {
  background: #1370ff;
}
</style>

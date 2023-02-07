<template>
  <view class="counter">
    <!-- 返回 -->
    <van-icon
      name="arrow-left"
      size="50upx"
      @click.native="goBack"
      class="app-esc"
    />

    <view class="counter-matter">
      <h1 class="code">请输入验证码</h1>
      <span class="phone">验证码已发送至 {{ mobile }}</span>
      <!-- 明文展示验证码 -->
      <view class="main">
        <verification-code-style2
          :latticeNum="4"
          ref="verificationCodeStyle2"
          @inputVerificationChange="inputVerificationChange"
        ></verification-code-style2>
      </view>
      <!-- 登录 -->
      <button class="btn" :class="sureLogin ? 'active' : ''" @click="smsLogin">
        <span class="btn-text">登录</span>
      </button>
      <view class="time" :class="isFinsh ? 'timeActive' : ''" @click="resend">
        重新发送<view class="kuo_hao_style" v-if="!isFinsh"
          >(
          <uni-countdown
            :show-day="false"
            :color="isFinsh ? '#1370ff' : '#a8adb6'"
            :showColon="true"
            :hour="0"
            :minute="0"
            :second="timeupSecond"
            @timeup="timeup"
          />
          <text>s</text>）
        </view>
      </view>
    </view>
  </view>
</template>

<script>
const login = uniCloud.importObject('login', {
  customUI: true // 取消自动展示的交互提示界面
})
export default {
  data() {
    return {
      smsCode: '',
      errorInfoValue: '',
      showKeyboard: false,
      timeupSecond: 60,
      mobile: '',
      requestVerifyCode: '',
      sureLogin: false,
      isFinsh: false,
      scanel: null
    }
  },
  onLoad(options) {
    this.mobile = options.mobile || ''
    // 校验验证码
    // 判断来源渠道
    this.scanel = options.scanel || null
  },
  async mounted() {
    this.verifyCode()
  },

  watch: {
    smsCode: function (n, o) {
      // console.log(n,'????')
      if (n.length === 4 && n !== this.requestVerifyCode) {
        this.errorInfoValue = '验证码错误'
        this.sureLogin = false
      } else {
        this.errorInfoValue = ''
        this.sureLogin = false
      }
      if (n.length === 4 && n === this.requestVerifyCode) {
        this.sureLogin = true
      }
    }
  },
  methods: {
    timeup() {
      this.isFinsh = true
    },
    getVal() {
      const val = this.$refs.verificationCodeStyle2.getValue()
      uni.showModal({
        content: '获取到值：' + val,
        showCancel: false
      })
    },
    clearVal() {
      this.$refs.verificationCodeStyle2.cleanVal()
    },
    setVal() {
      this.$refs.verificationCodeStyle2.setVerificationCode('888')
    },
    inputVerificationChange(val) {
      this.smsCode = val
      console.log('值改变了：' + val)
    },
    async resend() {
      if (this.isFinsh) {
        const login = uniCloud.importObject('login') //第一步导入云对象
        try {
          const smsRes = await login.sendSmsCode(this.mobile)
          console.log(smsRes, '发送成功')
          if (smsRes.code == 0) {
            this.mobile = smsRes.mobile
            this.verifyCode()
            this.$refs.countDown.reset() //重置
          }
        } catch (err) {
          //TODO handle the exception
          console.log(err, '我是错误')
        }
      }
    },
    onFinsh() {
      this.isFinsh = true
    },
    async verifyCode() {
      let login = uniCloud.importObject('login', {
        customUI: true // 取消自动展示的交互提示界面
      })
      const getVerifyRes = await login.getVerifySchema()
      // console.log(getVerifyRes,'?????我是验证码')
      try {
        this.requestVerifyCode =
          getVerifyRes.length > 0 ? getVerifyRes[0].code : '0000'
      } catch (err) {}
    },
    // 上方退出标识
    async smsLogin() {
      let self = this
      try {
        if (this.scanel === 'wx') {
          uni.getStorage({
            key: 'weixinLoginInfo',
            success: async function (res) {
              if (res.data) {
                // 获取用户信息
                console.log(res.data, '我是你爸爸')

                let getWeixinRes = await login.getWeixinUserInfo(
                  JSON.parse(res.data)
                )
                if (getWeixinRes.code == 0) {
                  let param = {
                    avatar: getWeixinRes.avatar,
                    nickname: getWeixinRes.nickname,
                    mobile: self.mobile
                  }
                  console.log(param, 'param')
                  login
                    .perfectInfo(param)
                    .then((res) => {
                      if (res.success) {
                      }
                    })
                    .catch((err) => {})
                }
              }
            },
            fail: function (err) {
              console.log(err, '>>>>')
            }
          })

          uni.reLaunch({
            url: '/pages/myMebers/myMebers'
          })
          return
        }

        // 先验证该手机号是否登录过
        let userLogin = uniCloud.importObject('login', {
          customUI: true // 取消自动展示的交互提示界面
        })
        const getUseRes = await userLogin.getUserSchema(this.mobile)

        uni.setStorageSync('loginNum', getUseRes.affectedDocs + '')
        if (getUseRes.affectedDocs == 0) {
          await this.smsCodeLoginValid('first')
          uni.navigateTo({
            url: '/pages/personalnformation/personalnformation'
          })
        } else {
          await this.smsCodeLoginValid()
          uni.reLaunch({
            url: '/pages/myMebers/myMebers'
          })
        }
      } catch (err) {
        //TODO handle the exception
        console.log(err, '我是错误')
      }
    },
    // 验证码登录
    async smsCodeLoginValid(type = null) {
      let param = {
        mobile: this.mobile,
        code: this.requestVerifyCode
      }
      const vefiryLogin = uniCloud.importObject('login', {
        customUI: true // 取消自动展示的交互提示界面
      }) //第一步导入云对象
      const loginRes = await vefiryLogin.loginBySms(param)
      console.log(loginRes, '发送成功')

      if (loginRes.code == 0) {
        if (type === 'first') {
          // 首次登录,设置默认头像
          try {
            let param = {
              avatar:
                'https://mp-4e6f1c48-a4dc-4897-a866-0a1a071023c3.cdn.bspapp.com/cloudstorage/65a7d49a-7fb3-4c1a-9bea-9d5e6b074fad.png'
            }

            console.log(param, 'param')
            vefiryLogin
              .perfectInfo(param)
              .then((res) => {
                if (res.success) {
                }
              })
              .catch((err) => {})
          } catch (e) {
            //TODO handle the exception
          }
        }
        try {
          uni.setStorageSync('userInfo', JSON.stringify(loginRes.userInfo)) //个人信息
          uni.setStorageSync('uni_id_token', loginRes.token) //token
          uni.setStorageSync('uid', loginRes.uid) // uid 唯一标识
          uni.setStorageSync('tokenExpired', loginRes.tokenExpired) // 有效期
        } catch (e) {
          // error
        }
      }
    },

    goBack() {
      uni.reLaunch({
        url: '/pages/logining/logining'
      })
    }
  }
}
</script>

<style lang="scss" scoped >
.counter {
  position: absolute;
  background: url('@/static/general.png') no-repeat center center;
  background-size: 100% 100%;
  width: 100vw;
  height: 100vh;
  // 验证码框颜色
  ::v-deep.van-password-input__security li {
    background: #383d46;
  }
  // 验证码字体
  ::v-deep.van-password-input__security li {
    font-size: 48upx;
    font-family: SFPro-Semibold, SFPro;
    font-weight: 600;
    color: #f4f7ff;
    line-height: 58upx;
  }
  // 键盘背景色
  .van-number-keyboard {
    background-color: #272729 80%;
  }
  .app-esc {
    margin-top: 80upx;
    margin-left: 30upx;
    color: #a8adb6;
  }
  .counter-matter {
    .code {
      margin-left: 60upx;
      margin-top: 226upx;
      width: 288upx;
      height: 66upx;
      font-size: 48upx;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
      color: #f4f7ff;
      line-height: 66upx;
    }
    .phone {
      margin-left: 60upx;
      margin-top: 16upx;
      width: 418upx;
      height: 42upx;
      font-size: 30upx;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #a8adb6;
    }
    .a-i-c {
      margin-top: 64upx;
    }
    .btn {
      margin-top: 80upx;
      width: 630upx;
      height: 100upx;
      background: #454951;
      border-radius: 16upx;
      .btn-text {
        width: 64upx;
        height: 44upx;
        font-size: 32upx;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        color: #ffffff;
        line-height: 44upx;
        // #ifdef APP-PLUS
        line-height: 100upx;
        // #endif
      }
    }
    .active {
      background: #1370ff;
    }
  }
  .time {
    margin-top: 40upx;
    text-align: center;
    font-size: 30upx;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #a8adb6;
    line-height: 42upx;
    display: flex;
    justify-content: center;
    .kuo_hao_style {
      width: auto;
      display: flex;
      align-items: center;
    }
  }
  .timeActive {
    color: #1370ff;
  }
}
::v-deep.van-count-down {
  color: #a8adb6;
}
.countActive {
  color: #1370ff;
}
.main {
  width: 100%;
  margin-top: 64upx;
}
::v-deep.uni-countdown {
  uni-text:nth-child(1) {
    display: none;
  }
  uni-text:nth-child(2) {
    display: none;
  }
  uni-text:nth-child(3) {
    display: none;
  }
  uni-text:nth-child(4) {
    display: none;
  }
}
</style>

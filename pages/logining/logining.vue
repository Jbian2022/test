<template>
  <view class="counter">
    <view class="text">
      <!-- <view class="text1"></view> -->
      <image class="text1" src="@/static/app-plus/other/coach.png"></image>
    </view>
    <view class="middle">
      <view
        class="wx_icon_login_style"
        @click.native="loginByWeixin"
        v-if="isInstallwx"
      >
        <image
          class="icon_img_style"
          src="https://mp-4e6f1c48-a4dc-4897-a866-0a1a071023c3.cdn.bspapp.com/cloudstorage/10fd0194-0323-410d-be1c-a6df7dab702d.svg"
        ></image>
        <view class="icon_remark_style">微信快捷登录</view>
      </view>
      <view
        class="apple_icon_login_style wx_icon_login_style"
        @click.native="loginByApple"
        v-if="platform === 'ios'"
      >
        <image
          class="icon_img_style apple_img_style"
          src="../../static/login/apple.svg"
        ></image>
        <view class="icon_remark_style">Apple账号登录</view>
      </view>

      <view class="ying_si_style">
        <view class="check_style" @click="checkFlag = !checkFlag">
          <image
            class="check_img_style"
            src="../../static/login/check.svg"
            v-if="checkFlag"
          ></image>
          <image
            class="check_img_style"
            src="../../static/login/nocheck.svg"
            v-if="!checkFlag"
          ></image>
        </view>
        <view class="ying_si_remark_dakuang_style">
          <text class="ying_si_remark">同意</text>
          <text class="ying_si_remark_middle" @click.native.stop="jumpAgree">
            <text class="ying_si_jump_style">《用户隐私协议》</text>

            <!-- <text class="ying_si_jump_style">《用户协议》</text> -->
          </text>
          <text class="ying_si_remark">政策并使用本机号码登录</text>
        </view>

        <view class="botter_dakuang_style" v-if="needChecked">
          <view class="botter">
            <view class="botter-top">
              <h1 class="botter-top1">欢迎使用本产品！</h1>
              <h2 class="botter-top2">welcome</h2>
              <p class="botter-top3">
                为了更好的保障您的合法权益，在使用本应用之前，请您仔细阅读<text
                  style="color: #1370ff"
                  @click.native.stop="jumpAgree"
                  >《用户隐私协议》</text
                >，点击同意即表示您已阅读并同意接受我们的服务，感谢您的信任！
              </p>
              <button class="botter-top4" @click="agreeContiute">
                <span class="botter-top4-text">同意并继续</span>
              </button>
              <view class="botter-top5-text" @click.native="needChecked = false"
                >不同意</view
              >
            </view>
          </view>
        </view>
      </view>

      <view class="wx_loging_style">
        <image
          @click.native="getSms"
          class="wx_img_style"
          :class="platform === 'ios' ? 'common_style' : ''"
          src="../../static/login/phonelogin.svg"
        ></image>
        <!-- <image
          @click.native="loginByApple"
          v-if="platform === 'ios'"
          class="wx_img_style"
          src="../../static/login/ioslogin.svg"
        ></image> -->
      </view>
    </view>
  </view>
</template>

<script>
let weixinAuthService
let appleAuthService
export default {
  data() {
    return {
      phone: '',
      checkFlag: false,
      hasWeixinAuth: false,
      checkPhone: '',
      needChecked: false,
      platform: uni.getSystemInfoSync().platform,
      agreementType: null,
      hasAppleAuth: false,
      isInstallwx: true
    }
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
  onLoad() {
    // #ifdef APP-PLUS
    console.log(plus, '>>>>')

    plus.oauth.getServices((services) => {
      weixinAuthService = services.find((service) => {
        return service.id === 'weixin'
      })
      if (weixinAuthService) {
        this.hasWeixinAuth = true
      }
    })
    uni.getProvider({
      service: 'oauth',
      success: (result) => {
        if (result.provider.indexOf('apple') !== -1) {
          this.haAuth = true
        }
      },
      fail: (error) => {
        console.log('获取登录通道失败', error)
      }
    })

    // #endif
  },
  onShow() {
    // #ifdef APP-PLUS

    console.log(
      plus.runtime.isApplicationExist({
        pname: 'bodybuildingApp.myapp',
        action: 'weixin://'
      }),
      '安装微信'
    )
    if (
      plus.runtime.isApplicationExist({
        pname: 'bodybuildingApp.myapp',
        action: 'weixin://'
      })
    ) {
      this.isInstallwx = true
    } else {
      this.isInstallwx = false
      return
    }
    // #endif
  },
  mounted() {
    let platform = uni.getSystemInfoSync().platform
    // console.log(platform, '????')
    // #ifdef APP-PLUS
    console.log(
      plus.runtime.isApplicationExist({
        pname: 'bodybuildingApp.myapp',
        action: 'weixin://'
      }),
      '安装微信'
    )
    if (
      plus.runtime.isApplicationExist({
        pname: 'bodybuildingApp.myapp',
        action: 'weixin://'
      })
    ) {
      this.isInstallwx = true
    } else {
      this.isInstallwx = false
      return
    }
    // #endif
  },

  methods: {
    jumpAgree() {
      console.log('11111')
      uni.navigateTo({
        url: '/pages/agreement/agreement'
      })
    },
    phoneInput(event) {
      console.log(event, '你tm')
      this.phone = event.detail.value
    },

    async getSms() {
      this.agreementType = 'sms'
      if (!this.checkFlag) {
        // Toast('请同意隐私政策')
        this.needChecked = true
        return
      }
      uni.navigateTo({
        url: '/pages/phoneLoging/phoneLoging',
        fail(error) {
          console.log(error)
        }
      })
    },
    agreeContiute() {
      this.checkFlag = true
      this.needChecked = false
      switch (this.agreementType) {
        case 'sms':
          this.getSms()
          break
        case 'wx':
          this.wxLoginCommon()

          break
        case 'apple':
          this.appleLoginCommon()
          break
      }
    },
    getWeixinCode() {
      return new Promise((resolve, reject) => {
        // #ifdef APP-PLUS

        weixinAuthService.authorize(
          function (res) {
            resolve(res.code)
          },
          function (err) {
            console.log(err)
            reject(new Error('微信登录失败'))
          }
        )
        // #endif
      })
    },
    appleLoginCommon() {
      uni.login({
        provider: 'apple', //使用苹果登录
        success: async (loginRes) => {
          const appleLogin = uniCloud.importObject('login', {
            customUI: true // 取消自动展示的交互提示界面
          })
          let userInfo = uni.getUserInfo()
          console.log(userInfo, '你是快乐萨的看法')
          // 先校验苹果identify
          let identityToken = loginRes.appleInfo.identityToken
          console.log(loginRes, '什么鬼')
          try {
            let verifyAppleIdentityTokenRes =
              await appleLogin.verifyAppleIdentityToken(identityToken)
            console.log(
              verifyAppleIdentityTokenRes,
              'verifyAppleIdentityTokenRes'
            )
            if (verifyAppleIdentityTokenRes.code == 0) {
              // uni-id 苹果登录
              let getLogingByAppleRes = await appleLogin.logingByApple(
                loginRes.appleInfo.identityToken
              )
              console.log(getLogingByAppleRes, '苹果登陆了')
              if (getLogingByAppleRes.code == 0) {
                try {
                  uni.setStorageSync(
                    'userInfo',
                    JSON.stringify(getLogingByAppleRes.userInfo)
                  ) //个人信息
                  uni.setStorageSync('uni_id_token', getLogingByAppleRes.token) //token
                  uni.setStorageSync('uid', getLogingByAppleRes.uid) // uid 唯一标识
                  uni.setStorageSync(
                    'tokenExpired',
                    getLogingByAppleRes.tokenExpired
                  ) // 有效期
                  // 存储Apple登录信息
                  // 绑定手机号码
                  if (getLogingByAppleRes.type === 'login') {
                    uni.setStorageSync('loginNum', '1')
                    uni.reLaunch({
                      url: '/pages/myMebers/myMebers'
                    })
                    return
                  }

                  if (getLogingByAppleRes.type === 'register') {
                    uni.setStorageSync('loginNum', '0')
                    uni.navigateTo({
                      url: '/pages/personalnformation/personalnformation'
                    })
                    return
                  }

                  // let appleSchemaRes = await appleLogin.getAppleSchema(
                  //   getLogingByAppleRes.userInfo.apple_openid
                  // )
                  // console.log(appleSchemaRes, '我是苹果登录的前一步')
                  // if (appleSchemaRes.affectedDocs === 0) {
                  //   // 用户未登录
                  //   uni.setStorageSync('loginNum', '0')
                  //   uni.navigateTo({
                  //     url: '/pages/personalnformation/personalnformation'
                  //   })
                  // } else {
                  //   // 用户已登录
                  //   uni.setStorageSync('loginNum', '1')
                  //   uni.reLaunch({
                  //     url: '/pages/myMebers/myMebers'
                  //   })
                  // }

                  // let flag = false
                  // if (appleSchemaRes.affectedDocs === 0) {
                  //   flag = false
                  // }
                  // flag = appleSchemaRes.data[0].hasOwnProperty('mobile')
                  //   ? true
                  //   : false
                  // if (flag) {
                  //   // 用户绑定了
                  //   // 已经登录过了
                  //   uni.setStorageSync('loginNum', '1')
                  //   uni.reLaunch({
                  //     url: '/pages/myMebers/myMebers'
                  //   })
                  // } else {
                  //   // 用户未绑定
                  //   // 首次登录
                  //   uni.setStorageSync('loginNum', '0')
                  //   uni.navigateTo({
                  //     url: '/pages/bindPhone/bindPhone?' + 'scanel=' + 'apple'
                  //   })

                  //   return
                  // }
                } catch (e) {
                  console.log(e, '>>>>>')

                  return
                }
              }
            }
          } catch (err) {
            console.log(err, '222', err.Error, err, JSON.stringify(err))
            uni.showToast({
              title: err.errMsg || err.message,
              duration: 1000,
              width: 180,
              icon: 'none'
            })
          }
        },
        fail: function (loginErr) {
          uni.showModal({
            showCancel: false,
            content: '苹果登录失败，请稍后再试'
          })
        }
      })
    },
    loginByApple() {
      this.agreementType = 'apple'
      if (!this.checkFlag) {
        // Toast('请同意隐私政策')
        this.needChecked = true
        return
      }
      if (!this.haAuth) return
      this.appleLoginCommon()
    },

    loginByWeixin() {
      this.agreementType = 'wx'
      if (!this.checkFlag) {
        // Toast('请同意隐私政策')
        this.needChecked = true
      } else {
        this.wxLoginCommon()
      }
    },
    wxLoginCommon() {
      this.getWeixinCode().then(async (code) => {
        console.log(code, '你是谁')
        const wxLogin = uniCloud.importObject('login', {
          customUI: true // 取消自动展示的交互提示界面
        })
        console.log(wxLogin, 'wxLogin')

        try {
          const wxLoginRes = await wxLogin.loginByWeixin(code)
          console.log(wxLoginRes, '登录成功')
          if (wxLoginRes.code == 0) {
            try {
              uni.setStorageSync(
                'userInfo',
                JSON.stringify(wxLoginRes.userInfo)
              ) //个人信息
              uni.setStorageSync('uni_id_token', wxLoginRes.token) //token
              uni.setStorageSync('uid', wxLoginRes.uid) // uid 唯一标识
              uni.setStorageSync('tokenExpired', wxLoginRes.tokenExpired) // 有效期
              // 存储微信登录信息
              let weixinLoginInfo = {
                accessToken: wxLoginRes.accessToken,
                openid: wxLoginRes.openid
              }
              // 绑定手机号码
              console.log(wxLoginRes.unionid, '我是wxLoginRes.unionid')
              let wxSchemaRes = await wxLogin.getWxSchema(wxLoginRes.unionid)
              console.log(wxSchemaRes, '我是微信的前一步')
              let flag = false
              if (wxSchemaRes.affectedDocs === 0) {
                flag = false
              }
              flag = wxSchemaRes.data[0].hasOwnProperty('mobile') ? true : false
              if (flag) {
                // 用户绑定了
                // 已经登录过了
                uni.setStorageSync('loginNum', '1')
                uni.reLaunch({
                  url: '/pages/myMebers/myMebers'
                })
                return
              } else {
                // 用户未绑定
                // 首次登录
                uni.setStorageSync('loginNum', '0')
                uni.setStorageSync(
                  'weixinLoginInfo',
                  JSON.stringify(weixinLoginInfo)
                ) //
                uni.navigateTo({
                  url: '/pages/bindPhone/bindPhone?' + 'scanel=' + 'wx'
                })

                return
              }
            } catch (e) {
              // error
            }
          }
        } catch (err) {
          // console.log(err, '222', err.Error, err, JSON.stringify(err))
          uni.showToast({
            title: err.errMsg || err.message,
            duration: 1000,
            width: 180,
            icon: 'none'
          })
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.counter {
  position: absolute;
  background: url('@/static/backgroundImage.png');
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  width: 100vw;
  height: 100vh;
  .text {
    padding-top: 404upx;
    padding-left: 70upx;
    .text1 {
      width: 556upx;
      height: 370upx;
      font-size: 100upx;
      font-family: HarmonyOS_Sans_SC_Black;
      color: #ffffff;
      line-height: 140upx;
      font-weight: 600;
      object-fit: cover;
    }
    .text2 {
      margin-top: 10upx;
      width: 390upx;
      height: 42upx;
      font-size: 30upx;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #a8adb6;
      line-height: 42upx;
    }
  }
  .middle {
    margin-top: 25upx;
    height: 300upx;
    .phone {
      margin: 0 auto;
      width: calc(100vw - 140upx);
      margin-left: 70upx;
      height: 100upx;
      display: inline-block;
      // line-height: 100upx;
      background-color: rgba(244, 247, 255, 0.15);
      border-radius: 16upx;
      ::v-deep .uni-input-wrapper {
        .uni-input-placeholder {
          left: 40upx;
          color: #bdc3ce;
        }
      }
      ::v-deep .uni-input-input {
        box-sizing: border-box;
        padding-left: 40upx;
        font-size: 32upx;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        color: #f4f7ff;
      }
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
    .ying_si_style {
      width: calc(100vw - 140upx);
      margin-left: 70upx;
      margin-top: 30upx;
      display: flex;
      align-items: center;
      .check_style {
        width: 28upx;
        height: 30upx;
        padding-right: 20upx;
        .check_img_style {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
      }
      .ying_si_remark_dakuang_style {
        flex: 1;
        pardding-left: 20upx;

        font-size: 26upx;
        // font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #bdc3ce;

        // .ying_si_remark {

        // }
        .ying_si_remark_middle {
          color: #f4f7ff;
        }
      }
    }
  }
  .wx_loging_style {
    width: calc(100vw - 140upx);
    margin-left: 70upx;
    display: flex;
    justify-content: center;
    align-items: center;
    .wx_img_style {
      margin-top: 116upx;
      width: 100upx;
      height: 100upx;
      object-fit: contain;
    }
    // .common_style:nth-child(1) {
    //   margin-right: 100upx;
    // }
  }
}

// 盒子
.botter_dakuang_style {
  position: absolute;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(75, 82, 94, 0.2);
  z-index: 10000;

  .botter {
    display: flex;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: calc(100vw - 140upx);
    height: 752upx;
    background: #ffffff;
    border-radius: 24upx;

    .botter-top {
      width: calc(100% - 120upx);
      padding-top: 66upx;
      margin-left: 60upx;

      .botter-top5-text {
        text-align: center;
        font-size: 28upx;
        margin-top: 30upx;
        font-weight: 400;
        color: #a8adb6;
      }

      .botter-top4 {
        margin-top: 70upx;
        // width: calc(100% - 120upx);
        height: 100upx;
        background: #1370ff;
        border-radius: 16upx;
        .botter-top4-text {
          width: 160upx;
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
      .botter-top3 {
        width: 490upx;
        height: 240upx;
        font-size: 30upx;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #6e7073;
        line-height: 48upx;
      }
      .botter-top2 {
        width: 168upx;
        height: 46upx;
        font-size: 32upx;
        font-family: HarmonyOS_Sans_SC_Black;
        color: #1370ff;
        line-height: 46upx;
      }
      .botter-top1 {
        width: 416upx;
        height: 72upx;
        font-size: 52upx;
        font-family: HarmonyOS_Sans_SC_Bold;
        color: #323438;
        line-height: 72upx;
      }
    }
  }
}
.wx_icon_login_style {
  margin-top: 20upx;
  width: calc(100vw - 140upx);
  margin-left: 70upx;
  height: 100upx;
  background: #179d52;
  border-radius: 16upx;
  cursor: not-allowed;
  display: flex;
  align-items: center;
  justify-content: center;

  .icon_img_style {
    width: 50upx;
    height: 50upx;
    object-fit: cover;
  }
  .icon_remark_style {
    font-size: 32upx;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: 600;
    color: #f4f7ff;
    margin-left: 20upx;
  }
}
.apple_icon_login_style {
  background: #383d46 !important;
  .apple_img_style {
    width: 42upx !important;
    height: 42upx !important;
    object-fit: cover;
  }
}

// 勾选

::v-deep .van-field__control {
  font-size: 32upx !important;
  font-family: PingFangSC-Semibold, PingFang SC;
  font-weight: 600;
  color: #f4f7ff;
}
::v-deep .van-field__control::placeholder {
  font-size: 32upx;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #bdc3ce;
}

::v-deep .van-cell::after {
  border-bottom-width: 0 !important;
  border-top-width: 0 !important;
  border: none;
}
</style>

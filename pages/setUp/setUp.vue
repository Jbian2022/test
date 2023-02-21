<template>
  <view class="set-up">
    <view class="status_bar">
      <!-- 这里是状态栏 -->
    </view>
    <view class="background-header"></view>
    <view class="background"></view>
    <view class="arrow-left" @click="onClickLeft"
      ><van-icon name="arrow-left"
    /></view>
    <view class="title">设置</view>
    <view class="form">
      <van-cell title="注销账号" is-link @click="closeAccount" />
      <van-cell title="用户隐私协议" is-link @click.native.stop="jumpAgree" />
      <van-cell
        :value="isBindValue"
        is-link
        @click.native.stop="wxBind"
        v-if="wechatDisplay"
      >
        <!-- 使用 title 插槽来自定义标题 -->
        <template #title>
          <view class="left_wx_style">
            <van-image
              class="wx_img_style"
              src="https://mp-4e6f1c48-a4dc-4897-a866-0a1a071023c3.cdn.bspapp.com/cloudstorage/10fd0194-0323-410d-be1c-a6df7dab702d.svg"
            />
            <span class="weixin_title_style">微信</span>
          </view>
        </template>
      </van-cell>
      <!-- <van-cell
        :value="isAppleBindValue"
        is-link
        @click.native.stop="appleBind"
      >
        <template #title>
          <view class="left_wx_style">
            <van-image
              class="wx_img_style apple_img_style"
              src="https://mp-4e6f1c48-a4dc-4897-a866-0a1a071023c3.cdn.bspapp.com/cloudstorage/c6ded5a6-1d29-40fa-a4c7-7c26ad6d13ec.svg"
            />
            <span class="weixin_title_style">苹果</span>
          </view>
        </template>
      </van-cell> -->
      <uni-popup
        ref="popup"
        type="center"
        mask-background-color="rgba(20, 21, 23, 0.6)"
      >
        <view class="dialog">
          <view class="dialog-section">
            <view class="dialog-title">确认解绑</view>
            <view class="dialog-content">确定要解除账号与微信的关联吗？</view>
            <view class="dialog-btn-box">
              <van-button type="default" @click.native="closeHandle"
                >取消</van-button
              >
              <van-button type="primary" @click.native="sure"
                >解除绑定</van-button
              >
            </view>
          </view>
        </view>
      </uni-popup>
    </view>
    <van-button class="footer-btn" block @click.native="logout"
      >退出登录</van-button
    >
  </view>
</template>

<script>
const login = uniCloud.importObject('login', {
  customUI: true // 取消自动展示的交互提示界面
})
let weixinAuthService
export default {
  data() {
    return {
      isBindValue: '',
      isAppleBindValue: '',
      checkFlag: false,
      wechatDisplay: true
    }
  },
  onLoad() {
    // #ifdef APP-PLUS
    // console.log(plus, '>>>>')

    plus.oauth.getServices((services) => {
      weixinAuthService = services.find((service) => {
        return service.id === 'weixin'
      })
      if (weixinAuthService) {
        this.hasWeixinAuth = true
      }
    })
    // #endif
  },
  onShow() {
    this.getUserMessage()
  },
  methods: {
    appleBind() {},
    getWeixinCode() {
      return new Promise((resolve, reject) => {
        // #ifdef APP-PLUS

        weixinAuthService.authorize(
          function (res) {
            resolve(res.code)
          },
          function (err) {
            // console.log(err)
            reject(new Error('微信登录失败'))
          }
        )
        // #endif
      })
    },
    async getUserMessage() {
      let self = this
      // 用手机号请求用户信息
      let needUserRes = await login.needUserMessage()
      console.log(needUserRes, ' ....')
      let needPanduan = needUserRes.data
      if (needPanduan[0].hasOwnProperty('apple_openid')) {
        self.wechatDisplay = false
      }
      if (needPanduan.length > 0) {
        if (needPanduan.length > 0) {
          console.log(3)
          console.log(needPanduan, 'needPanduan那棵树的克拉付款了')
          if (needPanduan[0].hasOwnProperty('wx_openid')) {
            // 微信已授权
            self.isBindValue = '已绑定'
          } else {
            // 微信未授权
            self.isBindValue = '未绑定'
          }
        }
      }
    },
    closeHandle() {
      this.$refs.popup.close()
    },
    async sure() {
      // 解绑操作
      let unbindRes = await login.unbindWeixin()
      if (unbindRes.code == 0) {
        this.$refs.popup.close()
        this.getUserMessage()

        console.log('解绑成功')
      }
    },
    async wxBind() {
      let that = this
      if (that.isBindValue === '已绑定') {
        // 绑定做解绑的事情
        that.$refs.popup.open()
      }
      if (that.isBindValue === '未绑定') {
        // w未绑定做绑定的事情
        that.getWeixinCode().then(async (code) => {
          console.log(code, '我是微信服务商')
          let bindRes = await login.bindWeixin(code)
          if (bindRes.code === 0) {
            console.log('绑定成功')
            that.getUserMessage()
          }
        })
      }
    },
    jumpAgree() {
      uni.navigateTo({
        url: '/pages/agreement/agreement'
      })
    },
    onClickLeft() {
      uni.switchTab({
        url: '/pages/my/my'
      })
    },
    async closeAccount() {
      uni.reLaunch({
        url: '/pages/cancel/cancel'
      })
    },
    async logout() {
      console.log('开始点了')
      let currentUserInfo = uniCloud.getCurrentUserInfo()
      console.log(currentUserInfo, 'currentUserInfo')
      if (currentUserInfo.tokenExpired > 0) {
        await login.logout()
        await this.remove()
        return
      }
      if (currentUserInfo.tokenExpired === 0) {
        await this.remove()
      }
    },
    remove() {
      uni.clearStorage()
      uni.reLaunch({
        url: '/pages/logining/logining'
      })
    }
  }
}
</script>

<style lang="scss">
.status_bar {
  height: var(--status-bar-height);
  width: 100%;
}
.background-header {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: -1;
  height: 460upx;
  background: linear-gradient(to bottom, rgba(52, 58, 68, 1), #212328);
}
.background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: -2;
  height: 100vh;
  background: #212328;
}
.set-up {
  position: relative;
  .arrow-left {
    height: 88upx;
    display: flex;
    align-items: center;
    padding-left: 30upx;
    .van-icon {
      font-size: 40upx;
      color: #bdc3ce;
    }
  }
  .title {
    padding: 40upx;
    font-size: 48upx;
    font-weight: 600;
    color: #ffffff;
    line-height: 66upx;
  }
  .form {
    padding: 0 40upx;
    .van-cell {
      height: 122upx;
      background: rgb(56, 61, 70, 0.5);
      border-radius: 24upx;
      font-size: 30upx;
      font-weight: 400;
      color: #bdc3ce;
      align-items: center;
      padding: 0 30upx;
      &::after {
        display: none;
      }
      & + .van-cell {
        margin-top: 30upx;
      }
    }
  }
  .footer-btn {
    position: fixed;
    bottom: 88upx;
    left: 0;
    right: 0;
    background: transparent;
    border: none;
    font-size: 30upx;
    font-weight: 600;
    color: #bdc3ce;
  }
}
.left_wx_style {
  height: 100%;
  display: flex;
  align-content: center;
  .wx_img_style {
    width: 51upx;
    height: 41upx;
    margin-right: 20upx;
  }
  .apple_img_style {
    width: 55upx !important;
    height: 41upx;
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
</style>

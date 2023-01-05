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
    </view>
    <van-button class="footer-btn" block @click="logout">退出登录</van-button>
  </view>
</template>

<script>
const login = uniCloud.importObject('login')
export default {
  data() {
    return {}
  },
  methods: {
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
      await login.logout();
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
</style>

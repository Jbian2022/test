<template>
  <view class="my">
    <view class="background"></view>
    <view class="status_bar">
      <!-- 这里是状态栏 -->
    </view>
    <view class="header">
      <view class="logo" @click="personalInfo">
        <van-image round :src="userInfo.avatar" />
        <view class="edit-icon"></view>
      </view>
      <view class="user-name">
        <view class="name" :class="{ ordinary: userInfo.vipLevel === 2 }">{{
          userInfo.username
        }}</view>
        <view class="des">{{ userInfo.comment }}</view>
      </view>
      <view class="config" @click="setUp"></view>
    </view>
    <view v-if="userInfo.vipLevel === 2" class="vip-info" @click="openCard">
      <view class="left">
        <view class="vip-grade">
          <view class="grade-name">金卡教练</view>
          <view class="grade-status">生效中</view>
        </view>
        <view class="vip-expiration-date">2023.01.20到期 ></view>
      </view>
      <view class="right"></view>
    </view>
    <view v-else class="vip-info ordinary" @click="openCard">
      <view class="left">
        <view class="vip-grade">
          <view class="grade-name">蓝卡会员</view>
        </view>
        <!-- <view class="vip-expiration-date">开通金卡教练，畅想多项特权 ></view> -->
      </view>
      <view class="right"></view>
    </view>
    <view class="contact-customer">
      <view class="title">联系客服</view>
      <view class="customer-info">
        <view class="customer-item" @click="copyText('1234567890')">
          <text>客服微信：1234567890</text>
          <text>复制</text>
        </view>
        <view class="customer-item" @click="copyText('Kingtran12@aliyun.com')">
          <text>客服邮箱：Kingtran12@aliyun.com</text>
          <text>复制</text>
        </view>
      </view>
    </view>
    <view class="recommend">
      <van-cell
        title="推荐人"
        :is-link="!userInfo.referrer"
        :value="userInfo.referrer"
        @click="openSheet"
      >
        <template #icon>
          <view class="icon"></view>
        </template>
      </van-cell>
    </view>
    <uni-popup
      ref="popup"
      type="bottom"
      class="recommend-sheet"
      @change="popupChange"
    >
      <view class="picker-box">
        <view class="picker-header">
          <view class="cancel-btn" @click="onCancel">取消</view>
          <view class="title">推荐人</view>
          <view class="success-btn" @click="onConfirm">确认</view>
        </view>
        <view class="message">
          <view class="text">请注意：推荐人选择之后不可更改</view>
        </view>
        <view class="picker-content">
          <view
            class="picker-item"
            :class="{ active: item.active }"
            v-for="(item, index) in columns"
            :key="index"
            @click="pickerSelect(item)"
            >{{ item.text }}</view
          >
        </view>
      </view>
    </uni-popup>
  </view>
</template>

<script>
const My = uniCloud.importObject('my', { customuI: true })
export default {
  data() {
    return {
      userInfo: {
        username: '',
        avatar: null,
        comment: null,
        vipLevel: null,
        vipEndDate: null,
        referrer: null
      },
      columns: [
        { text: '001', value: '001' },
        { text: '002', value: '002' },
        { text: '003', value: '003' },
        { text: '004', value: '004' },
        { text: '005', value: '005' },
        { text: '006', value: '006' },
        { text: '007', value: '007' },
        { text: '008', value: '008' },
        { text: '009', value: '009' },
        { text: '010', value: '010' }
      ]
    }
  },
  onShow() {
    this.getUserInfo()
  },
  methods: {
    pickerSelect(val) {
      this.columns.forEach((item) => (item.active = false))
      val.active = true
    },
    async getUserInfo() {
      const res = await My.getUserInfo()
      const { avatar, username, comment, vipLevel, vipEndDate, referrer } =
        res.data
      this.userInfo = {
        avatar: avatar || null,
        username: username || null,
        comment: comment || null,
        vipLevel: vipLevel || null,
        vipEndDate: vipEndDate || null,
        referrer: referrer || null
      }
      console.log(res, 88888)
    },
    async setReferrer() {
      await My.updateUserInfo({ referrer: this.userInfo.referrer })
      uni.showToast({
        title: '设置成功',
        duration: 2000
      })
    },
    openCard() {
      // uni.reLaunch({
      // 	url: '/pages/openCard/openCard'
      // });
    },
    setUp() {
      uni.navigateTo({
        url: '/pages/setUp/setUp'
      })
    },
    personalInfo() {
      uni.reLaunch({
        url: '/pages/personalInfo/personalInfo'
      })
    },
    copyText(text) {
      uni.setClipboardData({
        data: text,
        success: function () {
          console.log('success')
          uni.showToast({
            title: '复制成功',
            duration: 2000
          })
        }
      })
    },
    openSheet() {
      if (this.userInfo.referrer) {
        return false
      }
      this.$refs.popup.open()
    },
    popupChange(e) {
      if (e.show) {
        uni.hideTabBar()
      } else {
        const timer = setTimeout(() => {
          uni.showTabBar()
          clearTimeout(timer)
        }, 300)
      }
    },
    onConfirm() {
      if (this.columns.every((item) => !item.active)) {
        return
      }
      const item = this.columns.find((item) => item.active)
      this.userInfo.referrer = item.text
      this.$refs.popup.close()
      this.setReferrer()
    },
    onCancel() {
      this.$refs.popup.close()
    }
  }
}
</script>

<style lang="scss">
.status_bar {
  height: var(--status-bar-height);
  width: 100%;
}
.background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  min-height: 100vh;
  height: 100%;
  background-color: #212328;
  background-image: url('../../static/newWorkout/mybackgroud.png');
  background-size: contain;
  background-repeat: no-repeat;
  z-index: -1;
}
.my {
  position: relative;
  padding: 80upx 40upx 0;
  .header {
    display: flex;
    position: relative;
    .logo {
      position: relative;
      .van-image {
        width: 110upx;
        height: 110upx;
      }
      .edit-icon {
        position: absolute;
        bottom: 10upx;
        right: 0;
        background-image: url('../../static/newWorkout/edit.png');
        width: 28upx;
        height: 28upx;
        background-size: contain;
        background-repeat: no-repeat;
      }
    }
    .user-name {
      margin-left: 30upx;
      .name {
        font-size: 40upx;
        font-weight: 600;
        color: #ffffff;
        line-height: 56upx;
        &.ordinary {
          &::after {
            content: '';
            display: inline-block;
            width: 32upx;
            height: 32upx;
            margin-left: 10upx;
            background: url('../../static/newWorkout/vip.png');
            background-size: contain;
          }
        }
      }
      .des {
        margin-top: 10upx;
        font-size: 28upx;
        font-weight: 400;
        color: #bdc3ce;
        line-height: 40upx;
      }
    }
    .config {
      position: absolute;
      right: 40upx;
      top: 0upx;
      width: 44upx;
      height: 44upx;
      background: url('../../static/newWorkout/config.png');
      background-size: contain;
      background-repeat: no-repeat;
    }
  }
  .vip-info {
    margin-top: 58upx;
    display: flex;
    background: linear-gradient(172deg, #5f6571 0%, #333842 100%);
    border-radius: 36upx;
    border: 2upx solid;
    justify-content: space-between;
    .left {
      padding-left: 40upx;
      box-sizing: border-box;
      .vip-grade {
        display: flex;
        align-items: center;
        margin-top: 42upx;
        margin-bottom: 92upx;
        .grade-name {
          font-size: 40upx;
          color: #ffe59e;
          font-weight: 600;
        }
        .grade-status {
          margin-left: 20upx;
          padding: 4upx 14upx;
          background: #4b525e;
          border-radius: 8upx;
          font-size: 24upx;
          font-weight: 600;
          color: #bdc3ce;
        }
      }
      .vip-expiration-date {
        font-size: 26upx;
        font-weight: 400;
        color: #7a7f89;
      }
    }
    .right {
      width: 260upx;
      height: 260upx;
      background: url('../../static/newWorkout/glod.png');
      background-size: 180upx 180upx;
      background-repeat: no-repeat;
      background-position: center;
    }
    &.ordinary {
      background: linear-gradient(172deg, #5c9cff 0%, #1370ff 100%);
      .left {
        .grade-name {
          color: #ffffff;
        }
        .vip-expiration-date {
          color: #ffffff;
        }
      }
      .right {
        width: 260upx;
        height: 260upx;
        background: url('../../static/newWorkout/blue.png');
        background-size: 180upx 180upx;
        background-repeat: no-repeat;
        background-position: center;
      }
    }
  }
  .contact-customer {
    margin-top: 30upx;
    height: 346upx;
    padding: 40upx;
    box-sizing: border-box;
    background: rgba(56, 61, 70, 0.6);
    border-radius: 24upx;
    .title {
      font-size: 30upx;
      font-weight: 600;
      color: #f4f7ff;
      line-height: 42upx;
    }
    .customer-info {
      .customer-item {
        margin-top: 20upx;
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: rgba(75, 82, 94, 0.5);
        height: 90upx;
        border-radius: 16upx;
        padding: 0 30upx;
        font-size: 26upx;
        font-weight: 400;
        color: #bdc3ce;
        cursor: pointer;
      }
    }
  }
  .recommend {
    margin-top: 30upx;
    .van-cell {
      background: rgba(56, 61, 70, 0.6);
      border-radius: 24upx;
      height: 120upx;
      align-items: center;
      color: #bdc3ce;
      font-size: 30upx;
      ::v-deep .van-cell__value {
        color: #bdc3ce;
        font-size: 30upx;
      }
      .icon {
        margin-right: 22upx;
        width: 32upx;
        height: 32upx;
        background: url('../../static/newWorkout/user.svg');
        background-size: contain;
        background-repeat: no-repeat;
      }
    }
  }
  ::v-deep .recommend-sheet {
    .van-picker {
      background: #383d46;
      border-radius: 24upx 24upx 0px 0px;
      .van-picker__mask {
        background-image: none;
      }
      .van-picker__cancel {
        font-size: 32upx;
        font-weight: 600;
        color: #7a7f89;
        line-height: 44upx;
        margin: 0 40upx;
        padding-top: 40upx;
        &::after {
          display: none;
        }
      }
      .van-picker__confirm {
        margin: 0 40upx;
        padding-top: 40upx;
        font-size: 32upx;
        font-weight: 600;
        color: #f4f7ff;
        line-height: 44upx;
        &::after {
          display: none;
        }
      }
      .van-picker__toolbar {
        height: 124upx;
      }
      .van-picker__title {
        font-size: 32upx;
        font-weight: 600;
        color: #f4f7ff;
        line-height: 44upx;
      }
      .van-picker-column__item {
        font-size: 30upx;
        color: #959aa2;
      }
      .van-picker-column__item--selected {
        font-weight: 600;
        color: #f4f7ff;
        background: transparent;
      }
      .van-picker__frame {
        background: rgba(75, 82, 94, 0.5);
        border-radius: 16upx;
        &::after {
          display: none;
        }
      }
    }
  }
  .picker-box {
    background: #383d46;
    border-radius: 24upx 24upx 0upx 0upx;
    .picker-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 40upx;
      .cancel-btn {
        font-size: 32upx;
        font-weight: 600;
        color: #7a7f89;
        line-height: 44upx;
      }
      .title {
        font-size: 32upx;
        font-weight: 600;
        color: #f4f7ff;
        line-height: 44upx;
      }
      .success-btn {
        font-size: 32upx;
        font-weight: 600;
        color: #f4f7ff;
        line-height: 44upx;
      }
    }
    .message {
      padding: 0 40upx;
      height: 80upx;
      margin-bottom: 10upx;
      margin-top: 10upx;
      .text {
        background: rgba(75, 82, 94, 0.5);
        border-radius: 16upx;
        font-size: 26upx;
        font-weight: 400;
        color: #bdc3ce;
        line-height: 80upx;
        text-align: center;
      }
    }
    .picker-content {
      height: 478upx;
      overflow-y: auto;
      padding: 0 40upx;
      .picker-item {
        height: 110upx;
        border-radius: 16upx;
        font-size: 30upx;
        font-weight: 400;
        color: #f4f7ff;
        line-height: 110upx;
        text-align: center;
        &.active {
          background: rgba(75, 82, 94, 0.5);
          font-size: 36upx;
          font-weight: 600;
          color: #f4f7ff;
        }
      }
    }
  }
}
</style>

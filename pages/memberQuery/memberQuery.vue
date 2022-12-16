<template>
  <view class="content_style">
    <BgTheamCompontent :theamType="'currency'"></BgTheamCompontent>
    <scroll-view @scroll="memberSrollTop" scroll-y="true">
      <view
        class="nav_bar_style"
        :class="cellingFlag ? 'nav_antimation_style' : ''"
      >
        <view class="nav_left_style" @click.native="goBack">
          <image
            class="back_img_style"
            src="../../static/app-plus/mebrs/back.png"
          ></image>
          <view class="nav_title_style"></view>
        </view>
        <text class="nav_content_style">会员查询</text>
        <!-- 可能会有图片 -->
        <view class="nav_right_style"></view>
      </view>

      <uni-section title="">
        <uni-search-bar
          v-model="searchValue"
          class="uni-mt-10"
          :class="cellingFlag ? 'search_antimation_style' : ''"
          radius="100"
          placeholder="请输入姓名或手机号码查询"
          clearButton="none"
          cancelButton="none"
          @confirm="searchFun"
        />
      </uni-section>
      <MemberList :searchValue="searchValue" :type="'detail'"></MemberList>
    </scroll-view>
  </view>
</template>

<script>
import BgTheamCompontent from '@/components/bgTheamCompontent/bgTheamCompontent.vue'

import MemberList from '@/components/memberList/memberList.vue'
export default {
  components: {
    BgTheamCompontent,
    MemberList
  },
  data() {
    return {
      searchValue: '',
      cellingFlag: false,
      scrollTop: 0
    }
  },
  methods: {
    memberSrollTop(event) {
      this.scrollTop = event.detail.scrollTop
      this.cellingFlag = event.detail.scrollTop > 50 ? true : false
      console.log(this.scrollTop)
    },
    goBack() {
      uni.switchTab({
        url: '/pages/myMebers/myMebers'
      })
    },
    searchFun(res) {
      this.searchValue = res.value
      // console.log(this.searchValue, '????')
    },
    input(res) {
      console.log('----input:', res)
    },
    clear(res) {
      uni.showToast({
        title: 'clear事件，清除值为：' + res.value,
        icon: 'none'
      })
    },
    blur(res) {
      uni.showToast({
        title: 'blur事件，输入值为：' + res.value,
        icon: 'none'
      })
    },
    focus(e) {
      uni.showToast({
        title: 'focus事件，输出值为：' + e.value,
        icon: 'none'
      })
    },
    cancel(res) {
      uni.showToast({
        title: '点击取消，输入值为：' + res.value,
        icon: 'none'
      })
    }
  }
}
</script>

<style lang="scss">
.nav_antimation_style {
  width: 100vw;
  height: 104upx !important;
  background: #212328;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 500;
}

.search_antimation_style {
  position: fixed;
  left: 60upx;
  width: 85%;
  animation-name: searchAnmation;
  animation-duration: 0.3s;
  z-index: 500;
  top: 0upx;
}
@keyframes searchAnmation {
  0% {
    top: 100upx;
  }

  100% {
    top: 0upx;
  }
}

::v-deep.uni-section {
  background-color: transparent !important;
  padding-top: 40upx;
}
::v-deep .uni-section .uni-section-header {
  display: none !important;
}
::v-deep .uni-searchbar__box {
  background: #383d46 !important;
}

::v-deep.van-cell {
  height: 80upx;
}
::v-deep .uni-searchbar__box-search-input {
  font-size: 32upx;
  font-family: PingFangSC-Semibold, PingFang SC;
  // font-weight: 600;
  color: #f4f7ff !important;
}
.nav_bar_style {
  width: 100%;
  height: 88upx;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .nav_left_style {
    height: 100%;
    display: flex;
    align-items: center;
    margin-left: 30upx;
    // width: 40%;
    box-sizing: border-box;
    flex-wrap: nowrap;
    .back_img_style {
      width: 40upx;
      height: 40upx;
    }
    .nav_title_style {
      margin-left: 20upx;
      font-size: 48upx;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
      color: #ffffff;
      z-index: 80;
    }
  }
  .nav_content_style {
    display: inline-block;
    z-index: 80;
    flex: 1;
    text-align: center;
    font-size: 30upx;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #ffffff;
  }
  .nav_right_style {
    width: 10%;
  }
}
::v-deep.van-icon {
  font-size: 24upx !important;
  color: #7a7f89 !important;
}
uni-scroll-view {
  height: 100vh;
}
::v-deep .van-popup {
  // width: 100vw;
  background: none !important;
}
::v-deep .van-overlay {
  opacity: 0.2 !important;
}
</style>

<template>
  <view class="content_style">
    <BgTheamCompontent :theamType="'currency'"></BgTheamCompontent>
    <NavBarCompontent :contentTitle="'会员查询'"></NavBarCompontent>
    <uni-section title="">
      <uni-search-bar
        v-model="searchValue"
        class="uni-mt-10"
        radius="100"
        placeholder="请输入姓名或手机号码查询"
        clearButton="none"
        cancelButton="none"
        @confirm="searchFun"
      />
    </uni-section>
    <MemberList :searchValue="searchValue" :type="'detail'"></MemberList>
  </view>
</template>

<script>
import BgTheamCompontent from '@/components/bgTheamCompontent/bgTheamCompontent.vue'
import NavBarCompontent from '@/components/navBarCompontent/navBarCompontent.vue'
import MemberList from '@/components/memberList/memberList.vue'
export default {
  components: {
    BgTheamCompontent,
    NavBarCompontent,
    MemberList
  },
  data() {
    return {
      searchValue: ''
    }
  },
  onLoad(options) {},
  methods: {
    searchFun(res) {
      this.searchValue = res.value
      console.log(this.searchValue, '????')

      // uni.showToast({
      // 	title: '搜索：' + res.value,
      // 	icon: 'none'
      // })
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
</style>

<template>
  <view class="content_style">
    <BgTheamCompontent :theamType="'currency'"></BgTheamCompontent>
    <view class="header_style">
      <view class="header_left_style">
        <view class="left_content_style">
          <image
            class="left_content_img_style"
            src="https://img2.baidu.com/it/u=2490939159,251868101&fm=253&fmt=auto&app=120&f=JPEG?w=1200&h=750"
          ></image>
          <view class="left_header_style">你好</view>
        </view>
      </view>
      <view class="header_right_style">
        <image
          class="right_img_style"
          src="../../static/app-plus/mebrs/fangdajing.svg"
        ></image>
      </view>
    </view>
    <view class="is_buy_style">
      <view
        class="buy_left"
        :class="isActive === 'y' ? 'active' : ''"
        @click.native="buyClick('y')"
        >已购课</view
      >
      <view
        class="buy_right"
        :class="isActive === 'n' ? 'active' : ''"
        @click.native="buyClick('n')"
        >未购课</view
      >
    </view>
    <view class="mebers_content">
      <view class="no_data_style" v-if="meberList.length === 0">
        <image
          class="no_data_meber_img_style"
          src="../../static/app-plus/mebrs/nomebers.png"
        ></image>

        <!-- <text class="my_student_style">锟斤拷去锟斤拷锟接碉拷一锟斤拷学员锟斤拷</text> -->
      </view>
    </view>
    <view class="btn_add">
      <image
        class="add_img_style"
        src="../../static/app-plus/mebrs/add.svg"
        @click="addClick"
      ></image>
    </view>
  </view>
</template>

<script>
import BgTheamCompontent from '@/components/bgTheamCompontent/bgTheamCompontent.vue'

export default {
  components: {
    BgTheamCompontent
  },
  data() {
    return {
      meberList: [],
      isActive: 'y'
    }
  },
  methods: {
    addClick() {
      // let addData = {
      // 	  studentName: '张三'
      //   }
      // this.meberList.push(addData)
      uni.navigateTo({
        url: '/pages/addMyMebers/addMyMebers',
        success: (res) => {},
        fail: () => {},
        complete: () => {}
      })
    },
    buyClick(type) {
      this.isActive = type
    }
  }
}
</script>

<style lang="scss">
.content_style {
  width: 100vw;
  height: calc(100vh - 50px);
  overflow: hidden;
  position: relative;
  display: flex;
  flex-direction: column;
  .header_style {
    width: calc(100vw - 60upx);
    height: 80upx;
    margin-top: 30upx;
    display: flex;
    justify-content: space-around;
    align-items: center;
    .header_left_style {
      width: 50%;
      height: 100%;
      .left_content_style {
        display: flex;
        align-items: center;
        height: 80upx;

        .left_content_img_style {
          width: 80upx;
          height: 100%;
          object-fit: contain;
          border-radius: 50%;
          margin-right: 20upx;
          margin-left: 30upx;
        }
      }
    }
    .header_right_style {
      width: 50%;
      display: block;
      .right_img_style {
        height: 48.59upx;
        height: 48.59upx;
      }
    }
  }
  .is_buy_style {
    width: calc(100vw - 60upx);
    z-index: 40;
    height: 82upx;
    margin-left: 30upx;
    display: flex;
    align-items: center;
    margin-top: 36upx;
    .buy_left {
      width: 50%;
      height: 100%;
      text-align: center;
      background: linear-gradient(180deg, #343a44 0%, #212328 100%);
      line-height: 82upx;
      color: #a8adb6;

      border-radius: 200upx 0px 0px 200upx;
    }
    .buy_right {
      width: 50%;
      height: 100%;
      color: #a8adb6;
      line-height: 82upx;
      text-align: center;
      background: linear-gradient(180deg, #343a44 0%, #212328 100%);
      border-radius: 0px 200upx 200upx 0px;
    }
    .active {
      background: #1370ff;
      color: #fff;
    }
  }
  .mebers_content {
    width: 100vw;
    flex: 1;
    .no_data_style {
      margin-top: 10%;
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      .no_data_meber_img_style {
        // width: 100%;
      }
      .my_student_style {
        font-weight: 400;
        color: #7a7f89;
        line-height: 40upx;
        font-size: 28upx;
      }
    }
  }
  .btn_add {
    width: 130upx;
    height: 130upx;

    position: absolute;
    right: 30upx;
    bottom: 30upx;
    .add_img_style {
      width: 130upx;
      height: 100%;
      border-radius: 50%;
      object-fit: contain;
    }
  }
}
</style>

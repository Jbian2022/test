<template>
  <van-nav-bar
    title="体测报告"
    left-text=""
    left-arrow
    @click-left="onClickLeft"
    class="nav-bar"
  />
  <view class="reportBody">
    <van-collapse v-model="activeNames">
      <view
        class="collapse"
        v-for="(item, index) in bodyTestReport"
        :key="index"
      >
        <view style="margin-left: 30upx">
          <text>{{ item.mainTitle }}</text>
        </view>
        <van-collapse-item :title="item.subHeading" :name="index + 1">
          代码是写出来给人看的，附带能在机器上运行。
        </van-collapse-item>
      </view>
      <!-- 	<view class="collapse">
				<view style="margin-left: 30upx;">
					<text>体重（kg）</text>
				</view>
				<van-collapse-item title="80" name="2">
					代码是写出来给人看的，附带能在机器上运行。
				</van-collapse-item>
			</view>
			<view class="collapse">
				<view style="margin-left: 30upx;">
					<text>肌肉量（kg）</text>
				</view>
				<van-collapse-item title="请选择肌肉量" name="3">
					代码是写出来给人看的，附带能在机器上运行。
				</van-collapse-item>
			</view>
			<view class="collapse">
				<view style="margin-left: 30upx;">
					<text>体脂量（kg）</text>
				</view>
				<van-collapse-item title="请选择体脂量" name="1">
					代码是写出来给人看的，附带能在机器上运行。
				</van-collapse-item>
			</view>
			<view class="collapse">
				<view style="margin-left: 30upx;">
					<text>体脂百分比（%）</text>
				</view>
				<van-collapse-item title="请选择体脂百分比" name="1">
					代码是写出来给人看的，附带能在机器上运行。
				</van-collapse-item>
			</view>
			<view class="collapse">
				<view style="margin-left: 30upx;">
					<text>腰臀脂肪比（%）</text>
				</view>
				<van-collapse-item title="请选择腰臀脂肪比" name="1">
					代码是写出来给人看的，附带能在机器上运行。
				</van-collapse-item>
			</view>
			<view class="collapse">
				<view style="margin-left: 30upx;">
					<text>基础代谢（cal）</text>
				</view>
				<van-collapse-item title="请选择基础代谢" name="1">
					代码是写出来给人看的，附带能在机器上运行。
				</van-collapse-item>
			</view>
			<view class="collapse">
				<view style="margin-left: 30upx;">
					<text>体水分</text>
				</view>
				<van-collapse-item title="请选择体水分" name="1">
					代码是写出来给人看的，附带能在机器上运行。
				</van-collapse-item>
			</view>
			<view class="collapse">
				<view style="margin-left: 30upx;">
					<text>身体分数</text>
				</view>
				<van-collapse-item title="请选择身体分数" name="1">
					代码是写出来给人看的，附带能在机器上运行。
				</van-collapse-item>
			</view> -->
    </van-collapse>
    <van-button type="primary" class="btn">确认</van-button>
  </view>
</template>

<script>
export default {
  data() {
    return {
      activeNames: ['1'],
      bodyTestReport: [
        {
          mainTitle: '身体',
          subHeading: '请选择身高'
        },
        {
          mainTitle: '体重（kg）',
          subHeading: '80'
        },
        {
          mainTitle: '肌肉量（kg）',
          subHeading: '请选择肌肉量'
        },
        {
          mainTitle: '体脂量（kg）',
          subHeading: '请选择体脂量'
        },
        {
          mainTitle: '体脂百分比（%）',
          subHeading: '请选择体脂百分比'
        },
        {
          mainTitle: '腰臀脂肪比（%）',
          subHeading: '请选择腰臀脂肪比'
        },
        {
          mainTitle: '基础代谢（cal）',
          subHeading: '请选择基础代谢'
        },
        {
          mainTitle: '体水分',
          subHeading: '请选择体水分'
        },
        {
          mainTitle: '身体分数',
          subHeading: '请选择身体分数'
        }
      ]
    }
  },
  methods: {
    onClickLeft() {
      this.$router.go(-1)
    }
  }
}
</script>

<style lang="scss" scoped>
.reportBody {
  background-color: pink;
  padding: 30upx;
}

.collapse {
  background-color: #383d46;
  color: #fff;
  margin: 30upx 0;
  // border-radius: 10upx;
}

::v-deep .van-collapse-item {
  .van-cell {
    background-color: #383d46;
    .van-cell__title {
      color: #7a7f89;
    }
  }
}
::v-deep .van-collapse-item::after {
  border: none;
}
.btn {
  width: calc(100vw - 60upx);
  margin: 0 auto;
  border: none;
}
</style>

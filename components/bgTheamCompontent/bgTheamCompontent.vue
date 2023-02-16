<template>
  <view class="bg_content">
    <view v-if="theamType === 'currency'" class="currency_style">
      <!-- <image class="currency_img_style" src="../../static/app-plus/bg/currency.png"></image> -->
    </view>
    <view class="currency_content_style"></view>
    <!-- 		<view v-if="theamType==='goldenCard'" class="currency_style">
			<image class="currency_gold_img_style" src="../../static/app-plus/bg/goldenCard.png"></image>
			<image class="currency_img_style" src="../../static/app-plus/bg/currency.png"></image>
			<view class="currency_content_style"></view>
		</view> -->
  </view>
</template>

<script>
export default {
  name: 'bgTheamCompontent',
  props: ['theamType'],
  data() {
    return {}
  }
}
</script>

<style lang="scss">
.bg_content {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  z-index: -1;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  .currency_style {
    width: 100%;
    height: 460upx;
    background: linear-gradient(to bottom, rgba(52, 58, 68, 1), #212328);
    .currency_gold_img_style {
      width: 100%;
      height: 372upx;
      position: absolute;
      object-fit: contain;
      left: 0;
      top: 0;
      z-index: 30;
      opacity: 0.4;
    }
    .currency_img_style {
      width: 100%;
      height: 372upx;
      object-fit: contain;
      z-index: -2;
    }
  }
  .currency_content_style {
    width: 100%;
    flex: 1;
    background: #212328;
  }
}
</style>
<template>
  <view class="agreement_style">
    <view class="nav_style" @click.native="goBack">
      <image
        class="back_img_style"
        src="@/static/app-plus/mebrs/back.png"
      ></image>
      <view class="title m_l"> 用户隐私协议 </view>
    </view>
    <scroll-view scroll-y="true">
      <view class="content">
        <view class="content_ying">
          上海星宇健变科技有限公司及关联公司（以下简称我们）非常重视您的个人信息，并让您对个人信息拥有控制权，我们会使用强大的加密技术来保护您的隐私，同时制定严格的政策来管理所有数据。当您访问健变相关互联网产品时，或使用我们提供的服务前，您需要同意本政策中关于我们如何收集、使用、储存和分享您的相关信息的规定。如果您不同意本隐私政策中的任何内容，请立即停止使用或访问我们的产品和服务。若您对本政策有任何问题，请联系：
          kingtran@sina.cn。本隐私政策要点如下：
        </view>
        <p class="m_t">
          1.
          我们将逐一说明我们收集的您的个人信息类型及其对应的用途，以便您了解我们针对某一特定功能所收集的具体个人信息的类别、使用理由及收集方式。
        </p>
        <p class="m_t">
          2.
          当您使用一些功能时，我们会在获得您的同意后，收集您的一些敏感信息，除非按照相关法律法规要求必须收集，拒绝提供这些信息仅会使您无法使用相关特定功能，但不影响您正常使用健变及相关互联网产品的其他功能。
        </p>
        <p class="m_t">
          3. 目前， 健变及相关互联网产品
          不会主动共享或转让您的个人信息至健变及相关互联网产品外的第三方，如存在其他共享或转让您的个人信息或您需要我们将您的个人信息共享或转让至健变及相关互联网产品外的第三方情形时，我们会直接或确认第三方征得您对上述行为的明示同意，此外，我们会对对外提供信息的行为进行风险评估。
        </p>
        <p class="m_t">
          4.
          目前，健变及相关互联网产品不会主动从健变及相关互联网产品外的第三方获取您的个人信息。如未来为业务发展需要从第三方间接获取您的个人信息，我们会在获取前向您明示您个人信息的来源、类型及使用范围，如健变及相关互联网产品开展业务需进行的个人信息处理活动超出您原本向第三方提供个人信息时的授权同意范围，我们将在处理您的该等个人信息前，征得您的明示同意；此外，我们也将会严格遵守相关法律法规的规定，并要求第三方保障其提供的信息的合法性。
        </p>
        <p class="m_t">
          5.
          您可以通过本指引所列途径访问、更正、删除您的个人信息，也可以撤回同意、注销帐号、投诉举报以及设置隐私功能。
        </p>
      </view>
    </scroll-view>
    <view class="is_agreement_style" @click.native="goBack"
      >我已阅读并同意</view
    >
  </view>
</template>

<script>
export default {
  data() {
    return {
      title:
        '<p>紧张肌肉：&nbsp;肩胛提肌，&nbsp;颈伸肌，&nbsp;前斜角肌，&nbsp;头后大直肌，&nbsp;头半棘肌，&nbsp;胸锁乳突形肌。</p><p>无力肌肉：&nbsp;深层颈屈肌，&nbsp;菱形肌，&nbsp;中下斜方肌，&nbsp;小圆肌，&nbsp;岗下肌。</p>'
    }
  },
  methods: {
    goBack() {
      uni.navigateBack()
    }
  }
}
</script>

<style lang="scss">
.m_l {
  margin-left: 30upx;
}
.agreement_style {
  width: 100vw;
  height: 100vh;
  // box-sizing: border-box;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  .nav_style {
    width: 100%;

    padding-top: 24upx;
    margin-left: 30upx;
    display: flex;
    align-items: center;
    .back_img_style {
      width: 40upx;
      height: 40upx;
    }

    .title {
      font-size: 48upx;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
      color: #323438;
      // text-align: center;
    }
  }
  .content {
    width: 100vw;
    padding-left: 30upx;
    padding-right: 30upx;
    box-sizing: border-box;
    .content_ying {
      font-size: 30upx;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #6e7073;
      line-height: 44upx;
      text-indent: 60upx;
      letter-spacing: 0;
    }
    .m_t {
      font-size: 30upx;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #6e7073;
      line-height: 44upx;
      letter-spacing: 0;
      padding-top: 15upx;
    }
  }
  .is_agreement_style {
    width: calc(100vw - 60upx);
    margin-left: 30upx;
    height: 100upx;
    background: #1370ff;
    border-radius: 16upx;
    margin-top: 30upx;
    margin-bottom: 30upx;
    font-size: 32upx;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: 600;
    color: #ffffff;
    line-height: 100upx;
    text-align: center;
  }
}
uni-scroll-view {
  height: calc(100vh - 250upx);
}
</style>

<template>
  <view class="my">
    <view class="background"></view>
    <view class="status_bar"><!-- 这里是状态栏 --></view>
    <!-- <view class="header">
      <view class="logo" @click="personalInfo">
        <van-image round :src="userInfo.avatar" />
        <view class="edit-icon"></view>
      </view>
      <view class="user-name">
        <view class="name" :class="{ ordinary: userInfo.vipLevel === 2 }">{{
          userInfo.nickname
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
      </view>
      <view class="right"></view>
    </view> -->
    <view
      v-if="
        termOfValidity &&
        (userInfo.vipLevel == 'annualCard' ||
          userInfo.vipLevel == 'quarterCard' ||
          userInfo.vipLevel == 'monthlyCard')
      "
      class="vip-card"
    >
      <view class="left">
        <view class="card-info" @click="personalInfo">
          <view class="user-logo">
            <van-image round :src="userInfo.avatar" />
          </view>
          <view class="card-name">{{ userInfo.nickname }}</view>
          <view class="card-status">金卡教练</view>
        </view>
        <view class="card-des">{{
          userInfo.vipEndDate
            ? '到期时间: ' + userInfo.vipEndDate
            : '立即续费金卡教练，畅享多项特权~'
        }}</view>
      </view>
      <view></view>
    </view>
    <view v-else class="vip-card default">
      <view class="left">
        <view class="card-info" @click="personalInfo">
          <view class="user-logo">
            <van-image round :src="userInfo.avatar" />
          </view>
          <view class="card-name">{{ userInfo.nickname }}</view>
          <view class="card-status">普卡教练</view>
        </view>
        <view class="card-des">{{
          userInfo.vipEndDate
            ? '已到期: ' + userInfo.vipEndDate + ', 续费畅享多项特权~'
            : '开通金卡教练，畅享多项特权~'
        }}</view>
      </view>
      <view></view>
    </view>
    <view class="vip-title">金卡教练</view>
    <view class="card-types-box">
      <view class="card-types">
        <view
          v-for="(item, index) in cardList"
          :key="index"
          class="type-item-box"
        >
          <view
            class="type-item"
            :class="{ active: item.active }"
            @click="selectCard(item)"
          >
            <view class="hot-msg">{{ item.hotMsg }}</view>
            <view class="text">{{ item.text }}</view>
            <view class="money"
              >¥<text class="num">{{ item.money }}</text></view
            >
            <view class="des">{{ item.des }}{{ item.unit }}</view>
            <div class="activity">{{ item.activity }}</div>
          </view>
        </view>
      </view>
    </view>
    <view class="vip-title">金卡教练权益</view>
    <view class="equity-box">
      <view class="equity-list">
        <view class="equity-item">
          <view class="logo"></view>
          <view class="des">体态评估</view>
        </view>
        <view class="equity-item">
          <view class="logo"></view>
          <view class="des">体能评估</view>
        </view>
        <view class="equity-item">
          <view class="logo"></view>
          <view class="des">动态评估</view>
        </view>
        <view class="equity-item">
          <view class="logo"></view>
          <view class="des">训练计划</view>
        </view>
        <view class="equity-item">
          <view class="logo"></view>
          <view class="des">问题动作库</view>
        </view>
        <view class="equity-item">
          <view class="logo"></view>
          <view class="des">全部动作库</view>
        </view>
      </view>
    </view>
    <view class="contact-customer-box">
      <view class="contact-customer">
        <view class="title">联系客服</view>
        <view class="customer-info">
          <view class="customer-item" @click="copyText('FeiYun41')">
            <text>客服微信：FeiYun41</text>
            <text>复制</text>
          </view>
          <view
            class="customer-item"
            @click="copyText('Kingtran12@aliyun.com')"
          >
            <text>客服邮箱：Kingtran12@aliyun.com</text>
            <text>复制</text>
          </view>
        </view>
      </view>
      <view class="recommend-box">
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
        <view class="recommend">
          <van-cell title="设置" is-link @click="setUp">
            <template #icon>
              <view class="icon air-config"></view>
            </template>
          </van-cell>
        </view>
      </view>
    </view>
    <view class="footer-button">
      <view class="text-box">
        <view class="yuan">已省￥{{ hotInfo.text1 }}</view>
        <view class="des">{{ hotInfo.text2 }}</view>
      </view>
      <van-button block @click="payClick"
        >确认开通并支付￥{{ payInfo.money }}元</van-button
      >
      <van-action-sheet class="payment-action-sheet" v-model:show="payShow">
        <view class="title" @click.native="aliPayment">选择支付方式</view>
        <view class="actions">
          <view class="action">
            <!-- #ifdef MP-ALIPAY || H5 || APP -->
            <image
              class="img"
              src="../../static/app-plus/other/zfb.svg"
              @click.native="createOrder('alipay')"
            />
            <view class="text">支付宝</view>
          </view>
          <view class="action">
            <image
              class="img"
              src="../../static/app-plus/other/saveWechat.svg"
              @click.native="createOrder('wxpay')"
            />
            <view class="text">微信</view>
          </view>
          <!-- #endif -->
        </view>
      </van-action-sheet>
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
    <uni-popup
      ref="popup1"
      type="bottom"
      class="recommend-sheet"
      @change="popupChange"
    >
      <view class="payment-action-sheet">
        <view class="title">选择支付方式</view>
        <view class="actions">
          <view class="action">
            <van-image
              class="img"
              src="https://mp-4e6f1c48-a4dc-4897-a866-0a1a071023c3.cdn.bspapp.com/cloudstorage/92897c24-96a3-4bb2-8fb8-44019822af77.svg"
            />
            <view class="text">支付宝</view>
          </view>
          <view class="action">
            <van-image
              class="img"
              src="https://mp-4e6f1c48-a4dc-4897-a866-0a1a071023c3.cdn.bspapp.com/cloudstorage/ca311552-a492-4e14-b884-cefd7a6cb712.svg"
            />
            <view class="text">微信</view>
          </view>
        </view>
      </view>
    </uni-popup>
    <!-- 统一支付组件 -->

    <uni-pay
      ref="uniPay"
      :adpid="adpid"
      height="70vh"
      return-url="/pages/order-detail/order-detail"
      logo="/static/logo.png"
      @success="onSuccess"
      @create="onCreate"
    ></uni-pay>
  </view>
</template>

<script>
const My = uniCloud.importObject('my', { customUI: true })
const login = uniCloud.importObject('login', {
  customUI: true // 取消自动展示的交互提示界面
})
import moment from 'moment'
export default {
  data() {
    return {
      /** 支付 **/
      total_fee: 1, // 支付金额，单位分 100 = 1元
      description: '测试订单', // 支付描述
      type: 'test', // 支付回调类型 如 recharge 代表余额充值 goods 代表商品订单（可自定义，任意英文单词都可以，只要你在 uni-pay-co/notify/目录下创建对应的 xxx.js文件进行编写对应的回调逻辑即可）
      //qr_code: true, // 是否强制使用扫码支付
      openid: '', // 微信公众号需要
      custom: {
        a: 'a',
        b: 1
      },
      adpid: '1000000001', // uni-ad的广告位id

      transaction_id: '', // 查询订单接口的查询条件
      getOrderRes: {}, // 查询订单支付成功后的返回值
      /** 结束**/

      userInfo: {
        nickname: '',
        avatar: null,
        comment: null,
        vipLevel: null,
        vipEndDate: null,
        referrer: null
      },
      payShow: false,
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
      ],
      cardList: [
        {
          hotMsg: '每天仅需0.26元',
          text: '年卡限时特惠',
          money: '98',
          des: '365',
          unit: '元/年',
          activity: '无限会员数',
          active: true,
          order_no:
            '20221027812838484891' +
            Math.floor(Math.random() * 10 + 1) +
            Math.floor(Math.random() * 10 + 1) +
            Math.floor(Math.random() * 10 + 1) +
            Math.floor(Math.random() * 10 + 1) +
            Math.floor(Math.random() * 10 + 1),
          out_trade_no:
            '200123321321312' +
            Math.floor(Math.random() * 10 + 1) +
            Math.floor(Math.random() * 10 + 1) +
            Math.floor(Math.random() * 10 + 1) +
            Math.floor(Math.random() * 10 + 1) +
            Math.floor(Math.random() * 10 + 1),
          productid: 'jianbiannianka',
          vipLevel: 'annualCard'
        },
        {
          hotMsg: '立省90元',
          text: '三个月',
          money: '68',
          des: '158',
          unit: '元/季度',
          activity: '限100个会员',
          active: false,
          order_no:
            '20221027812838483891' +
            Math.floor(Math.random() * 10 + 1) +
            Math.floor(Math.random() * 10 + 1) +
            Math.floor(Math.random() * 10 + 1) +
            Math.floor(Math.random() * 10 + 1) +
            Math.floor(Math.random() * 10 + 1),
          out_trade_no:
            '200123321321323' +
            Math.floor(Math.random() * 10 + 1) +
            Math.floor(Math.random() * 10 + 1) +
            Math.floor(Math.random() * 10 + 1) +
            Math.floor(Math.random() * 10 + 1) +
            Math.floor(Math.random() * 10 + 1),
          productid: 'jianbianjika',
          vipLevel: 'quarterCard'
        },
        {
          hotMsg: '立省40元',
          text: '月卡',
          money: '38',
          des: '78',
          unit: '元/月',
          activity: '限30个会员',
          active: false,
          order_no:
            '20221027812838486891' +
            Math.floor(Math.random() * 10 + 1) +
            Math.floor(Math.random() * 10 + 1) +
            Math.floor(Math.random() * 10 + 1) +
            Math.floor(Math.random() * 10 + 1) +
            Math.floor(Math.random() * 10 + 1),
          out_trade_no:
            '200123321321323' +
            Math.floor(Math.random() * 10 + 1) +
            Math.floor(Math.random() * 10 + 1) +
            Math.floor(Math.random() * 10 + 1) +
            Math.floor(Math.random() * 10 + 1) +
            Math.floor(Math.random() * 10 + 1),
          productid: 'jianbianyueka',
          vipLevel: 'monthlyCard'
        }
      ],
      hotInfo: {
        text1: '267',
        text2: '365元/年'
      },

      payInfo: {}, //支付情况

      show: false,
      termOfValidity: false,
      platform: uni.getSystemInfoSync().platform
    }
  },
  onShow() {
    this.getUserInfo()
  },
  mounted() {
    // 用户有效判断

    let c = moment('2021-05-07').isSame('2021-05-08')
    console.log(c, '???')
  },
  watch: {
    payShow: {
      handler: function (n) {
        if (n) {
          uni.hideTabBar()
        } else {
          uni.showTabBar()
        }
      }
    },
    cardList: {
      handler: function (n) {
        let list = JSON.parse(JSON.stringify(n))
        let findItem = list.find((v) => v.active)
        this.payInfo = findItem
      },
      deep: true,
      immediate: true
    }
  },

  methods: {
    // 监听事件 - 支付订单创建成功（此时用户还未支付）
    onCreate(res) {
      console.log('create: ', res)
      // 如果只是想生成支付二维码，不需要组件自带的弹窗，则在这里可以获取到支付二维码 qr_code_image
    },
    // 成功更改业务
    successChangeBusiness() {
      let self = this
      self.getUserInfo()
      let vipEndDate = null
      switch (self.payInfo.vipLevel) {
        case 'annualCard':
          vipEndDate = moment()
            .add(1, 'years')
            .add(1, 'day')
            .format('YYYY-MM-DD') // 1年后
          break
        case 'quarterCard':
          vipEndDate = moment()
            .add(3, 'months')
            .add(1, 'day')
            .format('YYYY-MM-DD') // 三月之后
          break
        case 'monthlyCard':
          vipEndDate = moment()
            .add(1, 'months')
            .add(1, 'day')
            .format('YYYY-MM-DD') // 三月之后
          break
      }
      let param = {
        vipEndDate: vipEndDate,
        vipLevel: self.payInfo.vipLevel
      }
      console.log(param, 'param')
      login
        .perfectInfo(param)
        .then((res) => {
          if (res.success) {
          }
        })
        .catch((err) => {})
    },
    // 监听事件 - 支付成功
    onSuccess(res) {
      console.log('success: ', res)
      // 充值成功添加有效期

      if (res.user_order_success) {
        // 代表用户已付款，且你自己写的回调成功并正确执行了
        // 成功之后的业务逻辑

        this.successChangeBusiness()
        self.payShow = false
      } else {
        // 代表用户已付款，但你自己写的回调执行失败（通常是因为你的回调代码有问题）
        this.successChangeBusiness()
        self.payShow = false
      }
    },
    createOrder(provider) {
      // 发起支付
      let param = {}
      if (provider === 'appleiap') {
        param = {
          provider: provider, // 支付供应商（这里固定未appleiap，代表ios内购支付）
          order_no: String(this.payInfo.order_no), // 业务系统订单号
          out_trade_no: String(this.payInfo.out_trade_no),
          type: 'appleiap', // 支付回调类型（可自定义，建议填写appleiap）
          productid: this.payInfo.productid, // ios内购产品id（仅ios内购生效）
          // 自定义数据
          custom: {}
        }
      } else {
        param = {
          provider: provider, // 支付供应商
          total_fee: this.payInfo.money * 100, // 支付金额，单位分 100 = 1元
          type: 'recharge', // 支付回调类型
          order_no: String(this.payInfo.order_no), // 业务系统订单号
          out_trade_no: String(this.payInfo.out_trade_no),
          description: '教练充值VIP', // 支付描述
          qr_code: '', // 是否强制使用扫码支付
          openid: '', // 微信公众号需要
          custom: '' // 自定义数据
        }
      }
      console.log(param, '我是支付的参数')

      this.$refs.uniPay.createOrder(param)
    },
    payClick() {
      if (this.platform === 'ios') {
        this.createOrder('appleiap')
      } else {
        this.payShow = true
      }
    },
    pickerSelect(val) {
      this.columns.forEach((item) => (item.active = false))
      val.active = true
    },
    async getUserInfo() {
      const res = await My.getUserInfo()
      const { avatar, nickname, comment, vipLevel, vipEndDate, referrer } =
        res.data
      this.userInfo = {
        avatar: avatar || null,
        nickname: nickname || null,
        comment: comment || null,
        vipLevel: vipLevel || null,
        vipEndDate: vipEndDate || null,
        referrer: referrer || null
      }
      if (this.userInfo.vipLevel) {
        // 获取当前时间
        let currentDay = moment().format('YYYY-MM-DD') // 当前时间
        // 先比较是否相等
        let sameTime = moment(currentDay).isSame(this.userInfo.vipEndDate)
        if (sameTime) {
          this.termOfValidity = false
        } else {
          this.termOfValidity = moment(currentDay).isBefore(
            this.userInfo.vipEndDate
          )
        }
      } else {
        this.termOfValidity = false
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
    selectCard(item) {
      this.cardList.forEach((element) => (element.active = false))
      item.active = true
      this.hotInfo.text1 = +item.des - +item.money
      this.hotInfo.text2 = item.des + item.unit
    },
    openCard() {
      uni.reLaunch({
        url: '/pages/openCard/openCard'
      })
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
    openSheet1() {
      this.$refs.popup1.open()
    },
    popupChange(e) {
      if (e.show) {
        uni.hideTabBar()
      } else {
        const timer = setTimeout(() => {
          uni.showTabBar()
          clearTimeout(timer)
        }, 100)
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
  padding: 32upx 0 0;
  padding-bottom: 150upx;
 
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
  .vip-card {
    display: flex;
    justify-content: space-between;
    height: 386upx;
    background: url('../../static/newWorkout/card-vip-bg.png');
    background-size: 100% 386upx;
    background-repeat: no-repeat;
    position: relative;
    margin-bottom: -80upx;
    .left {
      padding-top: 40upx;
      padding-left: 70upx;
      .card-info {
        display: flex;
        align-items: center;
        .user-logo {
          .van-image {
            width: 80upx;
            height: 80upx;
          }
        }
        .card-name {
          margin-left: 20upx;
          font-size: 48upx;
          color: #93653c;
          line-height: 68upx;
          font-weight: 600;
        }
        .card-status {
          margin-left: 15upx;
          font-size: 24upx;
          background: #fff0c0;
          border-radius: 20upx;
          padding: 4upx 10upx;
          font-weight: 600;
          color: #95673d;
        }
      }
      .card-des {
        margin-top: 85upx;
        font-size: 26upx;
        font-weight: 400;
        color: #90633a;
      }
    }
    .right {
      position: absolute;
      right: -30upx;
      top: 0;
      z-index: 0;
      width: 260upx;
      height: 260upx;
      background: url('../../static/newWorkout/open-card-vip.png');
      background-size: 180upx 180upx;
      background-repeat: no-repeat;
      background-position: center;
    }
    &.default {
      background: url('../../static/newWorkout/card-default-bg.png');
      background-size: 100% 386upx;
      background-repeat: no-repeat;
      .left {
        .card-info {
          .card-name {
            color: #fff;
          }
          .card-status {
            background: rgba(65, 70, 81, 0.7);
            border: 2upx solid #5f6572;
            color: #bdc3ce;
          }
        }
        .card-des {
          color: #ffffff;
        }
      }
    }
  }
  .vip-title {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 32upx;
    color: #ffe18f;
    line-height: 46upx;
    font-weight: bold;
    margin: 40upx 0;
    &::before {
      content: '';
      width: 80upx;
      height: 22upx;
      background-image: url('../../static/newWorkout/vip-card-title-bg.png');
      background-size: contain;
      background-repeat: no-repeat;
      margin-right: 20upx;
    }
    &::after {
      content: '';
      width: 80upx;
      height: 22upx;
      background-image: url('../../static/newWorkout/vip-card-title-bg.png');
      background-size: contain;
      background-repeat: no-repeat;
      transform: rotateY(180deg);
      margin-left: 20upx;
    }
  }
  .card-types-box {
    padding: 0 30upx;
    box-sizing: border-box;
    width: 100%;
  }
  .card-types {
    display: flex;
    .type-item-box {
      flex-shrink: 0;
      width: 33.333%;
      padding: 0 10upx;
      box-sizing: border-box;
    }
    .type-item {
      height: 300upx;
      background: rgba(56, 61, 70, 0.2);
      border-radius: 16px;
      border: 2upx solid rgba(122, 127, 137, 0.2);
      box-sizing: border-box;
      text-align: center;
      position: relative;
      .hot-msg {
        position: absolute;
        top: -8upx;
        left: -2upx;
        padding: 0 14upx;
        height: 44upx;
        line-height: 44upx;
        background: linear-gradient(173deg, #fff3d3 0%, #ffe6a1 100%);
        border-radius: 16upx 4upx 16upx 4upx;
        color: #90633a;
        font-size: 24upx;
      }
      .text {
        margin-top: 52upx;
        font-size: 28upx;
        color: #f4f7ff;
        font-weight: bold;
      }
      .money {
        margin-top: 12upx;
        font-size: 28upx;
        font-weight: bold;
        color: #ffe18f;
        .num {
          font-size: 52upx;
        }
      }
      .des {
        margin-top: 10upx;
        font-size: 20upx;
        color: #bdc3ce;
        text-decoration: line-through;
        margin-bottom: 22upx;
      }
      .activity {
        font-size: 26upx;
        font-weight: 500;
        color: #ffe18f;
      }
      &.active {
        background: linear-gradient(180deg, #645f52 0%, #292c31 100%);
        border: 2upx solid #ffe6a1;
      }
    }
  }
  .equity-box {
    margin-top: 40upx;
    margin-bottom: 20upx;
    padding: 0 30upx;
    box-sizing: border-box;
  }
  .equity-list {
    display: flex;
    flex-wrap: wrap;
    padding: 36upx;
    padding-bottom: 26upx;
    background: rgba(56, 61, 70, 0.2);
    border-radius: 16upx;
    border: 2upx solid rgba(122, 127, 137, 0.2);
    .equity-item {
      width: 33%;
      text-align: center;
      margin-bottom: 30upx;
      .logo {
        margin: 0 auto;
        width: 100upx;
        height: 100upx;
        background: linear-gradient(180deg, #69707c 0%, #383d46 100%);
        border-radius: 100%;
        background-image: url('../../static/newWorkout/equity2.svg');
        background-size: contain;
        background-repeat: no-repeat;
      }
      .des {
        margin-top: 10upx;
        font-size: 24upx;
        font-weight: 400;
        color: #bdc3ce;
        line-height: 34upx;
      }
      &:nth-child(2) .logo {
        background-image: url('../../static/newWorkout/equity1.svg');
      }
      &:nth-child(3) .logo {
        background-image: url('../../static/newWorkout/equity3.svg');
      }
      &:nth-child(4) .logo {
        background-image: url('../../static/newWorkout/equity4.svg');
      }
      &:nth-child(5) .logo {
        background-image: url('../../static/newWorkout/equity5.svg');
      }
      &:nth-child(6) .logo {
        background-image: url('../../static/newWorkout/equity6.svg');
      }
    }
  }
  .footer-button {
    position: fixed;
    bottom: var(--window-bottom);
    left: 0;
    right: 0;
    z-index: 1;
    padding: 20upx 30upx;
    background: #383d46;
    display: flex;
    justify-content: space-between;
    .text-box {
      text-align: center;
      margin-right: 44upx;
      width: 160upx;
      .yuan {
        font-size: 32upx;
        font-weight: 600;
        color: #ffe18f;
        line-height: 44upx;
      }
      .des {
        margin-top: 10upx;
        font-size: 24upx;
        font-weight: 400;
        color: #bdc3ce;
        line-height: 28upx;
        text-decoration: line-through;
      }
    }
    .van-button {
      width: 485upx;
      height: 90upx;
      background: linear-gradient(173deg, #fff3d3 0%, #ffe6a1 100%);
      border-radius: 16upx;
      color: #90633a;
      font-weight: 600;
      border: none;
      font-size: 32upx;
    }
  }
  .contact-customer-box {
    padding: 0 30upx;
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
  .recommend-box {
    margin-top: 30upx;
    background: rgba(56, 61, 70, 0.6);
    border-radius: 24upx;
    overflow: hidden;
  }
  .recommend {
    .van-cell {
      background: rgba(56, 61, 70, 0.6);
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
        &.air-config {
          background: url('../../static/newWorkout/air-config.svg');
          background-size: contain;
          background-repeat: no-repeat;
        }
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
  .payment-action-sheet {
    background: #383d46;
    border-radius: 24upx 24upx 0 0;
    .title {
      padding: 40upx;
      padding-bottom: 80upx;
      font-size: 36upx;
      font-weight: 600;
      color: #f4f7ff;
    }
    .actions {
      display: flex;
      justify-content: space-between;
      padding: 0 148upx 148upx;
      .action {
        .img {
          width: 100upx;
          height: 100upx;
        }
        .text {
          text-align: center;
          margin-top: 20upx;
          font-size: 28upx;
          color: #f4f7ff;
        }
        .img:hover {
          opacity: 0.6;
        }
      }
    }
  }
}

::v-deep .van-popup {
  background: #383d46;
  border-radius: 24upx 24upx 0 0;
}
.payment-action-sheet {
  .title {
    padding: 40upx;
    padding-bottom: 80upx;
    font-size: 36upx;
    font-weight: 600;
    color: #f4f7ff;
  }
  .actions {
    display: flex;
    justify-content: space-between;
    padding: 0 148upx 148upx;
    .action {
      .img {
        width: 100upx;
        height: 100upx;
      }
      .text {
        text-align: center;
        margin-top: 20upx;
        font-size: 28upx;
        color: #f4f7ff;
      }
    }
  }
}
</style>

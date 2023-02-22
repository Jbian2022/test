<template>
  <!-- 这里是状态栏 -->
  <!--  	<view class="status_bar" style="background: red;">
	</view> -->
  <view class="move_area_style">
    <movable-area>
      <view class="content_style">
        <BgTheamCompontent :theamType="'currency'"></BgTheamCompontent>

        <view class="header_style">
          <view class="header_left_style">
            <view class="left_content_style">
              <image
                class="left_content_img_style"
                v-if="avatar"
                :src="avatar"
              ></image>
              <image
                class="left_content_img_style"
                v-else
                src="../../static/app-plus/mebrs/defaultAvator.png"
              ></image>
              <view class="left_header_style">我的会员</view>
              <view class="left_num_style">{{ meberList.length }}</view>
            </view>
          </view>
          <view class="header_right_style">
            <image
              class="right_img_style"
              src="../../static/app-plus/mebrs/fangdajing.svg"
              @click.native="jumpQuery"
            ></image>
          </view>
        </view>

        <view class="is_buy_style">
          <view
            class="buy_left"
            :class="isActive === 1 ? 'active' : ''"
            @click.native.stop="buyClick(1)"
            >已购课</view
          >
          <view
            class="buy_right"
            :class="isActive === 0 ? 'active' : ''"
            @click.native="buyClick(0)"
            >未购课</view
          >
        </view>
        <!-- <view class="zhan_wei_style" v-if="searchTopFlag"></view> -->
        <!--内容 start-->
        <!-- <scroll-view
          scroll-top="0"
          scroll-y="true"
          class="scroller-y-style"
          @scrolltoupper="upper"
          @scrolltolower="lower"
          @scroll="scroll"
          :upper-threshold="50"
          scroll-anchoring="true"
        > -->
        <view class="member_scroll_style">
          <MemberList
            ref="memberListDom"
            :isActive="isActive"
            :type="'home'"
            :page="page"
            :currentNum="currentNum"
            @getMemberList="getMemberList"
            :userInfo="userInfo"
            :termOfValidity="termOfValidity"
          ></MemberList>
        </view>
        <!-- </scroll-view> -->
      </view>

      <movable-view direction="all" inertia>
        <view class="btn_add" :class="loginNum == 0 ? 'guid_style' : ''">
          <view class="add_style">
            <image
              class="add_img_style"
              src="../../static/app-plus/mebrs/add.svg"
              @click.stop="addClick"
            ></image>

            <view>
              <ZbTooltip
                :visible="showPopover"
                :placement="'left'"
                :color="'linear-gradient(180deg, #2BA9FF 0%, #1370FF 100%)'"
                content="Hi～教练你来了
			  点这里添加会员吧"
                :show="true"
              ></ZbTooltip>
            </view>
          </view>
        </view>
      </movable-view>
    </movable-area>
    <uni-popup
      ref="popup"
      type="center"
      mask-background-color="rgba(20, 21, 23, 0.6)"
      class="new_popup_style_outer_style"
      @maskClick="maskClick"
    >
    </uni-popup>
  </view>
</template>

<script>
import BgTheamCompontent from '@/components/bgTheamCompontent/bgTheamCompontent.vue'
import MemberList from '@/components/memberList/memberList.vue'
import ZbTooltip from '@/uni_modules/zb-tooltip/components/zb-tooltip/zb-tooltip.vue'
import moment from 'moment'
export default {
  components: {
    BgTheamCompontent,
    MemberList,
    ZbTooltip
  },
  data() {
    return {
      meberList: [],
      isActive: 1,
      deleteRemarkFlag: false,
      loginNum: 0,
      showPopover: false,
      scrollTop: 0,
      searchTopFlag: false,
      buyTopFlag: false,
      delteIndex: 0,
      avatar: null,
      addUpperLimit: null, // 添加限制
      cocahMemberLimit: 0, //该教练下的学员数量
      page: 10, // 10条
      currentNum: 1, //第一页
      termOfValidity: false, //有效期时间
      userInfo: {}
    }
  },
  onLoad() {
    uni.showTabBar()
  },
  created() {
    this.getUserInfor()
  },
  mounted() {
    let self = this
    this.$nextTick(() => {
      uni.getStorage({
        key: 'loginNum',
        success: function (res) {
          if (res.data) {
            self.loginNum = res.data
            self.showPopover = res.data == '0' ? true : false
            if (res.data == '0') {
              self.$refs.popup.open()
            }
          }
        },
        fail: function (err) {
          console.log(err, '>>>>')
        }
      })

      try {
        const res = uni.getStorageInfoSync()
        let flag = res.keys.indexOf('isActive') !== -1 ? true : false
        if (!flag) {
          try {
            uni.setStorageSync('isActive', '1') // 缓存标签激活信息
            self.isActive = 1
            self.$refs.memberListDom.getMemberList(1)
          } catch (e) {
            // error
          }
        } else {
          uni.getStorage({
            key: 'isActive',
            success: function (res) {
              if (res.data) {
                self.isActive = Number(res.data)
                self.$refs.memberListDom.getMemberList(Number(res.data))
              }
            },
            fail: function (err) {}
          })
        }

        // console.log(res.keys);
        // console.log(res.currentSize);
        // console.log(res.limitSize);
      } catch (e) {
        // error
      }
    })

    // this.getUserInfor()
    this.getCocachList()
    //
  },
  onShow() {
    this.getUserInfor()
  },
  methods: {
    // 获取用户信息
    getUserInfor() {
      const login = uniCloud.importObject('login', {
        customUI: true // 取消自动展示的交互提示界面
      }) //第一步导入云对象
      let self = this
      try {
        login
          .getUserInfoMessage()
          .then((res) => {
            console.log(res, '....')
            self.avatar = res.userInfo.avatar || null
            self.addUpperLimit = res.userInfo.addUpperLimit || null
            // 暂存userInfo信息
            self.userInfo = res.userInfo || {}

            // 获取当前时间
            let currentDay = moment().format('YYYY-MM-DD') // 当前时间
            // 先比较是否相等
            if (res.userInfo.vipEndDate || res.userInfo.vipLevel) {
              let sameTime = moment(currentDay).isSame(res.userInfo.vipEndDate)
              console.log('补药')
              if (sameTime) {
                self.termOfValidity = false
              } else {
                self.termOfValidity = moment(currentDay).isBefore(
                  res.userInfo.vipEndDate
                )
              }
            } else {
              self.termOfValidity = false
            }
          })
          .catch((err) => {})
      } catch (e) {
        //TODO handle the exception
      }
    },
    // 获取该教练的会员数量
    getCocachList() {
      let businessCloudObject = uniCloud.importObject('businessCloudObject', {
        customUI: true // 取消自动展示的交互提示界面
      })
      // businessCloudObject.removeAtion()
      businessCloudObject
        .getCoachMemberList()
        .then((res) => {
          console.log(res, '腻')
          this.cocahMemberLimit = res.affectedDocs
        })
        .catch((err) => {})
    },
    getMemberList(list) {
      this.meberList = list
    },
    onClickPopMenu(item) {
      this.showMenuPop = false
    },
    jumpQuery() {
      console.log(111)

      uni.removeStorage({
        key: 'isActive',
        success: function (res) {
          console.log('success')
        }
      })
      uni.navigateTo({
        url: '/pages/memberQuery/memberQuery',
        success: (res) => {},
        fail: () => {},
        complete: () => {}
      })
    },
    upper: function (e) {
      console.log(e, 'mmm')
    },
    lower: function (e) {
      console.log(e)
    },
    scroll(event) {
      console.log(event.detail.scrollTop, '我是距离')
      this.scrollTop = event.detail.scrollTop
      if (event.detail.scrollTop > 50) {
        this.searchTopFlag = true
      } else {
        this.searchTopFlag = false
      }
      if (event.detail.scrollTop > 95) {
        this.buyTopFlag = true
      } else {
        this.buyTopFlag = false
      }
      return
      // this.searchTopFlag = event.detail.scrollTop > 50 ? true : false
      // console.log( this.scrollTop)
    },

    maskClick() {
      // console.log('拜拜')
      uni.setStorageSync('loginNum', '1')
      this.$refs.popup.close()
      this.showPopover = false
    },

    addClick() {
      // 判断蓝卡会员还是金卡会员
      let businessCloudObject = uniCloud.importObject('businessCloudObject', {
        customUI: true // 取消自动展示的交互提示界面
      })
      let that = this
      businessCloudObject
        .getCoachMemberList()
        .then((res) => {
          console.log(that.termOfValidity, that.userInfo, '你都是咖啡可考虑')
          that.cocahMemberLimit = res.affectedDocs
          if (!that.termOfValidity || !that.userInfo.vipLevel) {
            // 到期了或者 根本没交钱
            if (!that.addUpperLimit && that.cocahMemberLimit >= 7) {
              uni.showToast({
                title: '普通教练限添加7名学员,升级金卡教练获取更多权益~',
                duration: 1000,
                width: 180,
                icon: 'none'
              })
              return
            }
            if (that.addUpperLimit || that.cocahMemberLimit < 7) {
              //
              uni.navigateTo({
                url: '/pages/addMyMebers/addMyMebers',
                success: (res) => {},
                fail: () => {},
                complete: () => {}
              })
            }
            return
          }

          if (that.termOfValidity && that.userInfo.vipLevel) {
            switch (that.userInfo.vipLevel) {
              case 'annualCard':
                // 年卡无限制
                uni.navigateTo({
                  url: '/pages/addMyMebers/addMyMebers',
                  success: (res) => {},
                  fail: () => {},
                  complete: () => {}
                })

                break
              case 'quarterCard':
                if (!that.addUpperLimit && that.cocahMemberLimit >= 100) {
                  uni.showToast({
                    title:
                      '月卡教练限制添加30个会员，升级年卡可无限添加会员哦~',
                    duration: 1000,
                    width: 180,
                    icon: 'none'
                  })
                  return
                }
                if (that.addUpperLimit || that.cocahMemberLimit < 100) {
                  //
                  uni.navigateTo({
                    url: '/pages/addMyMebers/addMyMebers',
                    success: (res) => {},
                    fail: () => {},
                    complete: () => {}
                  })
                }
                break
              case 'monthlyCard':
                if (!that.addUpperLimit && that.cocahMemberLimit >= 30) {
                  uni.showToast({
                    title:
                      '月卡教练限制添加30个会员，升级年卡可无限添加会员哦~',
                    duration: 1000,
                    width: 180,
                    icon: 'none'
                  })
                  return
                }
                if (that.addUpperLimit || that.cocahMemberLimit < 30) {
                  //
                  uni.navigateTo({
                    url: '/pages/addMyMebers/addMyMebers',
                    success: (res) => {},
                    fail: () => {},
                    complete: () => {}
                  })
                }

                break
            }
          }
        })
        .catch((err) => {})
    },
    buyClick(type) {
      this.$nextTick(function () {
        try {
          uni.setStorageSync('isActive', String(type)) // 缓存标签激活信息
        } catch (e) {
          // error
        }
        this.isActive = type
        this.$refs.memberListDom.getMemberList(type)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.content_style {
  width: 100vw;
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  .header_style {
    width: calc(100vw - 60upx);
    margin-left: 30upx;
    height: 80upx;
    // margin-top: 30upx;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 88upx;
    .header_left_style {
      // width: 50%;
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
          // margin-left: 30upx;
        }
        .left_header_style {
          font-size: 48upx;

          font-weight: 600;
          color: #ffffff;
        }
        .left_num_style {
          margin-left: 16upx;
          width: 50upx;
          height: 50upx;
          background: #454951;
          border-radius: 16upx;
          line-height: 50upx;
          text-align: center;
          font-size: 28upx;

          font-weight: 500;
          color: #bdc3ce;
        }
      }
    }
    .header_right_style {
      height: 80upx;
      display: flex;
      align-items: center;

      .right_img_style {
        width: 48.59upx;
        height: 48.59upx;
      }
    }
  }

  .is_buy_style {
    width: calc(100vw - 60upx);
    height: 82upx;
    margin-left: 30upx;
    display: flex;
    align-items: center;
    margin-top: 36upx;

    .buy_left {
      width: 50%;
      height: 100%;
      text-align: center;
      background: #383d46;
      line-height: 82upx;
      color: #fff;

      border-radius: 200upx 0px 0px 200upx;
    }
    .buy_right {
      width: 50%;
      height: 100%;
      color: #fff;
      line-height: 82upx;
      text-align: center;
      background: #383d46;
      border-radius: 0px 200upx 200upx 0px;
    }
    .active {
      background: #1370ff;
      color: #fff;
      font-weight: 600 !important;
    }
  }
  .member_scroll_style {
    overflow-x: hidden;
    overflow-y: auto;
  }
  .guid_style {
    z-index: 2200;
  }
}
.slot-button {
  width: 100upx !important;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  .slot_btn_img_style {
    width: 100upx;
    height: 100upx;
  }
}

.confirm_dakuang_style {
  width: calc(100vw - 60upx);
  margin-left: 30upx;
  height: 420upx;
  background: #383d46;
  border-radius: 24px;
  .confirm_top_style {
    width: calc(100% - 100upx);
    margin-left: 50upx;
    padding-top: 50upx;
    display: flex;
    align-items: center;
    font-size: 52upx;
    color: #f4f7ff;
    .delete_waring_style {
      width: 57upx;
      height: 48upx;
    }
  }
  .delet_remark {
    width: calc(100% - 100upx);
    margin-left: 50upx;
    font-size: 30upx;

    font-weight: 400;
    color: #bdc3ce;
    margin-top: 30upx;
  }
  .delete_btn_style {
    width: calc(100% - 100upx);
    margin-left: 50upx;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 80upx;
    .delete_cacel_style {
      width: 240upx;
      height: 90upx;
      background: #454951;
      border-radius: 16upx;
      font-size: 32upx;
      font-weight: 600;
      color: #ffffff;
      text-align: center;
      line-height: 90upx;
    }
    .delete_sure_style {
      width: 240upx;
      height: 90upx;
      background: #1370ff;
      border-radius: 16px;
      backdrop-filter: blur(18px);
      font-size: 32upx;
      font-weight: 600;
      color: #ffffff;
      text-align: center;
      line-height: 90upx;
    }
  }
}

uni-app,
uni-page,
uni-page-wrapper,
uni-page-body {
  height: calc(100vh - 50px);
}
::v-deep.van-popover__wrapper {
  width: 100%;
  height: 100% !important;
}
::v-deep .van-popover__content {
  width: 322upx;
  height: 150upx;
  background: linear-gradient(180deg, #2ba9ff 0%, #1370ff 100%);
}
.pop_tips_style {
  font-size: 30upx;
  font-weight: 600;
  color: #f4f7ff;
  padding-left: 36upx;
}
.pad_style {
  padding-top: 34upx;
}
::v-deep .van-overlay {
  background: #141517 !important;
  opacity: 0.8;
}
.celling_animation_style {
  position: sticky !important;
  left: 0;
  top: var(--status-bar-height) !important;
  // margin-top: var(--status-bar-height) !important;
  width: 100vw !important;
  background: #212328;
  z-index: 3000;
  animation-duration: 0.2s;
  margin-left: 0 !important;
  padding-top: 20upx;
  padding-bottom: 20upx;
  .buy_left {
    margin-left: 30upx;
  }
  .buy_right {
    margin-right: 30upx;
  }
}
.search_anmition_style {
  animation-name: seachAnmation;
  position: fixed !important;
  right: 30upx;
  z-index: 3003;
  animation-duration: 0.5s;
  top: 20upx;
}
@keyframes seachAnmation {
  0% {
    top: -80upx;
  }

  100% {
    top: 20upx;
  }
}
@keyframes cellingAnmation {
  0% {
    top: -45upx;
  }

  100% {
    //
    top: 0upx;
  }
}

// uni-scroll-view {
//   height: 100% !important;
// }
.scroller-y-style {
  height: calc(100vh - var(--window-top)) !important;
}
::v-deep.uni-scroll-view-content {
  // height: auto !important;
}
.move_area_style {
  width: 100vw;
  height: 100%;
  overflow: hidden;
  box-sizing: border-box;
}
::v-deep uni-movable-area {
  width: calc(100vw - 130upx);
  height: 100%;
}
::v-deep uni-movable-view {
  left: calc(100vw - 150upx) !important;
  top: calc(100vh - (50px + 30upx + 130upx));
}
.btn_add {
  width: 130upx;
  height: 130upx;
  position: relative;
  z-index: 1000;
  // position: absolute;
  // right: 30upx;
  // bottom: calc(50px + 30upx);
  .add_style {
    width: 130upx;
    height: 100%;
    .add_img_style {
      width: 130upx;
      height: 100%;
      border-radius: 50%;
      object-fit: contain;
      z-index: 1000000;
    }
  }
}
.zhan_wei_style {
  height: 82upx;
  width: 100%;
}
.updatePopup {
  width: 100vw;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  background: rgba(20, 21, 23, 0.6);
  z-index: 90000;
}
::v-deep .uni-popup [name='mask'] {
  backdrop-filter: blur(3px);
}
::v-deep .new_popup_style_outer_style {
  position: relative !important;
  z-index: 1000;
}
::v-deep uni-movable-view {
  z-index: 1001 !important;
  height: auto !important;
}
</style>

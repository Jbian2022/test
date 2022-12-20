
<script>
import initApp from '@/common/appInit.js'
// import openApp from '@/common/openApp.js'
// import checkIsAgree from '@/pages/uni-agree/utils/uni-agree.js'
// import uniIdPageInit from '@/uni_modules/uni-id-pages/init.js'
export default {
  // globalData: {
  //   searchText: '',
  //   appVersion: {},
  //   config: {},
  //   $i18n: {},
  //   $t: {}
  // },
  onLaunch: function () {
    console.log('onLaunch')
    // #ifdef APP
    initApp()
    // #endif
    // #ifdef H5
    // 后台到前台
    console.log('onShow')
    let whiteRouter = [
      '/pages/logining/logining',
      '/pages/verificatioCode/verificatioCode',
      '/pages/agreement/agreement',
      '/pages/personalnformation/personalnformation'
    ]
    if (whiteRouter.indexOf(this.$route.fullPath) !== -1) {
    } else {
      // console.log(this.$route, '我是路由名称')
      // 校验token的合法性每个接口都要加token

      uni.getStorage({
        key: 'uni_id_token',
        success: function (res) {
          // console.log(res, '我是token')
          if (res.data) {
            let login = uniCloud.importObject('login')
            login
              .checkToken(res.data)
              .then((checkTokenRes) => {
                // console.log(checkTokenRes, 'token 换取')
              })
              .catch((err) => {
                console.log(err, '我是错误')
                uni.reLaunch({
                  url: '/pages/logining/logining',
                  success: (res) => {},
                  fail: () => {},
                  complete: () => {}
                })
                uni.clearStorage()
              })
          }
        },
        fail: function (err) {
          uni.reLaunch({
            url: '/pages/logining/logining',
            success: (res) => {},
            fail: () => {},
            complete: () => {}
          })
        }
      })
    }
    // #endif
  },
  onShow: function () {},
  onHide: function () {
    console.log('onHide')
  }
}
</script>

<style>
/*每个页面公共css */
.need_bg_style {
  width: 100vw;
  height: 100vh;
  position: relative;
  overflow: hidden;
}
.status_bar {
  height: var(--status-bar-height);
  width: 100%;
}
/* uni-modal {
	display: none !important;
} */
</style>

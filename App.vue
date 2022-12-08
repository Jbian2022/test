
<script>
// import initApp from '@/common/appInit.js'
// import openApp from '@/common/openApp.js'
// // #ifdef H5
// // openApp() //创建在h5端全局悬浮引导用户下载app的功能
// // #endif
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
    // 路由判断
    // 设置白名单
    // this.globalData.$i18n = this.$i18n
    // this.globalData.$t = (str) => this.$t(str)
    // initApp()
    // uniIdPageInit()
    // #ifdef APP-PLUS
    //checkIsAgree(); APP端暂时先用原生默认生成的。目前，自定义方式启动vue界面时，原生层已经请求了部分权限这并不符合国家的法规
    // #endif
    // #ifdef H5
    // checkIsAgree(); // 默认不开启。目前全球，仅欧盟国家有网页端同意隐私权限的需要。如果需要可以自己去掉注视后生效
    // #endif
    // #ifdef APP-PLUS
    //idfa有需要的用户在应用首次启动时自己获取存储到storage中
    /*var idfa = '';
			var manager = plus.ios.invoke('ASIdentifierManager', 'sharedManager');
			if(plus.ios.invoke(manager, 'isAdvertisingTrackingEnabled')){
				var identifier = plus.ios.invoke(manager, 'advertisingIdentifier');
				idfa = plus.ios.invoke(identifier, 'UUIDString');
				plus.ios.deleteObject(identifier);
			}
			plus.ios.deleteObject(manager);
			console.log('idfa = '+idfa);*/
    // #endif
  },
  onShow: function () {
    // 后台到前台
    console.log('onShow')
    let whiteRouter = [
      '/pages/logining/logining',
      '/pages/verificatioCode/verificatioCode',
      '/pages/agreement/agreement'
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
  },
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
/* uni-modal {
	display: none !important;
} */
</style>

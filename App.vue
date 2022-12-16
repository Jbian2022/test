
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
    initApp()
  },
  onShow: function () {
  
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
 .status_bar {
        height: var(--status-bar-height);
        width: 100%;
    }
/* uni-modal {
	display: none !important;
} */
</style>

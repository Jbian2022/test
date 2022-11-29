
  ;(function(){
  let u=void 0,isReady=false,onReadyCallbacks=[],isServiceReady=false,onServiceReadyCallbacks=[];
  const __uniConfig = {"pages":[],"globalStyle":{"backgroundColor":"#212328","enablePullDownRefresh":false,"rpxCalcMaxDeviceWidth":375,"rpxCalcBaseDeviceWidth":375,"navigationBar":{"backgroundColor":"#212328","titleText":"uni-starter","type":"default","titleColor":"#000000"},"isNVue":false},"nvue":{"compiler":"uni-app","styleCompiler":"uni-app","flex-direction":"column"},"renderer":"auto","appname":"健身APP","splashscreen":{"alwaysShowBeforeRender":true,"autoclose":true},"compilerVersion":"3.6.5","entryPagePath":"pages/myMebers/myMebers","entryPageQuery":"","realEntryPagePath":"","networkTimeout":{"request":60000,"connectSocket":60000,"uploadFile":60000,"downloadFile":60000},"tabBar":{"position":"bottom","color":"#7A7E83","selectedColor":"#fff","borderStyle":"black","blurEffect":"none","fontSize":"10px","iconWidth":"24px","spacing":"3px","height":"50px","backgroundColor":"#212328","list":[{"pagePath":"pages/myMebers/myMebers","iconPath":"/static/tabbar/noactivemeber.svg","selectedIconPath":"/static/tabbar/activemeber.svg","text":"会员"},{"pagePath":"pages/grid/grid","iconPath":"/static/tabbar/noactiveaction.svg","selectedIconPath":"/static/tabbar/activeaction.svg","text":"动作库"},{"pagePath":"pages/ucenter/ucenter","iconPath":"/static/tabbar/noactiveme.svg","selectedIconPath":"/static/tabbar/activeMe.svg","text":"我的"}],"selectedIndex":0,"shown":true},"locales":{}};
  const __uniRoutes = [{"path":"pages/myMebers/myMebers","meta":{"isQuit":true,"isEntry":true,"isTabBar":true,"tabBarIndex":0,"navigationBar":{"style":"custom","type":"default"},"isNVue":false}},{"path":"uni_modules/uni-feedback/pages/opendb-feedback/opendb-feedback","meta":{"enablePullDownRefresh":false,"navigationBar":{"titleText":"意见反馈","type":"default"},"isNVue":false}},{"path":"uni_modules/uni-id-pages/pages/userinfo/deactivate/deactivate","meta":{"navigationBar":{"titleText":"注销账号","type":"default"},"isNVue":false}},{"path":"uni_modules/uni-id-pages/pages/userinfo/userinfo","meta":{"navigationBar":{"titleText":"个人资料","type":"default"},"isNVue":false}},{"path":"uni_modules/uni-id-pages/pages/userinfo/bind-mobile/bind-mobile","meta":{"navigationBar":{"titleText":"绑定手机号码","type":"default"},"isNVue":false}},{"path":"uni_modules/uni-id-pages/pages/userinfo/cropImage/cropImage","meta":{"navigationBar":{"titleText":"","type":"default"},"isNVue":false}},{"path":"uni_modules/uni-id-pages/pages/login/login-withoutpwd","meta":{"navigationBar":{"titleText":"","type":"default"},"isNVue":false}},{"path":"uni_modules/uni-id-pages/pages/login/login-withpwd","meta":{"navigationBar":{"titleText":"","type":"default"},"isNVue":false}},{"path":"uni_modules/uni-id-pages/pages/login/login-smscode","meta":{"navigationBar":{"titleText":"手机验证码登录","type":"default"},"isNVue":false}},{"path":"uni_modules/uni-id-pages/pages/register/register","meta":{"navigationBar":{"titleText":"注册","type":"default"},"isNVue":false}},{"path":"uni_modules/uni-id-pages/pages/retrieve/retrieve","meta":{"navigationBar":{"titleText":"重置密码","type":"default"},"isNVue":false}},{"path":"uni_modules/uni-id-pages/pages/common/webview/webview","meta":{"enablePullDownRefresh":false,"navigationBar":{"titleText":"","type":"default"},"isNVue":false}},{"path":"uni_modules/uni-id-pages/pages/userinfo/change_pwd/change_pwd","meta":{"enablePullDownRefresh":false,"navigationBar":{"titleText":"修改密码","type":"default"},"isNVue":false}},{"path":"uni_modules/uni-id-pages/pages/register/register-by-email","meta":{"navigationBar":{"titleText":"邮箱验证码注册","type":"default"},"isNVue":false}},{"path":"uni_modules/uni-id-pages/pages/retrieve/retrieve-by-email","meta":{"navigationBar":{"titleText":"通过邮箱重置密码","type":"default"},"isNVue":false}},{"path":"uni_modules/uni-id-pages/pages/register/register-admin","meta":{"navigationBar":{"titleText":"注册管理员账号","type":"default"},"isNVue":false}},{"path":"pages/addMyMebers/addMyMebers","meta":{"enablePullDownRefresh":false,"navigationBar":{"titleText":"","type":"default"},"isNVue":false}},{"path":"pages/bodyAssessment/bodyAssessment","meta":{"enablePullDownRefresh":false,"navigationBar":{"titleText":"体测评估","type":"default"},"isNVue":false}},{"path":"pages/bodyTestReport/bodyTestReport","meta":{"enablePullDownRefresh":false,"navigationBar":{"titleText":"体测报告","type":"default"},"isNVue":false}},{"path":"pages/dynamicEvaluation/dynamicEvaluation","meta":{"enablePullDownRefresh":false,"navigationBar":{"titleText":"动态评估","type":"default"},"isNVue":false}},{"path":"pages/physicalAssessment/physicalAssessment","meta":{"enablePullDownRefresh":false,"navigationBar":{"titleText":"身体评测","type":"default"},"isNVue":false}},{"path":"pages/healthQuesson/healthQuesson","meta":{"enablePullDownRefresh":false,"navigationBar":{"titleText":"健康问答","type":"default"},"isNVue":false}},{"path":"pages/physicalFitnessAssessment/physicalFitnessAssessment","meta":{"enablePullDownRefresh":false,"navigationBar":{"titleText":"体能评估","type":"default"},"isNVue":false}},{"path":"pages/logining/logining","meta":{"enablePullDownRefresh":false,"navigationBar":{"titleText":"","type":"default"},"isNVue":false}},{"path":"pages/verificatioCode/verificatioCode","meta":{"enablePullDownRefresh":false,"navigationBar":{"titleText":"","type":"default"},"isNVue":false}},{"path":"pages/personalnformation/personalnformation","meta":{"enablePullDownRefresh":false,"navigationBar":{"titleText":"","type":"default"},"isNVue":false}}].map(uniRoute=>(uniRoute.meta.route=uniRoute.path,__uniConfig.pages.push(uniRoute.path),uniRoute.path='/'+uniRoute.path,uniRoute));
  __uniConfig.styles=[];//styles
  __uniConfig.onReady=function(callback){if(__uniConfig.ready){callback()}else{onReadyCallbacks.push(callback)}};Object.defineProperty(__uniConfig,"ready",{get:function(){return isReady},set:function(val){isReady=val;if(!isReady){return}const callbacks=onReadyCallbacks.slice(0);onReadyCallbacks.length=0;callbacks.forEach(function(callback){callback()})}});
  __uniConfig.onServiceReady=function(callback){if(__uniConfig.serviceReady){callback()}else{onServiceReadyCallbacks.push(callback)}};Object.defineProperty(__uniConfig,"serviceReady",{get:function(){return isServiceReady},set:function(val){isServiceReady=val;if(!isServiceReady){return}const callbacks=onServiceReadyCallbacks.slice(0);onServiceReadyCallbacks.length=0;callbacks.forEach(function(callback){callback()})}});
  service.register("uni-app-config",{create(a,b,c){if(!__uniConfig.viewport){var d=b.weex.config.env.scale,e=b.weex.config.env.deviceWidth,f=Math.ceil(e/d);Object.assign(__uniConfig,{viewport:f,defaultFontSize:16})}return{instance:{__uniConfig:__uniConfig,__uniRoutes:__uniRoutes,global:u,window:u,document:u,frames:u,self:u,location:u,navigator:u,localStorage:u,history:u,Caches:u,screen:u,alert:u,confirm:u,prompt:u,fetch:u,XMLHttpRequest:u,WebSocket:u,webkit:u,print:u}}}}); 
  })();
  
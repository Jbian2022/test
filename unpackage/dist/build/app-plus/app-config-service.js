
  ;(function(){
  let u=void 0,isReady=false,onReadyCallbacks=[],isServiceReady=false,onServiceReadyCallbacks=[];
  const __uniConfig = {"pages":[],"globalStyle":{"backgroundColor":"#212328","enablePullDownRefresh":false,"rpxCalcMaxDeviceWidth":375,"rpxCalcBaseDeviceWidth":375,"titleNView":false,"navigationBar":{"backgroundColor":"#212328","titleText":"uni-starter","type":"default","style":"custom","titleColor":"#000000"},"isNVue":false},"nvue":{"compiler":"uni-app","styleCompiler":"uni-app","flex-direction":"column"},"renderer":"auto","appname":"健变","splashscreen":{"alwaysShowBeforeRender":true,"autoclose":true},"compilerVersion":"3.6.15","entryPagePath":"pages/myMebers/myMebers","entryPageQuery":"","realEntryPagePath":"","networkTimeout":{"request":60000,"connectSocket":60000,"uploadFile":60000,"downloadFile":60000},"tabBar":{"position":"bottom","color":"#7A7E83","selectedColor":"#fff","borderStyle":"black","blurEffect":"none","fontSize":"10px","iconWidth":"24px","spacing":"3px","height":"50px","backgroundColor":"#212328","list":[{"pagePath":"pages/myMebers/myMebers","iconPath":"/static/tabbar/noactivemeber.png","selectedIconPath":"/static/tabbar/activemeber.png","text":"会员"},{"pagePath":"pages/actionLibrary/index","iconPath":"/static/tabbar/noactiveaction.png","selectedIconPath":"/static/tabbar/activeaction.png","text":"动作库"},{"pagePath":"pages/my/my","iconPath":"/static/tabbar/noactiveme.png","selectedIconPath":"/static/tabbar/activeMe.png","text":"我的"}],"selectedIndex":0,"shown":true},"locales":{},"darkmode":false,"themeConfig":{}};
  const __uniRoutes = [{"path":"pages/myMebers/myMebers","meta":{"isQuit":true,"isEntry":true,"isTabBar":true,"tabBarIndex":0,"enablePullDownRefresh":true,"onReachBottomDistance":100,"autoBackButton":false,"titleNView":false,"navigationBar":{"titleText":"我的会员","style":"custom","type":"default","titleColor":"#ffffff"},"isNVue":false}},{"path":"pages/addMyMebers/addMyMebers","meta":{"enablePullDownRefresh":false,"autoBackButton":false,"titleNView":false,"navigationBar":{"titleText":"添加学员","style":"custom","type":"default","titleColor":"#ffffff"},"isNVue":false}},{"path":"pages/memberQuery/memberQuery","meta":{"enablePullDownRefresh":false,"autoBackButton":false,"titleNView":false,"navigationBar":{"titleText":"","style":"custom","type":"default","titleColor":"#ffffff"},"isNVue":false}},{"path":"pages/postureAssessment/postureAssessment","meta":{"enablePullDownRefresh":false,"autoBackButton":false,"titleNView":false,"navigationBar":{"titleText":"体测评估","style":"custom","type":"default","titleColor":"#ffffff"},"isNVue":false}},{"path":"pages/bodyTestReport/bodyTestReport","meta":{"enablePullDownRefresh":false,"autoBackButton":false,"titleNView":false,"navigationBar":{"titleText":"体测报告","style":"custom","type":"default","titleColor":"#ffffff"},"isNVue":false}},{"path":"pages/physicalAssessment/physicalAssessment","meta":{"enablePullDownRefresh":false,"autoBackButton":false,"titleNView":false,"navigationBar":{"titleText":"身体评测","style":"custom","type":"default","titleColor":"#ffffff"},"isNVue":false}},{"path":"pages/healthQuesson/healthQuesson","meta":{"enablePullDownRefresh":false,"autoBackButton":false,"titleNView":false,"navigationBar":{"titleText":"健康问答","style":"custom","type":"default","titleColor":"#ffffff"},"isNVue":false}},{"path":"pages/physicalFitnessAssessment/physicalFitnessAssessment","meta":{"enablePullDownRefresh":false,"autoBackButton":false,"titleNView":false,"navigationBar":{"titleText":"体能评估","style":"custom","type":"default","titleColor":"#ffffff"},"isNVue":false}},{"path":"pages/logining/logining","meta":{"enablePullDownRefresh":false,"autoBackButton":false,"navigationBar":{"titleText":"","style":"custom","type":"default"},"isNVue":false}},{"path":"pages/verificatioCode/verificatioCode","meta":{"enablePullDownRefresh":false,"autoBackButton":false,"titleNView":false,"navigationBar":{"titleText":"","style":"custom","type":"default","titleColor":"#ffffff"},"isNVue":false}},{"path":"pages/personalnformation/personalnformation","meta":{"enablePullDownRefresh":false,"titleNView":false,"navigationBar":{"titleText":"","style":"custom","type":"default","titleColor":"#ffffff"},"isNVue":false}},{"path":"pages/actionLibrary/index","meta":{"isQuit":true,"isTabBar":true,"tabBarIndex":1,"enablePullDownRefresh":false,"autoBackButton":false,"titleNView":false,"navigationBar":{"titleText":"动作库","style":"custom","type":"default","titleColor":"#ffffff"},"isNVue":false}},{"path":"pages/addAction/index","meta":{"enablePullDownRefresh":false,"autoBackButton":false,"titleNView":false,"navigationBar":{"titleText":"新增动作","style":"custom","type":"default","titleColor":"#ffffff"},"isNVue":false}},{"path":"pages/newWorkout/newWorkout","meta":{"enablePullDownRefresh":false,"autoBackButton":false,"titleNView":false,"navigationBar":{"titleText":"新建训练","style":"custom","type":"default","titleColor":"#ffffff"},"isNVue":false}},{"path":"pages/trainingRecord/trainingRecord","meta":{"enablePullDownRefresh":false,"autoBackButton":false,"titleNView":false,"navigationBar":{"titleText":"训练记录","style":"custom","type":"default","titleColor":"#ffffff"},"isNVue":false}},{"path":"pages/trainingRecordDetail/trainingRecordDetail","meta":{"enablePullDownRefresh":false,"autoBackButton":false,"titleNView":false,"navigationBar":{"titleText":"训练记录详情","style":"custom","type":"default","titleColor":"#ffffff"},"isNVue":false}},{"path":"pages/my/my","meta":{"isQuit":true,"isTabBar":true,"tabBarIndex":2,"enablePullDownRefresh":false,"autoBackButton":false,"titleNView":false,"navigationBar":{"titleText":"我的","style":"custom","type":"default","titleColor":"#ffffff"},"isNVue":false}},{"path":"pages/openCard/openCard","meta":{"enablePullDownRefresh":false,"autoBackButton":false,"titleNView":false,"navigationBar":{"titleText":"开卡","style":"custom","type":"default","titleColor":"#ffffff"},"isNVue":false}},{"path":"pages/setUp/setUp","meta":{"enablePullDownRefresh":false,"autoBackButton":false,"titleNView":false,"navigationBar":{"titleText":"设置","style":"custom","type":"default","titleColor":"#ffffff"},"isNVue":false}},{"path":"pages/personalInfo/personalInfo","meta":{"enablePullDownRefresh":false,"autoBackButton":false,"titleNView":false,"navigationBar":{"titleText":"个人信息","style":"custom","type":"default","titleColor":"#ffffff"},"isNVue":false}},{"path":"pages/updateSignature/updateSignature","meta":{"enablePullDownRefresh":false,"autoBackButton":false,"titleNView":false,"navigationBar":{"titleText":"修改签名","style":"custom","type":"default","titleColor":"#ffffff"},"isNVue":false}},{"path":"pages/dynamicEvaluation/actionEvaluation/actionEvaluation","meta":{"enablePullDownRefresh":false,"titleNView":false,"navigationBar":{"titleText":"","type":"default","style":"custom","titleColor":"#ffffff"},"isNVue":false}},{"path":"pages/dynamicEvaluation/dynamicEvaluation","meta":{"enablePullDownRefresh":false,"titleNView":false,"navigationBar":{"titleText":"","type":"default","style":"custom","titleColor":"#ffffff"},"isNVue":false}},{"path":"pages/physicalFitnessAssessment/actionEvaluation/actionEvaluation","meta":{"enablePullDownRefresh":false,"titleNView":false,"navigationBar":{"titleText":"","type":"default","style":"custom","titleColor":"#ffffff"},"isNVue":false}},{"path":"pages/viewReport/viewReport","meta":{"enablePullDownRefresh":false,"titleNView":false,"navigationBar":{"titleText":"","type":"default","style":"custom","titleColor":"#ffffff"},"isNVue":false}},{"path":"pages/cancel/cancel","meta":{"enablePullDownRefresh":false,"navigationBar":{"titleText":"","type":"default"},"isNVue":false}},{"path":"pages/cancelAgreement/cancelAgreement","meta":{"enablePullDownRefresh":false,"navigationBar":{"titleText":"","type":"default"},"isNVue":false}}].map(uniRoute=>(uniRoute.meta.route=uniRoute.path,__uniConfig.pages.push(uniRoute.path),uniRoute.path='/'+uniRoute.path,uniRoute));
  __uniConfig.styles=[];//styles
  __uniConfig.onReady=function(callback){if(__uniConfig.ready){callback()}else{onReadyCallbacks.push(callback)}};Object.defineProperty(__uniConfig,"ready",{get:function(){return isReady},set:function(val){isReady=val;if(!isReady){return}const callbacks=onReadyCallbacks.slice(0);onReadyCallbacks.length=0;callbacks.forEach(function(callback){callback()})}});
  __uniConfig.onServiceReady=function(callback){if(__uniConfig.serviceReady){callback()}else{onServiceReadyCallbacks.push(callback)}};Object.defineProperty(__uniConfig,"serviceReady",{get:function(){return isServiceReady},set:function(val){isServiceReady=val;if(!isServiceReady){return}const callbacks=onServiceReadyCallbacks.slice(0);onServiceReadyCallbacks.length=0;callbacks.forEach(function(callback){callback()})}});
  service.register("uni-app-config",{create(a,b,c){if(!__uniConfig.viewport){var d=b.weex.config.env.scale,e=b.weex.config.env.deviceWidth,f=Math.ceil(e/d);Object.assign(__uniConfig,{viewport:f,defaultFontSize:16})}return{instance:{__uniConfig:__uniConfig,__uniRoutes:__uniRoutes,global:u,window:u,document:u,frames:u,self:u,location:u,navigator:u,localStorage:u,history:u,Caches:u,screen:u,alert:u,confirm:u,prompt:u,fetch:u,XMLHttpRequest:u,WebSocket:u,webkit:u,print:u}}}}); 
  })();
  
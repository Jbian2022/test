import{y as e,l as o,m as s,Z as t,E as i,j as n,H as l,J as a,o as c,a as p,w as r,i as g,b as d,d as m,x as u,f as h,U as _,e as y,q as f,C as k,Y as x}from"./index.2d1e5cbb.js";import{_ as b,a as C}from"./nocheck.cb8c6bc5.js";import{_ as w}from"./_plugin-vue_export-helper.cdc0426e.js";const A=w({data:()=>({phone:"",checkFlag:!1,hasWeixinAuth:!1,checkPhone:"",needChecked:!1,platform:e().platform,agreementType:null,hasAppleAuth:!1}),computed:{controlActiveFlag(){console.log(this.phone,"????");let e=!1;return this.phone&&11===this.phone.length&&(e=!0),e}},onLoad(){},mounted(){let o=e().platform;console.log(o,"????")},methods:{jumpAgree(){console.log("11111"),o({url:"/pages/agreement/agreement"})},phoneInput(e){console.log(e,"你tm"),this.phone=e.detail.value},async getSms(){this.agreementType="sms",this.checkFlag?o({url:"/pages/phoneLoging/phoneLoging"}):this.needChecked=!0},agreeContiute(){switch(this.checkFlag=!0,this.needChecked=!1,this.agreementType){case"sms":this.getSms();break;case"wx":if(console.log(plus.runtime.isApplicationExist({pname:"bodybuildingApp.myapp",action:"weixin://"}),"安装微信"),!plus.runtime.isApplicationExist({pname:"bodybuildingApp.myapp",action:"weixin://"}))return void s({title:"未检测到微信应用",duration:1e3,width:180,icon:"none"});this.wxLoginCommon();break;case"apple":this.appleLoginCommon()}},getWeixinCode:()=>new Promise(((e,o)=>{})),appleLoginCommon(){t({provider:"apple",success:async e=>{console.log(e,"什么鬼");const t=i.importObject("login",{customUI:!0});try{let s=await t.verifyAppleIdentityToken(e.appleInfo.identityToken);if(console.log(s,"verifyAppleIdentityTokenRes"),0==s.code){let s=await t.logingByApple(e.appleInfo.identityToken);if(console.log(s,"苹果登陆了"),0==s.code)try{if(n("userInfo",JSON.stringify(s.userInfo)),n("uni_id_token",s.token),n("uid",s.uid),n("tokenExpired",s.tokenExpired),"login"===s.type)return n("loginNum","1"),void l({url:"/pages/myMebers/myMebers"});if("register"===s.type)return n("loginNum","0"),void o({url:"/pages/personalnformation/personalnformation"})}catch(a){return void console.log(a,">>>>>")}}}catch(c){console.log(c,"222",c.Error,c,JSON.stringify(c)),s({title:c.errMsg||c.message,duration:1e3,width:180,icon:"none"})}},fail:function(e){a({showCancel:!1,content:"苹果登录失败，请稍后再试"})}})},loginByApple(){this.agreementType="apple",this.checkFlag?this.haAuth&&this.appleLoginCommon():this.needChecked=!0},loginByWeixin(){if(this.agreementType="wx",this.checkFlag){if(console.log(plus.runtime.isApplicationExist({pname:"bodybuildingApp.myapp",action:"weixin://"}),"安装微信"),!plus.runtime.isApplicationExist({pname:"bodybuildingApp.myapp",action:"weixin://"}))return void s({title:"未检测到微信应用",duration:1e3,width:180,icon:"none"});this.wxLoginCommon()}else this.needChecked=!0},wxLoginCommon(){this.getWeixinCode().then((async e=>{console.log(e,"你是谁");const t=i.importObject("login",{customUI:!0});console.log(t,"wxLogin");try{const s=await t.loginByWeixin(e);if(console.log(s,"登录成功"),0==s.code)try{n("userInfo",JSON.stringify(s.userInfo)),n("uni_id_token",s.token),n("uid",s.uid),n("tokenExpired",s.tokenExpired);let e={accessToken:s.accessToken,openid:s.openid},i=await t.getWxSchema(s.unionid);console.log(i,"我是微信的前一步");let a=!1;if(0===i.affectedDocs&&(a=!1),a=!!i.data[0].hasOwnProperty("mobile"),!a)return n("loginNum","0"),n("weixinLoginInfo",JSON.stringify(e)),void o({url:"/pages/bindPhone/bindPhone?scanel=wx"});n("loginNum","1"),l({url:"/pages/myMebers/myMebers"})}catch(a){}}catch(c){s({title:c.errMsg||c.message,duration:1e3,width:180,icon:"none"})}}))}}},[["render",function(e,o,s,t,i,n){const l=f,a=g,w=k,A=x;return c(),p(a,{class:"counter"},{default:r((()=>[d(a,{class:"text"},{default:r((()=>[d(l,{class:"text1",src:"/assets/coach.545924af.png"})])),_:1}),d(a,{class:"middle"},{default:r((()=>[d(a,{class:"wx_icon_login_style",onClick:n.loginByWeixin},{default:r((()=>[d(l,{class:"icon_img_style",src:"https://mp-4e6f1c48-a4dc-4897-a866-0a1a071023c3.cdn.bspapp.com/cloudstorage/10fd0194-0323-410d-be1c-a6df7dab702d.svg"}),d(a,{class:"icon_remark_style"},{default:r((()=>[m("微信快捷登录")])),_:1})])),_:1},8,["onClick"]),"ios"===i.platform?(c(),p(a,{key:0,class:"apple_icon_login_style wx_icon_login_style",onClick:n.loginByApple},{default:r((()=>[d(l,{class:"icon_img_style apple_img_style",src:"/assets/apple.adf9e9fe.svg"}),d(a,{class:"icon_remark_style"},{default:r((()=>[m("Apple账号登录")])),_:1})])),_:1},8,["onClick"])):u("",!0),d(a,{class:"ying_si_style"},{default:r((()=>[d(a,{class:"check_style",onClick:o[0]||(o[0]=e=>i.checkFlag=!i.checkFlag)},{default:r((()=>[i.checkFlag?(c(),p(l,{key:0,class:"check_img_style",src:b})):u("",!0),i.checkFlag?u("",!0):(c(),p(l,{key:1,class:"check_img_style",src:C}))])),_:1}),d(a,{class:"ying_si_remark_dakuang_style"},{default:r((()=>[d(w,{class:"ying_si_remark"},{default:r((()=>[m("同意")])),_:1}),d(w,{class:"ying_si_remark_middle",onClick:h(n.jumpAgree,["stop"])},{default:r((()=>[d(w,{class:"ying_si_jump_style"},{default:r((()=>[m("《用户隐私协议》")])),_:1})])),_:1},8,["onClick"]),d(w,{class:"ying_si_remark"},{default:r((()=>[m("政策并使用本机号码登录")])),_:1})])),_:1}),i.needChecked?(c(),p(a,{key:0,class:"botter_dakuang_style"},{default:r((()=>[d(a,{class:"botter"},{default:r((()=>[d(a,{class:"botter-top"},{default:r((()=>[_("h1",{class:"botter-top1"},"欢迎使用本产品！"),_("h2",{class:"botter-top2"},"welcome"),_("p",{class:"botter-top3"},[m(" 为了更好的保障您的合法权益，在使用本应用之前，请您仔细阅读"),d(w,{style:{color:"#1370ff"},onClick:h(n.jumpAgree,["stop"])},{default:r((()=>[m("《用户隐私协议》")])),_:1},8,["onClick"]),m("，点击同意即表示您已阅读并同意接受我们的服务，感谢您的信任！ ")]),d(A,{class:"botter-top4",onClick:n.agreeContiute},{default:r((()=>[_("span",{class:"botter-top4-text"},"同意并继续")])),_:1},8,["onClick"]),d(a,{class:"botter-top5-text",onClick:o[1]||(o[1]=e=>i.needChecked=!1)},{default:r((()=>[m("不同意")])),_:1})])),_:1})])),_:1})])),_:1})):u("",!0)])),_:1}),d(a,{class:"wx_loging_style"},{default:r((()=>[d(l,{onClick:n.getSms,class:y(["wx_img_style","ios"===i.platform?"common_style":""]),src:"/assets/phonelogin.aaeb75d4.svg"},null,8,["onClick","class"])])),_:1})])),_:1})])),_:1})}],["__scopeId","data-v-731227c5"]]);export{A as default};

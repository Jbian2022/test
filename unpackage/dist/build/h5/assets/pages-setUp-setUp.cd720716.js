import{E as e,l as a,D as s,H as l,a7 as o,o as t,a as n,w as i,i as c,b as d,d as r,f as p,U as u,x as g,p as f,v as m}from"./index.2d1e5cbb.js";import{_}from"./uni-popup.2df5a944.js";import{r as k}from"./uni-app.es.142f3165.js";import{_ as h}from"./_plugin-vue_export-helper.cdc0426e.js";import"./uni-transition.c98c413f.js";const w=e.importObject("login",{customUI:!0});const y=h({data:()=>({isBindValue:"",isAppleBindValue:"",checkFlag:!1,wechatDisplay:!0}),onLoad(){},onShow(){this.getUserMessage()},methods:{appleBind(){},getWeixinCode:()=>new Promise(((e,a)=>{})),async getUserMessage(){let e=this,a=await w.needUserMessage();console.log(a," ....");let s=a.data;s[0].hasOwnProperty("apple_openid")&&(e.wechatDisplay=!1),s.length>0&&s.length>0&&(console.log(3),console.log(s,"needPanduan那棵树的克拉付款了"),s[0].hasOwnProperty("wx_openid")?e.isBindValue="已绑定":e.isBindValue="未绑定")},closeHandle(){this.$refs.popup.close()},async sure(){0==(await w.unbindWeixin()).code&&(this.$refs.popup.close(),this.getUserMessage(),console.log("解绑成功"))},async wxBind(){let e=this;"已绑定"===e.isBindValue&&e.$refs.popup.open(),"未绑定"===e.isBindValue&&e.getWeixinCode().then((async a=>{console.log(a,"我是微信服务商"),0===(await w.bindWeixin(a)).code&&(console.log("绑定成功"),e.getUserMessage())}))},jumpAgree(){a({url:"/pages/agreement/agreement"})},onClickLeft(){s({url:"/pages/my/my"})},async closeAccount(){l({url:"/pages/cancel/cancel"})},async logout(){console.log("开始点了");let a=e.getCurrentUserInfo();if(console.log(a,"currentUserInfo"),a.tokenExpired>0)return await w.logout(),void(await this.remove());0===a.tokenExpired&&await this.remove()},remove(){o(),l({url:"/pages/logining/logining"})}}},[["render",function(e,a,s,l,o,h){const w=c,y=f("van-icon"),b=f("van-cell"),C=f("van-image"),x=f("van-button"),v=k(m("uni-popup"),_);return t(),n(w,{class:"set-up"},{default:i((()=>[d(w,{class:"status_bar"}),d(w,{class:"background-header"}),d(w,{class:"background"}),d(w,{class:"arrow-left",onClick:h.onClickLeft},{default:i((()=>[d(y,{name:"arrow-left"})])),_:1},8,["onClick"]),d(w,{class:"title"},{default:i((()=>[r("设置")])),_:1}),d(w,{class:"form"},{default:i((()=>[d(b,{title:"注销账号","is-link":"",onClick:h.closeAccount},null,8,["onClick"]),d(b,{title:"用户隐私协议","is-link":"",onClick:p(h.jumpAgree,["stop"])},null,8,["onClick"]),o.wechatDisplay?(t(),n(b,{key:0,value:o.isBindValue,"is-link":"",onClick:p(h.wxBind,["stop"])},{title:i((()=>[d(w,{class:"left_wx_style"},{default:i((()=>[d(C,{class:"wx_img_style",src:"https://mp-4e6f1c48-a4dc-4897-a866-0a1a071023c3.cdn.bspapp.com/cloudstorage/10fd0194-0323-410d-be1c-a6df7dab702d.svg"}),u("span",{class:"weixin_title_style"},"微信")])),_:1})])),_:1},8,["value","onClick"])):g("",!0),d(v,{ref:"popup",type:"center","mask-background-color":"rgba(20, 21, 23, 0.6)"},{default:i((()=>[d(w,{class:"dialog"},{default:i((()=>[d(w,{class:"dialog-section"},{default:i((()=>[d(w,{class:"dialog-title"},{default:i((()=>[r("确认解绑")])),_:1}),d(w,{class:"dialog-content"},{default:i((()=>[r("确定要解除账号与微信的关联吗？")])),_:1}),d(w,{class:"dialog-btn-box"},{default:i((()=>[d(x,{type:"default",onClick:h.closeHandle},{default:i((()=>[r("取消")])),_:1},8,["onClick"]),d(x,{type:"primary",onClick:h.sure},{default:i((()=>[r("解除绑定")])),_:1},8,["onClick"])])),_:1})])),_:1})])),_:1})])),_:1},512)])),_:1}),d(x,{class:"footer-btn",block:"",onClick:h.logout},{default:i((()=>[r("退出登录")])),_:1},8,["onClick"])])),_:1})}],["__scopeId","data-v-d73de2ad"]]);export{y as default};
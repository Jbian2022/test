import{E as a,H as s,a7 as e,o as c,a as t,w as l,i as o,b as n,d as i,x as d,U as r,f as u,e as p,p as f,q as _,C as g,v as k}from"./index.2d1e5cbb.js";import{_ as h}from"./uni-popup.2df5a944.js";import{r as b}from"./uni-app.es.142f3165.js";import{_ as m,a as x}from"./nocheck.cb8c6bc5.js";import{_ as C}from"./_plugin-vue_export-helper.cdc0426e.js";import"./uni-transition.c98c413f.js";const j=a.importObject("login");const y=C({data:()=>({checkFlag:!1,showDialog:!1}),onLoad:function(a){a&&"1"===a.agree&&(this.checkFlag=!0)},methods:{back(){s({url:"/pages/setUp/setUp"})},goto(){s({url:"/pages/cancelAgreement/cancelAgreement"})},open(){this.checkFlag&&this.$refs.popup.open()},closeHandle(){this.$refs.popup.close()},async cancel(){await j.closeAccount(),e(),s({url:"/pages/logining/logining"})}},onBackPress:()=>(s({url:"/pages/setUp/setUp"}),!0)},[["render",function(a,s,e,C,j,y){const v=o,F=f("van-icon"),U=_,w=g,A=f("van-button"),H=b(k("uni-popup"),h);return c(),t(v,{class:"cancel"},{default:l((()=>[n(v,{class:"status_bar"}),n(v,{class:"top-bar"},{default:l((()=>[n(F,{name:"arrow-left",onClick:y.back},null,8,["onClick"]),n(v,{class:"title"},{default:l((()=>[i("申请注销账号")])),_:1}),n(v,{class:"zan"},{default:l((()=>[i("00")])),_:1})])),_:1}),n(v,{class:"project-des"},{default:l((()=>[i("为保证您的账号安全，请您在提交申请注销生效前，需要满足并知晓以下内容：")])),_:1}),n(v,{class:"project-box"},{default:l((()=>[n(v,{class:"first-text"},{default:l((()=>[i("1.当账号无已付费会员，无财产纠纷")])),_:1}),n(v,{class:"second-text"},{default:l((()=>[i("请确保所有会员已经服务完成，账号没有任何投诉、违约情况。")])),_:1}),n(v,{class:"first-text"},{default:l((()=>[i("2.当前账号金卡教练权益已到期")])),_:1}),n(v,{class:"second-text"},{default:l((()=>[i("请确保当前账号金卡教练权益已到期。")])),_:1}),n(v,{class:"first-text"},{default:l((()=>[i("3.账号处于安全状态")])),_:1}),n(v,{class:"second-text"},{default:l((()=>[i("账号处于正常使用状态，无被盗风险。")])),_:1}),n(v,{class:"first-text"},{default:l((()=>[i("4.账号权限解除")])),_:1}),n(v,{class:"second-text"},{default:l((()=>[i("账号已解除与其他产品的授权登录或绑定关系。")])),_:1})])),_:1}),n(v,{class:"check-read",onClick:s[0]||(s[0]=a=>j.checkFlag=!j.checkFlag)},{default:l((()=>[n(v,{class:"check-btn"},{default:l((()=>[j.checkFlag?(c(),t(U,{key:0,class:"check_img_style",src:m})):d("",!0),j.checkFlag?d("",!0):(c(),t(U,{key:1,class:"check_img_style",src:x}))])),_:1}),r("div",{class:"check-text"},[i(" 我已阅读并同意"),n(w,{class:"btn",onClick:u(y.goto,["stop"])},{default:l((()=>[i("《账号注销协议》")])),_:1},8,["onClick"])])])),_:1}),n(v,{class:p(["footer-btn van-button",{active:j.checkFlag}]),onClick:y.open},{default:l((()=>[i("确认注销")])),_:1},8,["class","onClick"]),n(H,{ref:"popup",type:"center","mask-background-color":"rgba(20, 21, 23, 0.6)"},{default:l((()=>[n(v,{class:"dialog"},{default:l((()=>[n(v,{class:"dialog-section"},{default:l((()=>[n(v,{class:"dialog-title"},{default:l((()=>[i("是否确认注销")])),_:1}),n(v,{class:"dialog-content"},{default:l((()=>[i("确认删除该账号吗？注销后无法找回！")])),_:1}),n(v,{class:"dialog-btn-box"},{default:l((()=>[n(A,{type:"default",onClick:y.closeHandle},{default:l((()=>[i("取消")])),_:1},8,["onClick"]),n(A,{type:"primary",onClick:y.cancel},{default:l((()=>[i("确认")])),_:1},8,["onClick"])])),_:1})])),_:1})])),_:1})])),_:1},512)])),_:1})}],["__scopeId","data-v-7a041156"]]);export{y as default};
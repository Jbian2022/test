import{E as a,D as s,o as t,a as e,w as l,i as c,b as o,d,t as u,x as n,A as i,B as f,F as r,p as _,e as m,U as p,C as v}from"./index.2d1e5cbb.js";import{_ as y}from"./_plugin-vue_export-helper.cdc0426e.js";const h=a.importObject("my",{customuI:!0});const g=y({data:()=>({show:!1,showPayment:!1,userInfo:{avatar:null,vipLevel:null},cardList:[{hotMsg:"每天1元钱",text:"年卡",money:"365",des:"468",unit:"元/年",activity:"无限会员数",active:!0},{hotMsg:"立省60元",text:"三个月",money:"158",des:"218",unit:"元/季度",activity:"限100个会员",active:!1},{hotMsg:"立省20元",text:"月卡",money:"78",des:"98",unit:"元/月",activity:"限30个会员",active:!1}],hotInfo:{text1:"103",text2:"468元/年"},payMoney:"365"}),onShow(){this.getUserInfo()},methods:{async getUserInfo(){const a=await h.getUserInfo(),{avatar:s,username:t,comment:e,vipLevel:l,vipEndDate:c}=a.data;this.userInfo={avatar:s||null,username:t||null,comment:e||null,vipLevel:l||null,vipEndDate:c||null},console.log(a,88888)},selectCard(a){this.cardList.forEach((a=>a.active=!1)),a.active=!0,this.hotInfo.text1=+a.des-+a.money,this.hotInfo.text2=a.des+a.unit,this.payMoney=a.money},onClickLeft(){s({url:"/pages/my/my"})}}},[["render",function(a,s,y,h,g,x){const b=c,I=_("van-nav-bar"),w=_("van-image"),k=v,L=_("van-button"),C=_("van-action-sheet");return t(),e(b,{class:"open-card"},{default:l((()=>[o(b,{class:"status_bar"}),o(b,{class:"background"}),o(I,{title:"开通金卡教练","left-text":"","left-arrow":"",onClickLeft:x.onClickLeft},null,8,["onClickLeft"]),o(b,{class:"vip-card"},{default:l((()=>[o(b,{class:"left"},{default:l((()=>[o(b,{class:"card-info"},{default:l((()=>[o(b,{class:"user-logo"},{default:l((()=>[o(w,{round:"",src:g.userInfo.avatar},null,8,["src"])])),_:1}),o(b,{class:"card-name"},{default:l((()=>[d("金卡教练")])),_:1}),g.userInfo.vipLevel?(t(),e(b,{key:0,class:"card-status"},{default:l((()=>[d(u(g.userInfo.vipEndDate?"生效中":"失效中"),1)])),_:1})):n("",!0)])),_:1}),o(b,{class:"card-des"},{default:l((()=>[d(u(g.userInfo.vipEndDate?g.userInfo.vipEndDate:"立即续费金卡教练，畅享多项特权~"),1)])),_:1})])),_:1}),o(b,{class:"right"})])),_:1}),o(b,{class:"vip-title"},{default:l((()=>[d("开通金卡教练")])),_:1}),o(b,{class:"card-types-box"},{default:l((()=>[o(b,{class:"card-types"},{default:l((()=>[(t(!0),i(r,null,f(g.cardList,((a,s)=>(t(),e(b,{key:s,class:"type-item-box"},{default:l((()=>[o(b,{class:m(["type-item",{active:a.active}]),onClick:s=>x.selectCard(a)},{default:l((()=>[o(b,{class:"hot-msg"},{default:l((()=>[d(u(a.hotMsg),1)])),_:2},1024),o(b,{class:"text"},{default:l((()=>[d(u(a.text),1)])),_:2},1024),o(b,{class:"money"},{default:l((()=>[d("¥"),o(k,{class:"num"},{default:l((()=>[d(u(a.money),1)])),_:2},1024)])),_:2},1024),o(b,{class:"des"},{default:l((()=>[d(u(a.des)+u(a.unit),1)])),_:2},1024),p("div",{class:"activity"},u(a.activity),1)])),_:2},1032,["class","onClick"])])),_:2},1024)))),128))])),_:1})])),_:1}),o(b,{class:"vip-title"},{default:l((()=>[d("金卡教练权益")])),_:1}),o(b,{class:"equity-box"},{default:l((()=>[o(b,{class:"equity-list"},{default:l((()=>[o(b,{class:"equity-item"},{default:l((()=>[o(b,{class:"logo"}),o(b,{class:"des"},{default:l((()=>[d("金卡权益")])),_:1})])),_:1}),o(b,{class:"equity-item"},{default:l((()=>[o(b,{class:"logo"}),o(b,{class:"des"},{default:l((()=>[d("金卡权益")])),_:1})])),_:1}),o(b,{class:"equity-item"},{default:l((()=>[o(b,{class:"logo"}),o(b,{class:"des"},{default:l((()=>[d("金卡权益")])),_:1})])),_:1}),o(b,{class:"equity-item"},{default:l((()=>[o(b,{class:"logo"}),o(b,{class:"des"},{default:l((()=>[d("金卡权益")])),_:1})])),_:1}),o(b,{class:"equity-item"},{default:l((()=>[o(b,{class:"logo"}),o(b,{class:"des"},{default:l((()=>[d("金卡权益")])),_:1})])),_:1}),o(b,{class:"equity-item"},{default:l((()=>[o(b,{class:"logo"}),o(b,{class:"des"},{default:l((()=>[d("金卡权益")])),_:1})])),_:1})])),_:1})])),_:1}),o(b,{class:"footer-button"},{default:l((()=>[o(b,{class:"text-box"},{default:l((()=>[o(b,{class:"yuan"},{default:l((()=>[d("已省￥"+u(g.hotInfo.text1),1)])),_:1}),o(b,{class:"des"},{default:l((()=>[d(u(g.hotInfo.text2),1)])),_:1})])),_:1}),o(L,{block:"",onClick:s[0]||(s[0]=a=>g.show=!0)},{default:l((()=>[d("确认开通并支付￥"+u(g.payMoney)+"元",1)])),_:1})])),_:1}),o(C,{class:"payment-action-sheet",show:g.show,"onUpdate:show":s[1]||(s[1]=a=>g.show=a)},{default:l((()=>[o(b,{class:"title"},{default:l((()=>[d("选择支付方式")])),_:1}),o(b,{class:"actions"},{default:l((()=>[o(b,{class:"action"},{default:l((()=>[o(w,{class:"img",src:"https://mp-4e6f1c48-a4dc-4897-a866-0a1a071023c3.cdn.bspapp.com/cloudstorage/92897c24-96a3-4bb2-8fb8-44019822af77.svg"}),o(b,{class:"text"},{default:l((()=>[d("支付宝")])),_:1})])),_:1}),o(b,{class:"action"},{default:l((()=>[o(w,{class:"img",src:"https://mp-4e6f1c48-a4dc-4897-a866-0a1a071023c3.cdn.bspapp.com/cloudstorage/ca311552-a492-4e14-b884-cefd7a6cb712.svg"}),o(b,{class:"text"},{default:l((()=>[d("微信")])),_:1})])),_:1})])),_:1})])),_:1},8,["show"])])),_:1})}],["__scopeId","data-v-a7279999"]]);export{g as default};

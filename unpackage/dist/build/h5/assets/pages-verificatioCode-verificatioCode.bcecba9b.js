import{o as t,a as e,w as o,b as s,A as i,F as n,B as a,d as l,t as u,p as c,X as r,i as d,I as h,Y as p,n as m,C as f,J as y,E as g,l as w,k as b,H as S,e as _,q as C,v as V,U as k}from"./index.3c07bbe7.js";import{_ as x}from"./_plugin-vue_export-helper.cdc0426e.js";import{r as v}from"./uni-app.es.2e9f864b.js";const F=x({props:{latticeNum:{type:Number,default:4},latticeSize:{type:Number,default:100},borderStyle:{type:String,default:"border-bottom:1px solid gray;"},borderCheckStyle:{type:String,default:"border: 1px solid red !important;"},inputType:{type:String,default:"number"},blurShow:{type:Boolean,default:!1},ciphertextSty:{type:Number,default:0},updateOne:{type:Boolean,default:!0}},data:()=>({inputValues:"",blurShowLocal:!0}),mounted(){this.blurShowLocal=this.blurShow},methods:{latticeSty(t){let e=this.blurShowLocal&&(this.inputValues.length==t||this.inputValues.length==this.latticeNum&&t==this.latticeNum-1)?this.borderCheckStyle:this.borderStyle;return e+=`;width:${this.latticeSize}rpx;height:${this.latticeSize}rpx`,e},getValue(){return this.inputValues},inputVal(t){console.log(t),this.$emit("inputVerificationChange",this.inputValues)},setVerificationCode(t){t&&(this.inputValues=t)},cleanVal(){this.inputValues=""},latticeFoc(t){},blur(){!this.blurShow&&(this.blurShowLocal=!1)},focus(){!this.blurShow&&(this.blurShowLocal=!0)}}},[["render",function(p,m,f,y,g,w){const b=d,S=h;return t(),e(b,{class:"acqui_verification_code"},{default:o((()=>[s(b,{class:"verification_code_continor"},{default:o((()=>[(t(!0),i(n,null,a(f.latticeNum,((s,a)=>(t(),e(b,{key:a,class:"verification_code_item",onClick:t=>w.latticeFoc(a)},{default:o((()=>[g.inputValues[a]?(t(),i(n,{key:0},[1==f.ciphertextSty?(t(),e(b,{key:0,class:"point"})):(t(),i(n,{key:1},[l(u(2==f.ciphertextSty?"*":g.inputValues[a]),1)],64))],64)):c("",!0)])),_:2},1032,["onClick"])))),128))])),_:1}),r("div",{class:"input_info"},[s(S,{type:f.inputType,modelValue:g.inputValues,"onUpdate:modelValue":m[0]||(m[0]=t=>g.inputValues=t),focus:"",maxlength:f.latticeNum,onInput:w.inputVal,onBlur:w.blur,onFocus:w.focus},null,8,["type","modelValue","maxlength","onInput","onBlur","onFocus"])])])),_:1})}],["__scopeId","data-v-ec35aee8"]]),I={en:{"uni-countdown.day":"day","uni-countdown.h":"h","uni-countdown.m":"m","uni-countdown.s":"s"},"zh-Hans":{"uni-countdown.day":"天","uni-countdown.h":"时","uni-countdown.m":"分","uni-countdown.s":"秒"},"zh-Hant":{"uni-countdown.day":"天","uni-countdown.h":"時","uni-countdown.m":"分","uni-countdown.s":"秒"}},{t:N}=p(I);const D=x({name:"UniCountdown",emits:["timeup"],props:{showDay:{type:Boolean,default:!0},showColon:{type:Boolean,default:!0},start:{type:Boolean,default:!0},backgroundColor:{type:String,default:""},color:{type:String,default:"#333"},fontSize:{type:Number,default:14},splitorColor:{type:String,default:"#333"},day:{type:Number,default:0},hour:{type:Number,default:0},minute:{type:Number,default:0},second:{type:Number,default:0},timestamp:{type:Number,default:0}},data:()=>({timer:null,syncFlag:!1,d:"00",h:"00",i:"00",s:"00",leftTime:0,seconds:0}),computed:{dayText:()=>N("uni-countdown.day"),hourText:t=>N("uni-countdown.h"),minuteText:t=>N("uni-countdown.m"),secondText:t=>N("uni-countdown.s"),timeStyle(){const{color:t,backgroundColor:e,fontSize:o}=this;return{color:t,backgroundColor:e,fontSize:`${o}px`,width:22*o/14+"px",lineHeight:20*o/14+"px",borderRadius:3*o/14+"px"}},splitorStyle(){const{splitorColor:t,fontSize:e,backgroundColor:o}=this;return{color:t,fontSize:12*e/14+"px",margin:o?4*e/14+"px":""}}},watch:{day(t){this.changeFlag()},hour(t){this.changeFlag()},minute(t){this.changeFlag()},second(t){this.changeFlag()},start:{immediate:!0,handler(t,e){if(t)this.startData();else{if(!e)return;clearInterval(this.timer)}}}},created:function(t){this.seconds=this.toSeconds(this.timestamp,this.day,this.hour,this.minute,this.second),this.countDown()},unmounted(){clearInterval(this.timer)},methods:{toSeconds:(t,e,o,s,i)=>t?t-parseInt((new Date).getTime()/1e3,10):60*e*60*24+60*o*60+60*s+i,timeUp(){clearInterval(this.timer),this.$emit("timeup")},countDown(){let t=this.seconds,[e,o,s,i]=[0,0,0,0];t>0?(e=Math.floor(t/86400),o=Math.floor(t/3600)-24*e,s=Math.floor(t/60)-24*e*60-60*o,i=Math.floor(t)-24*e*60*60-60*o*60-60*s):this.timeUp(),e<10&&(e="0"+e),o<10&&(o="0"+o),s<10&&(s="0"+s),i<10&&(i="0"+i),this.d=e,this.h=o,this.i=s,this.s=i},startData(){if(this.seconds=this.toSeconds(this.timestamp,this.day,this.hour,this.minute,this.second),this.seconds<=0)return this.seconds=this.toSeconds(0,0,0,0,0),void this.countDown();clearInterval(this.timer),this.countDown(),this.timer=setInterval((()=>{this.seconds--,this.seconds<0?this.timeUp():this.countDown()}),1e3)},update(){this.startData()},changeFlag(){this.syncFlag||(this.seconds=this.toSeconds(this.timestamp,this.day,this.hour,this.minute,this.second),this.startData(),this.syncFlag=!0)}}},[["render",function(i,n,a,r,h,p){const y=f,g=d;return t(),e(g,{class:"uni-countdown"},{default:o((()=>[a.showDay?(t(),e(y,{key:0,style:m([p.timeStyle]),class:"uni-countdown__number"},{default:o((()=>[l(u(h.d),1)])),_:1},8,["style"])):c("",!0),a.showDay?(t(),e(y,{key:1,style:m([p.splitorStyle]),class:"uni-countdown__splitor"},{default:o((()=>[l(u(p.dayText),1)])),_:1},8,["style"])):c("",!0),s(y,{style:m([p.timeStyle]),class:"uni-countdown__number"},{default:o((()=>[l(u(h.h),1)])),_:1},8,["style"]),s(y,{style:m([p.splitorStyle]),class:"uni-countdown__splitor"},{default:o((()=>[l(u(a.showColon?":":p.hourText),1)])),_:1},8,["style"]),s(y,{style:m([p.timeStyle]),class:"uni-countdown__number"},{default:o((()=>[l(u(h.i),1)])),_:1},8,["style"]),s(y,{style:m([p.splitorStyle]),class:"uni-countdown__splitor"},{default:o((()=>[l(u(a.showColon?":":p.minuteText),1)])),_:1},8,["style"]),s(y,{style:m([p.timeStyle]),class:"uni-countdown__number"},{default:o((()=>[l(u(h.s),1)])),_:1},8,["style"]),a.showColon?c("",!0):(t(),e(y,{key:2,style:m([p.splitorStyle]),class:"uni-countdown__splitor"},{default:o((()=>[l(u(p.secondText),1)])),_:1},8,["style"]))])),_:1})}],["__scopeId","data-v-c27d693f"]]);const T=x({data:()=>({smsCode:"",errorInfoValue:"",showKeyboard:!1,timeupSecond:60,mobile:"",requestVerifyCode:"",sureLogin:!1,isFinsh:!1}),onLoad(t){this.mobile=t.mobile||""},async mounted(){this.verifyCode()},watch:{smsCode:function(t,e){4===t.length&&t!==this.requestVerifyCode?(this.errorInfoValue="验证码错误",this.sureLogin=!1):(this.errorInfoValue="",this.sureLogin=!1),4===t.length&&t===this.requestVerifyCode&&(this.sureLogin=!0)}},methods:{timeup(){this.isFinsh=!0},getVal(){const t=this.$refs.verificationCodeStyle2.getValue();y({content:"获取到值："+t,showCancel:!1})},clearVal(){this.$refs.verificationCodeStyle2.cleanVal()},setVal(){this.$refs.verificationCodeStyle2.setVerificationCode("888")},inputVerificationChange(t){this.smsCode=t,console.log("值改变了："+t)},async resend(){if(this.isFinsh){const e=g.importObject("login");try{const t=await e.sendSmsCode(this.mobile);console.log(t,"发送成功"),0==t.code&&(this.mobile=t.mobile,this.verifyCode(),this.$refs.countDown.reset())}catch(t){console.log(t,"我是错误")}}},onFinsh(){this.isFinsh=!0},async verifyCode(){let t=g.importObject("login");const e=await t.getVerifySchema();try{this.requestVerifyCode=e.length>0?e[0].code:"0000"}catch(o){}},async smsLogin(){const t=g.importObject("login");try{let o={mobile:this.mobile,code:this.requestVerifyCode};const s=await t.loginBySms(o);if(console.log(s,"发送成功"),0==s.code)try{w("userInfo",JSON.stringify(s.userInfo)),w("uni_id_token",s.token),w("uid",s.uid),w("tokenExpired",s.tokenExpired);let t=g.importObject("login");const e=await t.getUserSchema(this.mobile);e&&(w("loginNum",e.affectedDocs),0===e.affectedDocs?b({url:"/pages/personalnformation/personalnformation"}):S({url:"/pages/myMebers/myMebers"}))}catch(e){}}catch(o){console.log(o,"我是错误")}},goBack(){S({url:"/pages/logining/logining"})}}},[["render",function(i,n,a,h,p,m){const y=C("van-icon"),g=v(V("verification-code-style2"),F),w=d,b=k,S=v(V("uni-countdown"),D),x=f;return t(),e(w,{class:"counter"},{default:o((()=>[s(y,{name:"arrow-left",size:"50upx",onClick:m.goBack,class:"app-esc"},null,8,["onClick"]),s(w,{class:"counter-matter"},{default:o((()=>[r("h1",{class:"code"},"请输入验证码"),r("span",{class:"phone"},"验证码已发送至 "+u(p.mobile),1),s(w,{class:"main"},{default:o((()=>[s(g,{latticeNum:4,ref:"verificationCodeStyle2",onInputVerificationChange:m.inputVerificationChange},null,8,["onInputVerificationChange"])])),_:1}),s(b,{class:_(["btn",p.sureLogin?"active":""]),onClick:m.smsLogin},{default:o((()=>[r("span",{class:"btn-text"},"登录")])),_:1},8,["class","onClick"]),s(w,{class:_(["time",p.isFinsh?"timeActive":""]),onClick:m.resend},{default:o((()=>[l(" 重新发送"),p.isFinsh?c("",!0):(t(),e(w,{key:0,class:"kuo_hao_style"},{default:o((()=>[l("( "),s(S,{"show-day":!1,color:p.isFinsh?"#1370ff":"#a8adb6",showColon:!0,hour:0,minute:0,second:p.timeupSecond,onTimeup:m.timeup},null,8,["color","second","onTimeup"]),s(x,null,{default:o((()=>[l("s")])),_:1}),l("） ")])),_:1}))])),_:1},8,["class","onClick"])])),_:1})])),_:1})}],["__scopeId","data-v-2fe408ba"]]);export{T as default};
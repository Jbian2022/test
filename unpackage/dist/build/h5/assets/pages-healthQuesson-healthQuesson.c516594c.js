import{E as e,V as s,O as t,m as a,o,a as l,w as i,i as n,b as r,A as c,B as u,F as d,f as h,d as m,x as p,p as k,v as f,e as _,t as y,W as C}from"./index.2d1e5cbb.js";import{_ as w,a as g}from"./uni-list.782069dd.js";import{r as N}from"./uni-app.es.142f3165.js";import{_ as q,a as b}from"./uni-collapse.40ca416c.js";import{B as v}from"./bgTheamCompontent.f506f940.js";import{N as T}from"./navBarCompontent.7dcad6b7.js";import{_ as L}from"./_plugin-vue_export-helper.cdc0426e.js";import"./back.3d645e4a.js";var O=e.importObject("businessCloudObject",{customUI:!0});const B=L({components:{BgTheamCompontent:v,NavBarCompontent:T},data:()=>({healthList:[],activeName:[0],traineeNo:"",originList:[],questionCode:"",infoclick:!0,isfocus:!0}),onLoad(e){if("{}"!==JSON.stringify(e)&&e.traineeNo&&(this.traineeNo=e.traineeNo),"{}"!==JSON.stringify(e)&&e.hasOwnProperty("childList")){let s=JSON.parse(e.childList);this.originList=s}"{}"!==JSON.stringify(e)&&e.hasOwnProperty("questionCode")&&(this.questionCode=e.questionCode)},computed:{handlerData:()=>function(e){let s="";return e.answer.length>0&&(s=e.answer[0].remark),{remark:s}}},created(){s()},mounted(){this.requestList()},methods:{focus(){this.isfocus=!1},blur(){this.isfocus=!0},saveHealthQuession(){let e=[];JSON.parse(JSON.stringify(this.healthList)).forEach((s=>{2==s.questionType&&delete s.remark;let t=s.answer.length>0?s.answer.filter((e=>e.checked)).map((e=>e)):[],a=t.find((e=>e.checked)),o={code:s.code,answer:t.map((e=>e.answerTitle)),remark:t.length>0&&"是"===a.answerTitle?t[0].remark:""};e.push(o)}));let s={traineeNo:this.traineeNo,questionCode:this.questionCode,testResult:e};O.opearConfig(s,"physical").then((e=>{console.log(e,"我要保存了"),e.success&&(t({url:"/pages/physicalAssessment/physicalAssessment?traineeNo="+this.traineeNo+"&questionCode="+this.questionCode}),a({icon:"success",title:e.message,duration:800}))})).catch((()=>{}))},requestList(){O.opearConfigQuery({traineeNo:this.traineeNo,questionCode:this.questionCode}).then((e=>{if(console.log(e,"kkkkk"),0===e.affectedDocs){let e=this.originList.map((e=>{let s=e.answer.length>0?e.answer.map((e=>({...e,checked:!1}))):[];return{...e,answer:s}}));this.healthList=e}else{let s=JSON.parse(JSON.stringify(this.originList)).map((s=>{let t=s.answer.length>0?s.answer.map((t=>{let a=e.data[0];var o=!1,l="";return a.testResult.forEach((e=>{s.code===e.code&&(1===s.questionType&&(l=e.remark||""),e.answer.length>0?e.answer.map((e=>{t.answerTitle===e&&(o=!0)})):o=!1)})),{...t,checked:o,remark:l}})):[];return{...s,answer:t}}));console.log(s,"hellow"),this.healthList=s}})).catch((e=>{}))},quesionClick(e,s,t,a){t.checked=!t.checked},quesionChildClick(e,s,t,a){e.answer=e.answer.map(((e,s)=>s===a?{...e,checked:!0}:{...e,checked:!1}))}}},[["render",function(e,s,t,a,v,T){const L=k("BgTheamCompontent"),O=k("NavBarCompontent"),B=n,j=N(f("uni-list-item"),w),J=N(f("uni-list"),g),S=N(f("uni-collapse-item"),q),V=N(f("uni-collapse"),b),x=C;return o(),l(B,{class:"content_style"},{default:i((()=>[r(L,{theamType:"currency"}),r(O,{leftNavTitle:"健康问答",isAuthority:!0}),r(B,{class:"list_content_style"},{default:i((()=>[(o(!0),c(d,null,u(v.healthList,((e,t)=>(o(),l(B,{class:"need_loop_style",key:"key"+t},{default:i((()=>[2===e.questionType?(o(),l(B,{key:0,class:"check_box_style"},{default:i((()=>[r(V,{class:"need_collapse_style",modelValue:v.activeName,"onUpdate:modelValue":s[1]||(s[1]=e=>v.activeName=e)},{default:i((()=>[r(S,{titleBorder:"none",open:!0,"show-arrow":!1,title:e.questionContent,name:t},{title:i((()=>[r(J,null,{default:i((()=>[r(j,{border:!1,title:e.questionContent,clickable:"",onClick:s[0]||(s[0]=e=>v.infoclick=!v.infoclick),class:"titleclass"},{footer:i((()=>[v.infoclick?(o(),l(B,{key:0,class:"rightclickblock arrowimgopen"},{default:i((()=>[m(" 点击展开 ")])),_:1})):(o(),l(B,{key:1,class:"rightclickblock arrowimgclose"},{default:i((()=>[m("点击关闭")])),_:1}))])),_:2},1032,["title"])])),_:2},1024)])),default:i((()=>[r(B,{class:"collapes_conten_style"},{default:i((()=>[(o(!0),c(d,null,u(e.answer,((s,a)=>(o(),l(B,{class:_(["collapes_tag_stylle",s.checked?"active":""]),onClick:h((o=>T.quesionClick(e,t,s,a)),["stop"]),key:"key"+a},{default:i((()=>[m(y(s.answerTitle),1)])),_:2},1032,["onClick","class"])))),128))])),_:2},1024)])),_:2},1032,["title","name"])])),_:2},1032,["modelValue"])])),_:2},1024)):p("",!0),1===e.questionType?(o(),l(B,{key:1,class:"radio_style"},{default:i((()=>[r(B,{class:"radio_title_style"},{default:i((()=>[m(y(e.questionContent),1)])),_:2},1024),r(B,{class:"radio_tag_style"},{default:i((()=>[(o(!0),c(d,null,u(e.answer,((s,a)=>(o(),l(B,{class:_(["tag_style",s.checked?"active":""]),key:"key"+a,onClick:h((o=>T.quesionChildClick(e,t,s,a)),["stop"])},{default:i((()=>[m(y(s.answerTitle),1)])),_:2},1032,["onClick","class"])))),128))])),_:2},1024),e.answer[0].checked?(o(),l(B,{key:0,class:"radio_remark_style"},{default:i((()=>[r(B,{class:"uni-textarea"},{default:i((()=>[r(x,{maxlength:30,modelValue:e.answer[0].remark,"onUpdate:modelValue":s=>e.answer[0].remark=s,"placeholder-style":"color:#BDC3CE",placeholder:e.answerRemark&&e.answerRemark.remarkTitle?e.answerRemark.remarkTitle:"请补充信息","cursor-spacing":45,"auto-blur":!0,onFocus:T.focus,onBlur:T.blur,onConfirm:T.blur},null,8,["modelValue","onUpdate:modelValue","placeholder","onFocus","onBlur","onConfirm"])])),_:2},1024)])),_:2},1024)):p("",!0)])),_:2},1024)):p("",!0)])),_:2},1024)))),128))])),_:1}),v.isfocus?(o(),l(B,{key:0,class:"bottom_style",onClick:h(T.saveHealthQuession,["stop"])},{default:i((()=>[m("保存")])),_:1},8,["onClick"])):p("",!0)])),_:1})}],["__scopeId","data-v-a3f3316b"]]);export{B as default};
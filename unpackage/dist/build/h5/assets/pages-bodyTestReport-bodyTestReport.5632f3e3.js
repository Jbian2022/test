import{E as e,D as t,m as s,Q as o,k as a,o as n,a as i,w as r,i as l,b as c,A as u,B as m,F as d,d as p,f,q as h,v as g,e as y,t as b,I as C,u as _}from"./index.3c07bbe7.js";import{_ as v,a as k}from"./uni-forms.92dbc167.js";import{r as T}from"./uni-app.es.2e9f864b.js";import{B as N}from"./bgTheamCompontent.b73a7dbd.js";import{N as q}from"./navBarCompontent.f41d0dd4.js";import{u as F}from"./timeUtil.f179a302.js";import{M as I}from"./mPicker.d4a9f052.js";import{_ as O}from"./back.83fd7f48.js";import{_ as j}from"./_plugin-vue_export-helper.cdc0426e.js";import"./uni-transition.23e18650.js";var L=e.importObject("businessCloudObject");const w=j({components:{BgTheamCompontent:N,NavBarCompontent:q,Mpicker:I},data:()=>({configForm:{},pickerShow:!1,traineeNo:"",questionCode:"",originList:[],bodyTestReport:[],range:[]}),onLoad(e){if("{}"!==JSON.stringify(e)&&e.traineeNo&&(this.traineeNo=e.traineeNo),"{}"!==JSON.stringify(e)&&e.hasOwnProperty("childList")){let t=JSON.parse(e.childList);this.originList=t}"{}"!==JSON.stringify(e)&&e.hasOwnProperty("questionCode")&&(this.questionCode=e.questionCode)},mounted(){this.requestList()},computed:{handleIndex:()=>function(e){let t=0;return t=e.configList.findIndex((t=>t.value===e.defaultValue)),t},handleFormValue:()=>function(e){let t="";return e.hasOwnProperty("value")&&(t=e.value||""),{value:t}}},methods:{changeInputValue(e,t){t.value=e.detail.value},pickeConfirm(e,t,s){console.log(t,"我平时",s),t.flag=!1,t.value=t.configList[e].text||""},pickCancel(e){e.flag=!1},openDialog(e){e.flag=!0},saveBodyTestReport(){var e={};this.bodyTestReport.forEach((t=>{let s={[t.key]:t.hasOwnProperty("value")?t.value:""};console.log(s,"readyParam"),Object.assign(e,s)}));let o={traineeNo:this.traineeNo,questionCode:this.questionCode,bodyTestReport:e};L.opearConfig(o,"bodyTestReport").then((e=>{console.log(e,"我要保存了"),e.success&&(t({url:"/pages/physicalAssessment/physicalAssessment?traineeNo="+this.traineeNo+"&questionCode="+this.questionCode}),s({icon:"success",title:e.message,duration:800}))})).catch((()=>{}))},requestList(){var e=this;L.opearConfigQuery({traineeNo:this.traineeNo,questionCode:this.questionCode}).then((t=>{let s=this.originList.map((e=>{let t=[];return e.hasOwnProperty("configList")&&e.configList.length>0&&(t=e.configList),{...e,configList:t,flag:!1}}));console.log(t,"kkkkk"),0===t.affectedDocs?(this.configForm={},this.bodyTestReport=s):(s=s.map((s=>{var o=null;let a="";return t.data.forEach((t=>{for(var n in t.bodyTestReport)s.key===n&&(o={[n]:t.bodyTestReport[n]},a=t.bodyTestReport[n],Object.assign(e.configForm,o))})),{...s,flag:!1,value:a}})),console.log(e.configForm,"this.configForm",s),e.bodyTestReport=s)})).catch((e=>{}))},formatter:(e,t)=>"year"===e?`${t}年`:"month"===e?`${t}月`:"day"===e?`${t}日`:"hour"===e?`${t}时`:"minute"===e?`${t}分`:t,genderChange(e){},birthConfirm(){this.studentForm.birthday=F.timeFormat(this.currentDate,"yyyy-MM-dd"),this.dateShowpicker=!1},genderConfirm(e){this.studentForm.gender=e.value,this.gender=e.text;let t=this.columns.findIndex((t=>{t.value=e.value}));this.defaultIndex=t,this.showPicker=!1},addDirectly(t){var n=this;this.$refs.studentForm.validate().then((()=>{let i=e.importObject("businessCloudObject");console.log(n.requestItem,"that.requestItem"),"edit"==t||n.requestItem?i.updateMember(n.studentForm).then((e=>{e.success?(o({url:"/pages/myMebers/myMebers",success:e=>{},fail:()=>{},complete:()=>{}}),s({icon:"success",title:res.message,duration:800})):s({icon:"fail",title:res.message,duration:800})})).catch((e=>{s({icon:"编辑失败",title:e.message,duration:800})})):i.addMember(n.studentForm).then((e=>{e.success?(console.log(t,">>>>"),"body"==t?i.getOnlyList({traineeName:n.studentForm.traineeName,mobile:n.studentForm.mobile}).then((e=>{if(console.log(e,"即将发送的res"),e.success){let t=e.data;a({url:"/pages/physicalAssessment/physicalAssessment?traineeNo="+t[0]._id})}})).catch((e=>{})):o({url:"/pages/myMebers/myMebers",success:e=>{},fail:()=>{},complete:()=>{}}),s({icon:"success",title:e.message,duration:800})):(console.log(2),s({icon:"fail",title:e.message,duration:800}))})).catch((e=>{}))})).catch((e=>{}))},onConfirm(){},onSubmit(){},buyClick(e){this.studentForm.buyStatus=e}}},[["render",function(e,t,s,o,a,N){const q=h("BgTheamCompontent"),F=h("NavBarCompontent"),I=C,j=T(g("uni-forms-item"),v),L=h("Mpicker"),w=l,R=_,x=T(g("uni-forms"),k);return n(),i(w,{class:"content_style"},{default:r((()=>[c(q,{theamType:"currency"}),c(F,{leftNavTitle:"体测报告填写",jumpType:"TCBGTX"}),c(w,{class:"contetnt_form_style"},{default:r((()=>[c(x,{modelValue:a.configForm,ref:"studentForm","label-position":"top"},{default:r((()=>[(n(!0),u(d,null,m(a.bodyTestReport,((e,t)=>(n(),u(d,{key:t},[e.isInput&&"y"===e.isInput?(n(),i(j,{key:0,class:"outer_form_item_style",label:e.questionContent,name:e.code},{default:r((()=>[c(I,{type:"number",clas:"change_input_style",value:e.value,onInput:t=>N.changeInputValue(t,e),placeholder:e.answerRemark.remarkTitle},null,8,["value","onInput","placeholder"])])),_:2},1032,["label","name"])):(n(),i(j,{key:1,class:"outer_form_item_style",label:e.questionContent,name:e.code},{default:r((()=>[c(w,{class:"change_picker_style"},{default:r((()=>[c(L,{mode:"bottom",show:e.flag,range:e.configList,rangeKey:"text",onConfirm:s=>N.pickeConfirm(s,e,t),onCancel:t=>N.pickCancel(e),pickerType:"ordinary",defaultIndex:N.handleIndex(e)},null,8,["show","range","onConfirm","onCancel","defaultIndex"]),c(w,{class:"change_picker_style",onClick:f((t=>N.openDialog(e)),["stop"])},{default:r((()=>[c(w,{class:y(["label_style",e.hasOwnProperty("value")&&e.value?"":"student_label_style"])},{default:r((()=>[p(b(e.hasOwnProperty("value")&&e.value?e.value:e.answerRemark.remarkTitle),1)])),_:2},1032,["class"]),c(R,{class:"back_img_style",src:O})])),_:2},1032,["onClick"])])),_:2},1024)])),_:2},1032,["label","name"]))],64)))),128))])),_:1},8,["modelValue"])])),_:1}),c(w,{class:"bottom_style",onClick:f(N.saveBodyTestReport,["stop"])},{default:r((()=>[p("保存")])),_:1},8,["onClick"])])),_:1})}],["__scopeId","data-v-395a4e96"]]);export{w as default};
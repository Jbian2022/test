import{N as e,H as a,E as s,o,a as t,w as n,i as c,b as l,f as r,d as m,X as i,e as d,t as u,q as f,u as _,I as h,v as p}from"./index.3c07bbe7.js";import{_ as g,a as b}from"./uni-forms.92dbc167.js";import{r as k}from"./uni-app.es.2e9f864b.js";import{B as y}from"./bgTheamCompontent.b73a7dbd.js";import{M as x}from"./mPicker.d4a9f052.js";import{_ as C}from"./back.83fd7f48.js";import{_ as v}from"./_plugin-vue_export-helper.cdc0426e.js";import"./uni-transition.23e18650.js";const F=v({data:()=>({coachForm:{nickname:"",gender:""},sexShow:!1,range:[{text:"男",value:"1"},{text:"女",value:"2"}]}),components:{BgTheamCompontent:y,Mpicker:x},computed:{genderLabel(){let e="",a=this.range.find((e=>e.value===this.coachForm.gender));return a&&(e=a.text||""),e}},methods:{goBack(){e()},jump(){a({url:"/pages/myMebers/myMebers"})},savePersonInfo(){if(console.log("1111"),this.coachForm.nickname||this.coachForm.gender){const a=s.importObject("login");try{let e={...this.coachForm};console.log(e,"param"),a.perfectInfo(e).then((e=>{e.success&&this.jump()})).catch((e=>{}))}catch(e){}}},openDialog(){this.sexShow=!0},sexConfirm(e){this.coachForm.gender=this.range[e[0]].value,this.sexShow=!1},sexCancel(){this.sexShow=!1}}},[["render",function(e,a,s,y,x,v){const F=f("BgTheamCompontent"),j=_,w=c,I=h,B=k(p("uni-forms-item"),g),M=f("Mpicker"),S=k(p("uni-forms"),b);return o(),t(w,{class:"counter content_style"},{default:n((()=>[l(F,{theamType:"currency"}),l(w,{class:"nav_style"},{default:n((()=>[l(w,{class:"nav_left_style",onClick:v.goBack},{default:n((()=>[l(j,{class:"back_img_style",src:C})])),_:1},8,["onClick"]),l(w,{class:"nav_text",onClick:r(v.jump,["stop"])},{default:n((()=>[m("跳过")])),_:1},8,["onClick"])])),_:1}),l(w,{class:"botter"},{default:n((()=>[i("span",{class:"botter-top"},"个人信息完善"),i("p",{class:"a-i-c"},"完善信息后方可进行学员管理")])),_:1}),l(w,{class:"contetnt_form_style"},{default:n((()=>[l(S,{modelValue:x.coachForm,ref:"coachForm","label-position":"left"},{default:n((()=>[l(B,{class:"outer_form_item_style",label:"姓名",name:"nickname"},{default:n((()=>[l(I,{type:"text",clas:"change_input_style",modelValue:x.coachForm.nickname,"onUpdate:modelValue":a[0]||(a[0]=e=>x.coachForm.nickname=e),placeholder:"请输入真实姓名"},null,8,["modelValue"])])),_:1}),l(B,{class:"outer_form_item_style",label:"性别(必填)",name:"gender"},{default:n((()=>[l(M,{mode:"bottom",show:x.sexShow,range:x.range,rangeKey:"text",onConfirm:v.sexConfirm,onCancel:v.sexCancel,pickerType:"ordinary",defaultIndex:0},null,8,["show","range","onConfirm","onCancel"]),l(w,{class:"change_picker_style",onClick:r(v.openDialog,["stop"])},{default:n((()=>[l(w,{class:d(["label_style",x.coachForm.gender?"":"student_label_style"])},{default:n((()=>[m(u(x.coachForm.gender?v.genderLabel:"请选择性别"),1)])),_:1},8,["class"]),l(j,{class:"back_img_style",src:C})])),_:1},8,["onClick"])])),_:1},8,["label"])])),_:1},8,["modelValue"])])),_:1}),l(w,{class:d(["add_method_style edit_save_style",x.coachForm.gender||x.coachForm.nickname?"active":""]),onClick:v.savePersonInfo},{default:n((()=>[m(" 保存 ")])),_:1},8,["class","onClick"])])),_:1})}],["__scopeId","data-v-e7d0a63f"]]);export{F as default};
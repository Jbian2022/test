import{E as t,k as e,D as a,o as s,a as o,w as n,i,b as l,d as r,A as c,B as u,F as d,q as y,t as h,n as p,C as A,u as f,U as m}from"./index.3c07bbe7.js";import{B as C}from"./bgTheamCompontent.b73a7dbd.js";import{N as g}from"./navBarCompontent.f41d0dd4.js";import{_ as q}from"./_plugin-vue_export-helper.cdc0426e.js";import"./back.83fd7f48.js";const D="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAgCAYAAAAFQMh/AAAAAXNSR0IArs4c6QAAALJJREFUWEft1jEKwzAMBVApWb127RW69f5XyBVyhGLIZgUPhiyRVPpVQYhXGx762LKYkhYnuXTDf0v+OlGLyMTMzYoOWnFHPxu950ZbKbxoOAweKAs9OjgJrRoOgztWq7wa03NUquFQ+BscDnvxENiDh8EWHgpreDh8hl8XPnvboRVrDSUMtrpYCGyh/cLBYQ8Kh70oFE79FlMGgfEHp4w+1px13Iffai9+w96kfj6XFvUOsriKTUnCynEAAAAASUVORK5CYII=",_=t.importObject("testResults"),b=t.importObject("businessCloudObject");const v=q({components:{BgTheamCompontent:C,NavBarCompontent:g},data:()=>({traineeNo:"",questionCode:"",currentRate:50,age:29,gender:"1",resultValue:0,typeText:"待测",typeColor:"#4B525E",queryData:{},queryUserActionData:{}}),onLoad:function(t){console.log(t),this.traineeNo=t.traineeNo,this.questionCode=t.questionCode,this.getconfingActionName()},methods:{jumpModular(t){console.log(t.path,">>>>"),e({url:t.path+"?data="+JSON.stringify(t)+"&traineeNo="+this.traineeNo+"&questionCode="+t.parentCode,success:t=>{},fail:()=>{},complete:()=>{}})},levelColor(t){switch(t){case"优秀":case"良好":return"rgba(1, 224, 140, 1)";case"中等":case"中上等":case"中下等":return"#FFC13C";case"较差":case"非常差":return"#F04242";default:return"#4B525E"}},getconfingActionName(){const t={};t.traineeNo=this.traineeNo,t.questionCode=this.questionCode,_.opearConfigQuery(t).then((t=>{console.log(t),t.success&&(this.queryUserActionData=t.data,b.getPhysicalChildAssessmentList("A0005").then((t=>{this.queryData=t.data,this.queryData.forEach((t=>{t.typeText="待测",t.type=0,t.typeColor=this.levelColor(t.typeText),t.path="/pages/physicalFitnessAssessment/actionEvaluation/actionEvaluation",console.log(t)}));for(let e=0;e<this.queryUserActionData.length;e++)for(let t=0;t<this.queryData.length;t++)console.log(this.queryData[t].code===this.queryUserActionData[e].code),this.queryData[t].code!==this.queryUserActionData[e].code||(this.queryData[t].typeText=this.queryUserActionData[e].physicalData.actionTypeText,this.queryData[t].type=this.queryUserActionData[e].physicalData.actionVlue,this.queryData[t].typeColor=this.levelColor(this.queryUserActionData[e].physicalData.actionTypeText));console.log(this.queryData)})).catch((t=>{})))})).catch()},getdynamicEvaluationdata(){a({url:"/pages/physicalAssessment/physicalAssessment?traineeNo="+this.traineeNo+"&questionCode="+this.questionCode})}}},[["render",function(t,e,a,C,g,q){const _=y("BgTheamCompontent"),b=y("NavBarCompontent"),v=i,N=A,T=f,U=m,x=y("van-col"),E=y("van-row"),w=y("van-button");return s(),o(v,{class:"content_style"},{default:n((()=>[l(_,{theamType:"currency"}),l(b,{leftNavTitle:"体能评估"}),l(v,{class:"watermark"},{default:n((()=>[r("数据评测来源于世界权威机构")])),_:1}),l(E,{style:{"background-color":"#343a44"}},{default:n((()=>[l(x,{class:"need_scoll",span:"24"},{default:n((()=>[(s(!0),c(d,null,u(g.queryData,((t,e)=>(s(),o(v,{class:"dynamicshow",key:e},{default:n((()=>[t.type>0?(s(),o(v,{key:0,class:"dynamicshow_left"},{default:n((()=>[l(N,{class:"evaluationdata"},{default:n((()=>[r(h(t.questionContent),1)])),_:2},1024),l(U,{class:"dynamicshow_button buttonYes",onClick:e=>q.jumpModular(t)},{default:n((()=>[r("重新测试"),l(T,{src:D})])),_:2},1032,["onClick"])])),_:2},1024)):(s(),o(v,{key:1,class:"dynamicshow_left"},{default:n((()=>[l(N,{class:"evaluationdata"},{default:n((()=>[r(h(t.questionContent),1)])),_:2},1024),l(U,{class:"dynamicshow_button buttonNo",onClick:e=>q.jumpModular(t)},{default:n((()=>[r("开始测试"),l(T,{src:D})])),_:2},1032,["onClick"])])),_:2},1024)),l(v,{class:"dynamicshow_right"},{default:n((()=>[l(v,{class:"circle",style:p("border: 4px solid "+t.typeColor+";")},{default:n((()=>[l(v,{class:"circleText",style:p("color:"+t.typeColor+";")},{default:n((()=>[r(h(t.typeText),1)])),_:2},1032,["style"])])),_:2},1032,["style"])])),_:2},1024)])),_:2},1024)))),128))])),_:1})])),_:1}),l(v,null,{default:n((()=>[l(w,{type:"primary",class:"postureButton",onClick:e[0]||(e[0]=t=>q.getdynamicEvaluationdata())},{default:n((()=>[r("确认")])),_:1})])),_:1})])),_:1})}],["__scopeId","data-v-2f44ea56"]]);export{v as default};
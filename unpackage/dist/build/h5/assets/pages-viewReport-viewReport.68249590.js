import{E as t,a0 as e,a7 as a,a1 as s,a2 as l,V as o,J as n,a3 as i,D as c,N as u,o as r,a as h,w as d,i as p,b as f,d as m,t as g,e as y,R as _,T as x,p as w,A as D,B as b,F as T,X as F,q as N,U as C,u as v,n as k,C as B}from"./index.3c07bbe7.js";import{h as A}from"./html2canvas.esm.1306abbd.js";import"./moment.882eb434.js";import{_ as I}from"./openarrit.1af81aaf.js";import{_ as R}from"./_plugin-vue_export-helper.cdc0426e.js";const q={methods:{generateImage(t){setTimeout((()=>{const e=document.getElementById("viewReport");A(e,{width:e.clientWidth,height:e.clientHeight,scrollY:0,scrollX:0,useCORS:!0}).then((e=>{const a=e.toDataURL("image/png");t&&t(a)})).catch((t=>{}))}),300)},updateEcharts(t,e,a,s){t&&this.generateImage((e=>{a.callMethod("receiveRenderData",{name:t,base64:e})}))}}},S=t=>{t.$renderjs||(t.$renderjs=[]),t.$renderjs.push("canvasImage"),t.mixins||(t.mixins=[]),t.mixins.push({beforeCreate(){this.canvasImage=this},mounted(){this.$ownerInstance=this.$gcd(this,!0)}}),t.mixins.push(q)};t.importObject("my");const E=t.importObject("testResults"),U=t.importObject("businessCloudObject"),V={data:()=>({currentRate:50,pageName:"",personName:"未知",gender:1,age:0,mobileNumber:0,openKey:!0,key:"",bodyTestData:[],bodyFraction:0,dynamicEvaluationdata:[{title:"俯卧撑耐力测试",type:60,path:"/pages/physicalFitnessAssessment/actionEvaluation/actionEvaluation?pageName=俯卧撑耐力测试"},{title:"卷腹测试",type:30,path:"/pages/physicalFitnessAssessment/actionEvaluation/actionEvaluation?pageName=卷腹测试"},{title:"三分钟踏板测试",type:100,path:"/pages/physicalFitnessAssessment/actionEvaluation/actionEvaluation?pageName=三分钟踏板测试"},{title:"自重深蹲测试",type:0,path:"/pages/physicalFitnessAssessment/actionEvaluation/actionEvaluation?pageName=自重深蹲测试"}],showShare:!1,showHistory:!1,options:[{name:"分享到微信",icon:"../../static/app-plus/other/saveWechat.png"},{name:"分享到朋友圈",icon:"../../static/app-plus/other/wechatMoments.png"},{name:"保存到相册",icon:"../../static/app-plus/other/savePhone.png"}],history:[{name:"分享到微信",icon:"../../static/app-plus/other/saveWechat.svg"},{name:"分享到朋友圈",icon:"../../static/app-plus/other/wechatMoments.svg"},{name:"保存到相册",icon:"../../static/app-plus/other/savePhone.svg"}],getOnlyLists:{},traineeNo:"",resultValue:0,typeText:"待测",typeColor:"#4B525E",queryData:{},queryUserActionData:{},assessmentNewData:{},assessmentTrueData:[],baseUrl:null,url:null,canvasImageMsg:null,isFixedTop:!1}),onPageScroll(t){console.log(e().statusBarHeight),t.scrollTop>e().statusBarHeight?this.isFixedTop=!0:this.isFixedTop=!1},setup:()=>({activeBasicInformation:a(["1"]),healthQA:a(["2"]),BodyTestReport:a(["3"]),bodyAssessment:a(["4"]),dynamicEvaluation:a(["5"]),physicalFitnessAssessment:a(["6"])}),onShow(){this.getUserInfo(),this.getconfingActionName()},onLoad(t){if("{}"!==JSON.stringify(t)&&t.traineeNo)switch(this.traineeNo=t.traineeNo,this.key=t.key,this.key){case"1":this.openKey=!0;break;case"2":this.openKey=!1,this.pageName="会员信息"}this.getPosture(),this.getBodyTestData()},methods:{async getUserInfo(){const t={};t.traineeId=this.traineeNo,E.getOnlyList(t).then((t=>{this.personName=t.data[0].traineeName,this.gender=t.data[0].gender,this.mobileNumber=t.data[0].mobile,this.age=this.getAge(t.data[0].birthday)}))},getAge(t){t=t.split("-");let e=new Date,a=[e.getFullYear(),e.getMonth()+1,e.getDate()],s=a.map(((e,a)=>e-t[a]));if(s[2]<0){let t=new Date(a[0],a[1],0);s[1]--,s[2]+=t.getDate()}return s[1]<0&&(s[0]--,s[1]+=12),s[0]},levelColor(t){switch(t){case"优秀":case"良好":return"rgba(1, 224, 140, 1)";case"中等":case"中上等":case"中下等":return"#FFC13C";case"较差":case"非常差":return"#F04242";default:return"#4B525E"}},getconfingActionName(){const t={};t.traineeNo=this.traineeNo,t.questionCode="A0005",E.opearConfigQuery(t).then((t=>{t.success&&(this.queryUserActionData=t.data,U.getPhysicalChildAssessmentList("A0005").then((t=>{this.queryData=t.data,this.queryData.forEach((t=>{t.typeText="待测",t.type=0,t.typeColor=this.levelColor(t.typeText),t.path="/pages/physicalFitnessAssessment/actionEvaluation/actionEvaluation"}));for(let e=0;e<this.queryUserActionData.length;e++)for(let t=0;t<this.queryData.length;t++)console.log(this.queryData[t].code===this.queryUserActionData[e].code),this.queryData[t].code!==this.queryUserActionData[e].code||(this.queryData[t].typeText=this.queryUserActionData[e].physicalData.actionTypeText,this.queryData[t].type=this.queryUserActionData[e].physicalData.actionVlue,this.queryData[t].typeColor=this.levelColor(this.queryUserActionData[e].physicalData.actionTypeText))})).catch((t=>{})))})).catch()},getPosture(){const t={};t.traineeNo=this.traineeNo,t.questionCode="A0003",E.opearConfigQuery(t).then((t=>{if(t.success){this.assessmentNewData=t.data[0].postData;let e={};this.assessmentNewData[0].textShow1||(e.title=this.assessmentNewData[0].title1,e.text=this.assessmentNewData[0].text1,this.assessmentTrueData.push(e),e={}),this.assessmentNewData[1].textShow2||(e.title=this.assessmentNewData[1].title2,e.text=this.assessmentNewData[1].text2,this.assessmentTrueData.push(e),e={}),this.assessmentNewData[2].textShow3||(e.title=this.assessmentNewData[2].title1,e.text=this.assessmentNewData[2].text1,this.assessmentTrueData.push(e),e={}),this.assessmentNewData[3].textShow4||(e.title=this.assessmentNewData[3].title2,e.text=this.assessmentNewData[3].text2,this.assessmentTrueData.push(e),e={}),this.assessmentNewData[4].textShow5||(e.title=this.assessmentNewData[4].title1,e.text=this.assessmentNewData[4].text1,this.assessmentTrueData.push(e),e={}),this.assessmentNewData[5].textShow6||(e.title=this.assessmentNewData[5].title2,e.text=this.assessmentNewData[5].text2,this.assessmentTrueData.push(e),e={}),this.assessmentNewData[6].textShow7||(e.title=this.assessmentNewData[6].title1,e.text=this.assessmentNewData[6].text1,this.assessmentTrueData.push(e),e={}),this.assessmentNewData[7].textShow8||(e.title=this.assessmentNewData[7].title1,e.text=this.assessmentNewData[7].text1,this.assessmentTrueData.push(e),e={}),this.assessmentNewData[8].textShow9||(e.title=this.assessmentNewData[8].title2,e.text=this.assessmentNewData[8].text2,this.assessmentTrueData.push(e),e={})}})).catch()},getBodyTestData(){const t={};t.traineeNo=this.traineeNo,t.questionCode="A0002",E.opearConfigQuery(t).then((t=>{this.bodyTestData=t.data[0].bodyTestReport,console.log(this.bodyTestData),this.bodyFraction=Number(this.bodyTestData.bodyFraction)}))},saveReport(){const t={};let e=new Date;t.traineeNo=this.traineeNo,t.bodyTestData=this.bodyTestData,t.assessmentTrueData=this.assessmentTrueData,t.queryData=this.queryData,t.saveDate=e,console.log(t),E.saveReport(t).then((t=>{console.log(t)})),this.showShare=!0},async uploadImage(t){const e=await train.uploadBase64({base64:this.baseUrl});this.url=e.fileID,this.canvasImageMsg=null,t&&t(this.url)},downloadFile(){s({url:this.url,success:t=>{200===t.statusCode&&(console.log("下载成功",t),l({filePath:t.tempFilePath,success:t=>{console.log("保存成功！",t),o(),n({showCancel:!1,title:"提示",content:"图片已经保存到相册请查看",success:function(t){t.confirm?console.log("用户点击确定"):t.cancel&&console.log("用户点击取消")}})},fail:t=>{console.log("err",t)}}))}})},receiveRenderData(t){this.showShare=!1,console.log(t.name,8888),this.baseUrl=t.base64,this.uploadImage((t=>{i({title:"加载中"})}))},onSelect(t){console.log(t,88),this.canvasImageMsg=t.name},onClickLeft(){this.openKey?c({url:"/pages/physicalAssessment/physicalAssessment?traineeNo="+this.traineeNo}):u()}}};S(V);const j=R(V,[["render",function(t,e,a,s,l,o){const n=N("van-icon"),i=p,c=N("van-col"),u=N("van-row"),A=C,R=N("van-collapse-item"),q=N("van-collapse"),S=N("van-progress"),E=B,U=N("van-button"),V=N("van-share-sheet"),j=v;return r(),h(i,{class:"content_style"},{default:d((()=>[f(i,{class:y(["arrow-left",{show:l.isFixedTop}]),onClick:o.onClickLeft},{default:d((()=>[f(n,{name:"arrow-left"}),f(i,{class:"title"},{default:d((()=>[m(g(l.pageName),1)])),_:1}),f(i,{class:"z",style:{opacity:"0"}},{default:d((()=>[m("8888")])),_:1})])),_:1},8,["class","onClick"]),_(f(i,{class:"arrow-box"},null,512),[[x,l.isFixedTop]]),f(i,{id:"viewReport"},{default:d((()=>[l.openKey?(r(),h(i,{key:0,class:"titleText"},{default:d((()=>[f(u,{class:"titleTopText"},{default:d((()=>[f(c,{span:"12"},{default:d((()=>[m("体测报告")])),_:1}),f(c,{span:"12"},{default:d((()=>[m("10.04")])),_:1})])),_:1}),f(u,{class:"titleBottomText"},{default:d((()=>[f(c,{span:"12"},{default:d((()=>[m("数据评测来源于世界权威机构")])),_:1}),f(c,{span:"12"},{default:d((()=>[m("2022年")])),_:1})])),_:1})])),_:1})):w("",!0),l.openKey?w("",!0):(r(),h(i,{key:1,class:"titleText"},{default:d((()=>[f(u,{class:"titleTopText"},{default:d((()=>[f(c,{span:"12"},{default:d((()=>[m(g(l.personName)+" ",1),f(i,{class:"titleType"},{default:d((()=>[m("已购课")])),_:1})])),_:1}),f(c,{span:"12"},{default:d((()=>[f(A,{class:"titleButton"},{default:d((()=>[m("重新测试")])),_:1})])),_:1})])),_:1}),f(u,{class:"titleBottomText"},{default:d((()=>[f(c,{span:"12"},{default:d((()=>[m("2022年")])),_:1}),f(c,{span:"12"},{default:d((()=>[m("数据评测来源于世界权威机构")])),_:1})])),_:1})])),_:1})),f(i,{class:"bgImg"}),f(i,{class:"basicInformation"},{default:d((()=>[f(q,{modelValue:s.activeBasicInformation,"onUpdate:modelValue":e[0]||(e[0]=t=>s.activeBasicInformation=t),border:!1},{default:d((()=>[f(R,{title:"基础信息",name:"1","title-class":"informationTitleText",class:"informationCard"},{default:d((()=>[f(i,{class:"basicInformationContent"},{default:d((()=>[f(i,{class:"textContent"},{default:d((()=>[f(u,{class:"text"},{default:d((()=>[f(c,{span:"12"},{default:d((()=>[m("姓名")])),_:1}),f(c,{span:"12",class:"textRight"},{default:d((()=>[m(g(l.personName),1)])),_:1})])),_:1})])),_:1}),f(i,{class:"textContent"},{default:d((()=>[f(u,{class:"text"},{default:d((()=>[f(c,{span:"12"},{default:d((()=>[m("性别")])),_:1}),1==l.gender?(r(),h(c,{key:0,span:"12",class:"textRight"},{default:d((()=>[m("男")])),_:1})):w("",!0),2==l.gender?(r(),h(c,{key:1,span:"12",class:"textRight"},{default:d((()=>[m("女")])),_:1})):w("",!0)])),_:1})])),_:1}),f(i,{class:"textContent"},{default:d((()=>[f(u,{class:"text"},{default:d((()=>[f(c,{span:"12"},{default:d((()=>[m("年龄")])),_:1}),f(c,{span:"12",class:"textRight"},{default:d((()=>[m(g(l.age),1)])),_:1})])),_:1})])),_:1}),f(i,{class:"textContent"},{default:d((()=>[f(u,{class:"text"},{default:d((()=>[f(c,{span:"12"},{default:d((()=>[m("手机号码")])),_:1}),f(c,{span:"12",class:"textRight"},{default:d((()=>[m(g(l.mobileNumber),1)])),_:1})])),_:1})])),_:1})])),_:1})])),_:1})])),_:1},8,["modelValue"])])),_:1}),f(i,{class:"basicInformation"},{default:d((()=>[f(q,{modelValue:s.healthQA,"onUpdate:modelValue":e[1]||(e[1]=t=>s.healthQA=t),border:!1},{default:d((()=>[f(R,{title:"健康问答",name:"2","title-class":"informationTitleText",class:"informationCard"},{default:d((()=>[f(i,{class:"basicInformationContent healthBlocks"},{default:d((()=>[f(i,{class:"healthBlock"},{default:d((()=>[m(" 高血压 ")])),_:1}),f(i,{class:"healthBlock"},{default:d((()=>[m(" 支气管炎 ")])),_:1}),f(i,{class:"healthBlock"},{default:d((()=>[m(" 支气管炎 ")])),_:1})])),_:1}),f(i,{class:"healthBlocks"},{default:d((()=>[f(i,{style:{"margin-bottom":"20upx",color:"#F4F7FF","font-size":"30upx","font-weight":"500"}},{default:d((()=>[f(i,{class:"greenBlock"}),m(" 其他被确诊的疾病 ")])),_:1}),f(i,{class:"healthBlock"},{default:d((()=>[m(" 支气管炎 ")])),_:1})])),_:1}),f(i,{class:"healthBlocks"},{default:d((()=>[f(i,{style:{"margin-bottom":"20upx",color:"#F4F7FF","font-size":"30upx","font-weight":"500"}},{default:d((()=>[f(i,{class:"greenBlock"}),m(" 关节、韧带和肌肉是否受过任何损伤 ")])),_:1}),f(i,{class:"healthBlock"},{default:d((()=>[m(" 跟腱损伤 ")])),_:1}),f(i,{class:"healthBlock"},{default:d((()=>[m(" 手臂拉伤 ")])),_:1})])),_:1}),f(i,{class:"healthBlocks"},{default:d((()=>[f(i,{style:{"margin-bottom":"20upx",color:"#F4F7FF","font-size":"30upx","font-weight":"500"}},{default:d((()=>[f(i,{class:"greenBlock"}),m(" 是否曾经骨折 ")])),_:1}),f(i,{class:"healthBlock"},{default:d((()=>[m(" 肘部骨折 ")])),_:1})])),_:1}),f(i,{class:"healthBlocks"},{default:d((()=>[f(i,{style:{"margin-bottom":"20upx",color:"#F4F7FF","font-size":"30upx","font-weight":"500"}},{default:d((()=>[f(i,{class:"greenBlock"}),m(" 最近的体重是否有大幅度的变化 ")])),_:1}),f(i,{class:"healthBlock"},{default:d((()=>[m(" 重了15公斤 ")])),_:1})])),_:1})])),_:1})])),_:1},8,["modelValue"])])),_:1}),f(i,{class:"basicInformation"},{default:d((()=>[f(q,{modelValue:s.BodyTestReport,"onUpdate:modelValue":e[2]||(e[2]=t=>s.BodyTestReport=t),border:!1},{default:d((()=>[f(R,{title:"体测报告",name:"3","title-class":"informationTitleText",class:"informationCard"},{default:d((()=>[f(i,{class:"countNumBlock"},{default:d((()=>[f(u,null,{default:d((()=>[f(c,{span:"12",style:{"font-size":"32upx","font-weight":"600",color:"#F4F7FF","line-height":"44upx","margin-top":"20upx"}},{default:d((()=>[m("你很棒！")])),_:1}),f(c,{span:"12",style:{"font-size":"60upx","font-weight":"600",color:"#FFFFFF","line-height":"72upx","text-align":"right","margin-top":"10upx"}},{default:d((()=>[m(g(l.bodyFraction),1)])),_:1})])),_:1}),f(u,null,{default:d((()=>[f(c,{span:"24"},{default:d((()=>[m("再努力一点会更好哦！")])),_:1})])),_:1}),f(i,{style:{"margin-top":"44upx"}},{default:d((()=>[f(S,{percentage:l.bodyFraction,"stroke-width":"8",color:"#01E08C","show-pivot":!1,"track-color":"#454951"},null,8,["percentage"])])),_:1})])),_:1}),f(i,{class:"basicInformationContent"},{default:d((()=>[f(i,{class:"textContent"},{default:d((()=>[f(u,{class:"text"},{default:d((()=>[f(c,{span:"12"},{default:d((()=>[m("身高")])),_:1}),f(c,{span:"12",class:"textRight"},{default:d((()=>[m(g(l.bodyTestData.height)+"cm",1)])),_:1})])),_:1})])),_:1}),f(i,{class:"textContent"},{default:d((()=>[f(u,{class:"text"},{default:d((()=>[f(c,{span:"17"},{default:d((()=>[m("体重（标准：70kg）")])),_:1}),f(c,{span:"7",class:"textRight"},{default:d((()=>[m(g(l.bodyTestData.weight)+"kg",1)])),_:1})])),_:1})])),_:1}),f(i,{class:"textContent"},{default:d((()=>[f(u,{class:"text"},{default:d((()=>[f(c,{span:"17"},{default:d((()=>[m("肌肉量（标准：60kg）")])),_:1}),f(c,{span:"7",class:"textRight"},{default:d((()=>[m(g(l.bodyTestData.muscleMass)+"kg",1)])),_:1})])),_:1})])),_:1}),f(i,{class:"textContent"},{default:d((()=>[f(u,{class:"text"},{default:d((()=>[f(c,{span:"17"},{default:d((()=>[m("体脂量（标准：30kg）")])),_:1}),f(c,{span:"7",class:"textRight"},{default:d((()=>[m(g(l.bodyTestData.fatMass)+"kg",1)])),_:1})])),_:1})])),_:1}),f(i,{class:"textContent"},{default:d((()=>[f(u,{class:"text"},{default:d((()=>[f(c,{span:"17"},{default:d((()=>[m("体脂百分比（标准：18%）")])),_:1}),f(c,{span:"7",class:"textRight"},{default:d((()=>[m(g(l.bodyTestData.fatPer)+"%",1)])),_:1})])),_:1})])),_:1}),f(i,{class:"textContent"},{default:d((()=>[f(u,{class:"text"},{default:d((()=>[f(c,{span:"17"},{default:d((()=>[m("腰臀百分比（标准：15%）")])),_:1}),f(c,{span:"7",class:"textRight"},{default:d((()=>[m(g(l.bodyTestData.buttockPer)+"%",1)])),_:1})])),_:1})])),_:1}),f(i,{class:"textContent"},{default:d((()=>[f(u,{class:"text"},{default:d((()=>[f(c,{span:"17"},{default:d((()=>[m("基础代谢（标准：2200cal）")])),_:1}),f(c,{span:"7",class:"textRight"},{default:d((()=>[m(g(l.bodyTestData.basal)+"cal",1)])),_:1})])),_:1})])),_:1}),f(i,{class:"textContent"},{default:d((()=>[f(u,{class:"text"},{default:d((()=>[f(c,{span:"17"},{default:d((()=>[m("体水分（标准：40%）")])),_:1}),f(c,{span:"7",class:"textRight"},{default:d((()=>[m(g(l.bodyTestData.bodyMisture)+"%",1)])),_:1})])),_:1})])),_:1})])),_:1})])),_:1})])),_:1},8,["modelValue"])])),_:1}),f(i,{class:"basicInformation"},{default:d((()=>[f(q,{modelValue:s.bodyAssessment,"onUpdate:modelValue":e[3]||(e[3]=t=>s.bodyAssessment=t),border:!1},{default:d((()=>[f(R,{title:"体态评估",name:"4","title-class":"informationTitleText",class:"informationCard"},{default:d((()=>[(r(!0),D(T,null,b(l.assessmentTrueData,((t,e)=>(r(),h(i,{class:"bodyAssessment"},{default:d((()=>[f(i,{style:{width:"5px",height:"5px",background:"#FFC13C","border-radius":"100%",display:"inline-flex","margin-right":"20upx"}}),F("span",{style:{"font-size":"30upx","font-weight":"400",color:"#F4F7FF","line-height":"42upx"}},g(t.title),1),f(i,{class:"assessmentContent"},{default:d((()=>[F("p",null,g(t.text),1)])),_:2},1024)])),_:2},1024)))),256))])),_:1})])),_:1},8,["modelValue"])])),_:1}),f(i,{class:"basicInformation"},{default:d((()=>[f(q,{modelValue:s.dynamicEvaluation,"onUpdate:modelValue":e[4]||(e[4]=t=>s.dynamicEvaluation=t),border:!1},{default:d((()=>[f(R,{title:"动态评估",name:"5","title-class":"informationTitleText",class:"informationCard"},{default:d((()=>[f(i,{class:"bodyAssessment"},{default:d((()=>[f(i,{style:{width:"5px",height:"5px",background:"#FFC13C","border-radius":"100%",display:"inline-flex","margin-right":"20upx"}}),F("span",{style:{"font-size":"30upx","font-weight":"400",color:"#F4F7FF","line-height":"42upx"}},"正面观：先屈膝下蹲"),f(i,{class:"assessmentContent"},{default:d((()=>[F("p",null," 问题描述：股四头肌和髋关节屈肌活跃，臀部肌群不够活跃。 ")])),_:1})])),_:1}),f(i,{class:"bodyAssessment"},{default:d((()=>[f(i,{style:{width:"5px",height:"5px",background:"#FFC13C","border-radius":"100%",display:"inline-flex","margin-right":"20upx"}}),F("span",{style:{"font-size":"30upx","font-weight":"400",color:"#F4F7FF","line-height":"42upx"}},"侧面观：胫骨和躯干不平衡"),f(i,{class:"assessmentContent"},{default:d((()=>[F("p",null," 问题描述：跖屈肌紧张，导致背屈足背屈不足，运动力学不良。 ")])),_:1})])),_:1})])),_:1})])),_:1},8,["modelValue"])])),_:1}),f(i,{class:"basicInformation"},{default:d((()=>[f(q,{modelValue:s.physicalFitnessAssessment,"onUpdate:modelValue":e[5]||(e[5]=t=>s.physicalFitnessAssessment=t),border:!1},{default:d((()=>[f(R,{title:"体能评估",name:"6","title-class":"informationTitleText",class:"informationCard"},{default:d((()=>[f(u,{style:{"background-color":"#343A44"}},{default:d((()=>[f(c,{class:"need_scoll",span:"24"},{default:d((()=>[(r(!0),D(T,null,b(l.queryData,((t,e)=>(r(),h(i,{class:"dynamicshow",key:e},{default:d((()=>[t.type>0?(r(),h(i,{key:0,class:"dynamicshow_left"},{default:d((()=>[f(E,{class:"evaluationdata"},{default:d((()=>[m(g(t.questionContent),1)])),_:2},1024),"F0001"==t.code?(r(),h(E,{key:0},{default:d((()=>[m(" 心率："+g(t.type)+"/分 ",1)])),_:2},1024)):(r(),h(E,{key:1},{default:d((()=>[m(" 数量："+g(t.type)+"个 ",1)])),_:2},1024))])),_:2},1024)):(r(),h(i,{key:1,class:"dynamicshow_left"},{default:d((()=>[f(E,{class:"evaluationdata"},{default:d((()=>[m(g(t.questionContent),1)])),_:2},1024),f(E,{class:"noEvaText"},{default:d((()=>[m(" 暂未测试，快去测试吧 ")])),_:1})])),_:2},1024)),f(i,{class:"dynamicshow_right"},{default:d((()=>[f(i,{class:"circle",style:k("border: 4px solid "+t.typeColor+";")},{default:d((()=>[f(i,{class:"circleText",style:k("color:"+t.typeColor+";")},{default:d((()=>[m(g(t.typeText),1)])),_:2},1032,["style"])])),_:2},1032,["style"])])),_:2},1024)])),_:2},1024)))),128))])),_:1})])),_:1})])),_:1})])),_:1},8,["modelValue"])])),_:1})])),_:1}),l.openKey?(r(),h(i,{key:0},{default:d((()=>[f(i,{prop:l.canvasImageMsg,"change:prop":t.canvasImage.updateEcharts,id:"canvasImage"},null,8,["prop","change:prop"]),f(U,{type:"primary",class:"shareButton",icon:"../../static/app-plus/other/share.png",onClick:o.saveReport},{default:d((()=>[m("分享报告")])),_:1},8,["onClick"]),f(V,{show:l.showShare,"onUpdate:show":e[6]||(e[6]=t=>l.showShare=t),options:l.options,onSelect:o.onSelect,"cancel-text":"",class:"shareBlock"},null,8,["show","options","onSelect"])])),_:1})):w("",!0),l.openKey?w("",!0):(r(),h(i,{key:1},{default:d((()=>[f(i,{class:"buttontrue",onClick:e[7]||(e[7]=t=>l.showHistory=!0)},{default:d((()=>[m("历史评测记录 "),f(j,{src:I})])),_:1}),f(V,{show:l.showHistory,"onUpdate:show":e[8]||(e[8]=t=>l.showHistory=t),options:l.history,onSelect:o.onSelect,"cancel-text":"",class:"shareBlock"},null,8,["show","options","onSelect"])])),_:1}))])),_:1})}],["__scopeId","data-v-0974befd"]]);export{j as default};

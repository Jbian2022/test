import{E as a,V as e,a2 as t,N as s,a3 as l,a4 as c,J as n,a5 as d,o as u,a as i,w as o,i as f,b as r,d as m,e as p,t as _,A as g,B as h,F as k,p as y,v as b,x,C as v,q as I}from"./index.2d1e5cbb.js";import{_ as w}from"./uni-popup.2df5a944.js";import{r as L}from"./uni-app.es.142f3165.js";import{h as T}from"./html2canvas.esm.6be9d753.js";import{_ as D}from"./_plugin-vue_export-helper.cdc0426e.js";import"./uni-transition.c98c413f.js";const C={methods:{generateImage(a){setTimeout((()=>{const e=document.getElementById("training-detail");T(e,{width:e.clientWidth,height:e.clientHeight,scrollY:0,scrollX:0,x:0,y:0,useCORS:!0,allowTaint:!0,scale:1.3}).then((e=>{const t=e.toDataURL("image/png");a&&a(t)})).catch((a=>{}))}),300)},updateEcharts(a,e,t,s){a&&this.generateImage((e=>{t.callMethod("receiveRenderData",{name:a,base64:e})}))}}},N=a=>{a.$renderjs||(a.$renderjs=[]),a.$renderjs.push("canvasImage"),a.mixins||(a.mixins=[]),a.mixins.push({beforeCreate(){this.canvasImage=this},mounted(){this.$ownerInstance=this.$gcd(this,!0)}}),a.mixins.push(C)},M=a.importObject("train"),j={data:()=>({options:[{name:"分享到微信",icon:"../../static/app-plus/other/saveWechat.svg"},{name:"分享到朋友圈",icon:"../../static/app-plus/other/wechatMoments.svg"},{name:"保存到相册",icon:"../../static/app-plus/other/savePhone.svg"}],traineeTitle:"",trainDate:"",sumLoad:0,trainInfoList:[],baseUrl:null,url:null,canvasImageMsg:null,isFixedTop:!1}),onLoad:function(a){a.traineeNo&&(this.traineeNo=a.traineeNo,this.trainDate=a.trainDate,this.key=a.key,this.getTrainInfo())},onShow(){e()},onPageScroll(a){a.scrollTop>t().statusBarHeight?this.isFixedTop=!0:this.isFixedTop=!1},methods:{async getTrainInfo(){const a=await M.getTrainList({traineeNo:this.traineeNo,trainDate:this.trainDate});if(a.data&&a.data.length>0){const{trainContent:e}=a.data[0],t=JSON.parse(e)||[];t&&t.length>0&&(this.trainInfoList=t[this.key].data||[],this.traineeTitle=t[this.key].traineeTitle),this.sumLoad=this.trainInfoList.reduce((function(a,e){return+e.load+ +a}),0)}},onClickLeft(){s()},formaterTimes(a,e=3){const t=Math.floor(a/3600),s=Math.floor((a-3600*t)/60);return 3===e?t+"时"+s+"分"+(a-3600*t-60*s)+"秒":t+"时"+s+"分"},getMonthDay(a){const e=a=>a<10?"0"+a:a,t=new Date(a);t.getFullYear();return e(t.getMonth()+1)+"."+e(t.getDate())},getweekday:a=>new Array("日","一","二","三","四","五","六")[new Date(a).getDay()],onSelect(a){console.log(a,88),this.canvasImageMsg=a.name},async uploadImage(a){const e=await M.uploadBase64({base64:this.baseUrl});this.url=e.fileID,this.canvasImageMsg=null,a&&a(this.url)},downloadFile(){l({url:this.url,success:a=>{200===a.statusCode&&(console.log("下载成功",a),c({filePath:a.tempFilePath,success:a=>{console.log("保存成功！",a),e(),n({showCancel:!1,title:"提示",content:"图片已经保存到相册请查看",success:function(a){a.confirm?console.log("用户点击确定"):a.cancel&&console.log("用户点击取消")}})},fail:a=>{console.log("err",a)}}))}})},checkApp:()=>plus.runtime.isApplicationExist({pname:"bodybuildingApp.myapp",action:"weixin://"})?(console.log("微信应用已安装"),!0):(console.log("微信应用未安装"),!1),receiveRenderData(a){this.$refs.popup.close(),console.log(a.name,8888),this.baseUrl=a.base64,this.uploadImage((a=>{d({title:"加载中"})}))},openPopup(){this.$refs.popup.open()}}};N(j);const F=D(j,[["render",function(a,e,t,s,l,c){const n=y("van-icon"),d=f,T=y("van-image"),D=v,C=I,N=L(b("uni-popup"),w);return u(),i(d,{class:"training-record-detail"},{default:o((()=>[r(d,{class:p(["arrow-left",{show:l.isFixedTop}]),onClick:c.onClickLeft},{default:o((()=>[r(n,{name:"arrow-left"}),r(d,{class:"title"},{default:o((()=>[m("训练记录")])),_:1}),r(d,{class:"z",style:{opacity:"0"}},{default:o((()=>[m("8888")])),_:1})])),_:1},8,["class","onClick"]),r(d,{id:"training-detail"},{default:o((()=>[r(d,{class:"status_bar"}),r(d,{class:"backgroud-img"},{default:o((()=>[r(T,{src:"https://mp-4e6f1c48-a4dc-4897-a866-0a1a071023c3.cdn.bspapp.com/cloudstorage/af1f1238-0e5f-468a-9a00-120d347c451a.png"})])),_:1}),r(d,{class:"first-title-times"},{default:o((()=>[r(d,{class:"title"},{default:o((()=>[m(_(l.traineeTitle),1)])),_:1}),r(d,{class:"times"},{default:o((()=>[m(_(c.getMonthDay(l.trainDate)),1)])),_:1})])),_:1}),r(d,{class:"second-title-day"},{default:o((()=>[r(d,{class:"title"},{default:o((()=>[m("总负荷量："+_(l.sumLoad)+"kg",1)])),_:1}),r(d,{class:"day"},{default:o((()=>[m("星期"+_(c.getweekday(l.trainDate)),1)])),_:1})])),_:1}),r(d,{class:"info-list"},{default:o((()=>[(u(!0),g(k,null,h(l.trainInfoList,((a,e)=>(u(),i(d,{key:e},{default:o((()=>[0===a.type?(u(),i(d,{key:0,class:"info-item"},{default:o((()=>[r(d,{class:"item-header"},{default:o((()=>[r(d,{class:"img"},{default:o((()=>[a.url?(u(),i(T,{key:0,round:"",src:a.url},null,8,["src"])):(u(),i(T,{key:1,round:"",src:"https://mp-4e6f1c48-a4dc-4897-a866-0a1a071023c3.cdn.bspapp.com/cloudstorage/f1ecf80b-cf75-4017-9ae2-622fe72717e9.png"}))])),_:2},1024),r(d,{class:"des-info"},{default:o((()=>[r(d,{class:"des-title"},{default:o((()=>[m(_(a.actionName),1)])),_:2},1024),r(d,{class:"info-text"},{default:o((()=>[r(D,null,{default:o((()=>[m("负荷量："+_(a.load)+"kg",1)])),_:2},1024),r(D,null,{default:o((()=>[m("已完成："+_(a.frequency)+"次",1)])),_:2},1024)])),_:2},1024)])),_:2},1024)])),_:2},1024),r(d,{class:"detailed-data"},{default:o((()=>[(u(!0),g(k,null,h(a.groupList,((a,e)=>(u(),i(d,{key:e,class:"data-item"},{default:o((()=>[r(d,{class:"index"},{default:o((()=>[m(_(e+1),1)])),_:2},1024),r(d,{class:"data-info"},{default:o((()=>[r(d,{class:"kg"},{default:o((()=>[r(D,{class:"num"},{default:o((()=>[m(_(a.kg),1)])),_:2},1024),r(D,null,{default:o((()=>[m("kg")])),_:1})])),_:2},1024),r(d,{class:"x"},{default:o((()=>[m(" x ")])),_:1}),r(d,{class:"time"},{default:o((()=>[r(D,{class:"num"},{default:o((()=>[m(_(a.time),1)])),_:2},1024),r(D,null,{default:o((()=>[m("次")])),_:1})])),_:2},1024)])),_:2},1024)])),_:2},1024)))),128))])),_:2},1024)])),_:2},1024)):x("",!0),1===a.type?(u(),i(d,{key:1,class:"info-item"},{default:o((()=>[r(d,{class:"item-header"},{default:o((()=>[r(d,{class:"img"},{default:o((()=>[a.url?(u(),i(T,{key:0,round:"",src:a.url},null,8,["src"])):(u(),i(T,{key:1,round:"",src:"https://mp-4e6f1c48-a4dc-4897-a866-0a1a071023c3.cdn.bspapp.com/cloudstorage/f1ecf80b-cf75-4017-9ae2-622fe72717e9.png"}))])),_:2},1024),r(d,{class:"des-info"},{default:o((()=>[r(d,{class:"des-title"},{default:o((()=>[m(_(a.actionName),1)])),_:2},1024),r(d,{class:"info-text"},{default:o((()=>[r(D,null,{default:o((()=>[m("总里程："+_(a.mileage)+"km",1)])),_:2},1024),r(D,null,{default:o((()=>[m("用时："+_(c.formaterTimes(a.times)),1)])),_:2},1024)])),_:2},1024)])),_:2},1024)])),_:2},1024),r(d,{class:"detailed-data"},{default:o((()=>[(u(!0),g(k,null,h(a.groupList,((a,e)=>(u(),i(d,{key:e,class:"data-item"},{default:o((()=>[r(d,{class:"index"},{default:o((()=>[m(_(e+1),1)])),_:2},1024),r(d,{class:"data-info-km"},{default:o((()=>[r(D,{class:"num"},{default:o((()=>[m(_(a.km),1)])),_:2},1024),r(D,null,{default:o((()=>[m("km")])),_:1})])),_:2},1024),r(d,{class:"data-info-time"},{default:o((()=>[r(D,{class:"num"},{default:o((()=>[m(_(a.hour>=10?a.hour:"0"+a.hour)+":"+_(a.minute>=10?a.minute:"0"+a.minute)+":"+_(a.second>=10?a.second:"0"+a.second),1)])),_:2},1024)])),_:2},1024)])),_:2},1024)))),128))])),_:2},1024)])),_:2},1024)):x("",!0),2===a.type?(u(),i(d,{key:2,class:"info-item"},{default:o((()=>[r(d,{class:"item-header"},{default:o((()=>[r(d,{class:"img"},{default:o((()=>[a.url?(u(),i(T,{key:0,round:"",src:a.url},null,8,["src"])):(u(),i(T,{key:1,round:"",src:"https://mp-4e6f1c48-a4dc-4897-a866-0a1a071023c3.cdn.bspapp.com/cloudstorage/f1ecf80b-cf75-4017-9ae2-622fe72717e9.png"}))])),_:2},1024),r(d,{class:"des-info"},{default:o((()=>[r(d,{class:"des-title"},{default:o((()=>[m(_(a.actionName),1)])),_:2},1024),r(d,{class:"info-text"},{default:o((()=>[r(D,null,{default:o((()=>[m("已完成："+_(a.frequency)+"次",1)])),_:2},1024)])),_:2},1024)])),_:2},1024)])),_:2},1024),r(d,{class:"detailed-data"},{default:o((()=>[(u(!0),g(k,null,h(a.groupList,((a,e)=>(u(),i(d,{key:e,class:"data-item"},{default:o((()=>[r(d,{class:"index"},{default:o((()=>[m(_(e+1),1)])),_:2},1024),r(d,{class:"data-info"},{default:o((()=>[r(d,{class:"time"},{default:o((()=>[r(D,{class:"num"},{default:o((()=>[m(_(a.time),1)])),_:2},1024),r(D,null,{default:o((()=>[m("次")])),_:1})])),_:2},1024)])),_:2},1024)])),_:2},1024)))),128))])),_:2},1024)])),_:2},1024)):x("",!0),3===a.type?(u(),i(d,{key:3,class:"info-item"},{default:o((()=>[r(d,{class:"item-header"},{default:o((()=>[r(d,{class:"img"},{default:o((()=>[a.url?(u(),i(T,{key:0,round:"",src:a.url},null,8,["src"])):(u(),i(T,{key:1,round:"",src:"https://mp-4e6f1c48-a4dc-4897-a866-0a1a071023c3.cdn.bspapp.com/cloudstorage/f1ecf80b-cf75-4017-9ae2-622fe72717e9.png"}))])),_:2},1024),r(d,{class:"des-info"},{default:o((()=>[r(d,{class:"des-title"},{default:o((()=>[m(_(a.actionName),1)])),_:2},1024),r(d,{class:"info-text"},{default:o((()=>[r(D,null,{default:o((()=>[m("总用时："+_(c.formaterTimes(a.times)),1)])),_:2},1024)])),_:2},1024)])),_:2},1024)])),_:2},1024),r(d,{class:"detailed-data"},{default:o((()=>[(u(!0),g(k,null,h(a.groupList,((a,e)=>(u(),i(d,{key:e,class:"data-item"},{default:o((()=>[r(d,{class:"index"},{default:o((()=>[m(_(e+1),1)])),_:2},1024),r(d,{class:"data-info"},{default:o((()=>[r(d,{class:"time"},{default:o((()=>[r(D,{class:"num"},{default:o((()=>[m(_(a.hour>=10?a.hour:"0"+a.hour)+":"+_(a.minute>=10?a.minute:"0"+a.minute)+":"+_(a.second>=10?a.second:"0"+a.second),1)])),_:2},1024)])),_:2},1024)])),_:2},1024)])),_:2},1024)))),128))])),_:2},1024)])),_:2},1024)):x("",!0),4===a.type?(u(),i(d,{key:4,class:"info-item"},{default:o((()=>[r(d,{class:"item-header"},{default:o((()=>[r(d,{class:"img"},{default:o((()=>[a.url?(u(),i(T,{key:0,round:"",src:a.url},null,8,["src"])):(u(),i(T,{key:1,round:"",src:"https://mp-4e6f1c48-a4dc-4897-a866-0a1a071023c3.cdn.bspapp.com/cloudstorage/f1ecf80b-cf75-4017-9ae2-622fe72717e9.png"}))])),_:2},1024),r(d,{class:"des-info"},{default:o((()=>[r(d,{class:"des-title"},{default:o((()=>[m(_(a.actionName),1)])),_:2},1024),r(d,{class:"info-text"},{default:o((()=>[r(D,null,{default:o((()=>[m("负荷量："+_(a.load)+"kg",1)])),_:2},1024),r(D,null,{default:o((()=>[m("已完成："+_(a.frequency)+"次",1)])),_:2},1024)])),_:2},1024)])),_:2},1024)])),_:2},1024),r(d,{class:"detailed-data"},{default:o((()=>[(u(!0),g(k,null,h(a.groupList,((a,e)=>(u(),i(d,{key:e,class:"data-item"},{default:o((()=>[r(d,{class:"index"},{default:o((()=>[m(_(e+1),1)])),_:2},1024),r(d,{class:"data-info"},{default:o((()=>[r(d,{class:"kg"},{default:o((()=>[r(D,{class:"num"},{default:o((()=>[m(_(a.kg),1)])),_:2},1024),r(D,null,{default:o((()=>[m("kg")])),_:1})])),_:2},1024),r(d,{class:"x"},{default:o((()=>[m(" x ")])),_:1}),r(d,{class:"time"},{default:o((()=>[r(D,{class:"num"},{default:o((()=>[m(_(a.time),1)])),_:2},1024),r(D,null,{default:o((()=>[m("次")])),_:1})])),_:2},1024)])),_:2},1024)])),_:2},1024)))),128))])),_:2},1024)])),_:2},1024)):x("",!0),5===a.type?(u(),i(d,{key:5,class:"info-item"},{default:o((()=>[r(d,{class:"item-header"},{default:o((()=>[r(d,{class:"img"},{default:o((()=>[a.url?(u(),i(T,{key:0,round:"",src:a.url},null,8,["src"])):(u(),i(T,{key:1,round:"",src:"https://mp-4e6f1c48-a4dc-4897-a866-0a1a071023c3.cdn.bspapp.com/cloudstorage/f1ecf80b-cf75-4017-9ae2-622fe72717e9.png"}))])),_:2},1024),r(d,{class:"des-info"},{default:o((()=>[r(d,{class:"des-title"},{default:o((()=>[m(_(a.actionName),1)])),_:2},1024),r(d,{class:"info-text"},{default:o((()=>[r(D,null,{default:o((()=>[m("负荷量："+_(a.load)+"kg",1)])),_:2},1024),r(D,null,{default:o((()=>[m("已完成："+_(a.frequency)+"次",1)])),_:2},1024)])),_:2},1024)])),_:2},1024)])),_:2},1024),r(d,{class:"detailed-data"},{default:o((()=>[(u(!0),g(k,null,h(a.groupList,((a,e)=>(u(),i(d,{key:e,class:"data-item"},{default:o((()=>[r(d,{class:"index"},{default:o((()=>[m(_(e+1),1)])),_:2},1024),r(d,{class:"data-info"},{default:o((()=>[r(d,{class:"kg"},{default:o((()=>[r(D,{class:"num"},{default:o((()=>[m(_(a.kg),1)])),_:2},1024),r(D,null,{default:o((()=>[m("kg")])),_:1})])),_:2},1024),r(d,{class:"x"},{default:o((()=>[m(" x ")])),_:1}),r(d,{class:"time"},{default:o((()=>[r(D,{class:"num"},{default:o((()=>[m(_(a.time),1)])),_:2},1024),r(D,null,{default:o((()=>[m("次")])),_:1})])),_:2},1024)])),_:2},1024)])),_:2},1024)))),128))])),_:2},1024)])),_:2},1024)):x("",!0),6===a.type?(u(),i(d,{key:6,class:"info-item"},{default:o((()=>[r(d,{class:"item-header"},{default:o((()=>[r(d,{class:"img"},{default:o((()=>[a.url?(u(),i(T,{key:0,round:"",src:a.url},null,8,["src"])):(u(),i(T,{key:1,round:"",src:"https://mp-4e6f1c48-a4dc-4897-a866-0a1a071023c3.cdn.bspapp.com/cloudstorage/f1ecf80b-cf75-4017-9ae2-622fe72717e9.png"}))])),_:2},1024),r(d,{class:"des-info"},{default:o((()=>[r(d,{class:"des-title"},{default:o((()=>[m(_(a.actionName),1)])),_:2},1024),r(d,{class:"info-text"},{default:o((()=>[r(D,null,{default:o((()=>[m("总用时："+_(c.formaterTimes(a.times)),1)])),_:2},1024)])),_:2},1024)])),_:2},1024)])),_:2},1024),r(d,{class:"detailed-data"},{default:o((()=>[(u(!0),g(k,null,h(a.groupList,((a,e)=>(u(),i(d,{key:e,class:"data-item"},{default:o((()=>[r(d,{class:"index"},{default:o((()=>[m(_(e+1),1)])),_:2},1024),r(d,{class:"data-info"},{default:o((()=>[r(d,{class:"time"},{default:o((()=>[r(D,{class:"num"},{default:o((()=>[m(_(a.hour>=10?a.hour:"0"+a.hour)+":"+_(a.minute>=10?a.minute:"0"+a.minute)+":"+_(a.second>=10?a.second:"0"+a.second),1)])),_:2},1024)])),_:2},1024)])),_:2},1024)])),_:2},1024)))),128))])),_:2},1024)])),_:2},1024)):x("",!0)])),_:2},1024)))),128))])),_:1})])),_:1}),r(d,{class:"footer-button"},{default:o((()=>[r(d,{class:"van-button",onClick:c.openPopup},{default:o((()=>[r(d,{class:"share-icon"}),m("炫耀一下")])),_:1},8,["onClick"])])),_:1}),r(d,{prop:l.canvasImageMsg,"change:prop":a.canvasImage.updateEcharts,id:"canvasImage"},null,8,["prop","change:prop"]),r(N,{ref:"popup",type:"bottom","mask-background-color":"rgba(20, 21, 23, 0.6)"},{default:o((()=>[r(d,{class:"share-sheet"},{default:o((()=>[(u(!0),g(k,null,h(l.options,((a,e)=>(u(),i(d,{class:"item",key:e,onClick:e=>c.onSelect(a)},{default:o((()=>[r(C,{class:"img",round:"",src:a.icon},null,8,["src"]),r(d,{class:"text"},{default:o((()=>[m(_(a.name),1)])),_:2},1024)])),_:2},1032,["onClick"])))),128))])),_:1})])),_:1},512)])),_:1})}],["__scopeId","data-v-c8882f04"]]);export{F as default};
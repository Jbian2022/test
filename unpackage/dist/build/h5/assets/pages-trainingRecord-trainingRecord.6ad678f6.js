import{o as t,a as e,w as a,b as s,r as n,d as i,t as o,A as l,B as r,F as d,e as c,i as h,U as u,X as f,E as m,H as D,k as g,p,q as y}from"./index.3c07bbe7.js";import{h as b}from"./moment.882eb434.js";import{_ as v}from"./_plugin-vue_export-helper.cdc0426e.js";const w=v({name:"calendar",props:{value:{required:!0,type:[Number,String,Date],default:()=>new Date},format:{type:[String],default:"YYYY年MM月DD日"},mode:{type:String,default:"single"},todayDisabled:{type:Boolean,default:!1}},data:()=>({dataList:[],weekList:["一","二","三","四","五","六","日"],touchStartX:0,touchStartY:0,transitionClass:""}),onShow(){this.transitionClass=""},methods:{render(){const t=b(new Date(this.value)).subtract(1,"months").daysInMonth(),e=b(new Date(this.value)).date(1).weekday();let a=e;1===e&&(a=6),0===e&&(a=7);const s=b(new Date(this.value)).daysInMonth(),n=[];for(let l=t;l>t-a+1;l--){const t=b(new Date(this.value)).subtract(1,"months").date(l).format("YYYY-MM-DD"),e=b(new Date(this.value)).subtract(1,"months").date(l).format("dddd");n.unshift({key:l,type:"prev",isSelected:!1,day:t,week:e})}for(let l=1;l<s+1;l++){const t=b(new Date(this.value)).date(l).format("YYYY-MM-DD"),e=b(new Date(this.value)).date(l).format("dddd");n.push({key:l,type:"current",isSelected:!1,day:t,week:e,disabled:!1})}const i=42-n.length;for(var o=1;o<i+1;o++){const t=b(new Date(this.value)).add(1,"months").date(o).format("YYYY-MM-DD"),e=b(new Date(this.value)).add(1,"months").date(o).format("dddd");n.push({key:o,type:"next",isSelected:!1,day:t,week:e})}if(this.todayDisabled&&n.forEach((t=>{"current"===t.type&&+new Date(t.day)<+new Date(this.formatDate(this.value))&&(t.disabled=!0)})),this.formatDate(this.value)===this.formatDate(new Date)){const t=n.findIndex((t=>this.formatDate(new Date)===t.day));t>-1&&(n[t].isSelected=!0)}this.dataList=n},prevMonth(){const t=b(new Date(this.value)).subtract(1,"months").toDate();this.$emit("update:value",t)},nextMonth(){const t=b(new Date(this.value)).add(1,"months").toDate();this.$emit("update:value",t)},currentMonth(){this.$emit("update:value",new Date)},select(t){if("object"!==t.typeof){const e=this.dataList.findIndex((e=>e.day===this.formatDate(t)));return e>-1&&(this.dataList[e].isSelected=!0),!1}return t.forEach((t=>{const e=this.dataList.findIndex((e=>e.day===this.formatDate(t)));e>-1&&(this.dataList[e].isSelected=!0)})),!1},selectHandle(t){t.disabled||"current"===t.type&&("single"===this.mode&&this.dataList.forEach((t=>{t.isSelected=!1})),t.isSelected=!0),this.$emit("select",t)},getSelection(){return this.dataList.filter((t=>t.isSelected))},formatDate:(t,e="YYYY-MM-DD")=>b(new Date(t)).format(e),getCurrentData(){return this.dataList},touchStart(t){console.log("触摸开始"),this.touchStartX=t.touches[0].clientX,this.touchStartY=t.touches[0].clientY},touchEnd(t){console.log("触摸结束");let e=t.changedTouches[0].clientX-this.touchStartX,a=t.changedTouches[0].clientY-this.touchStartY;Math.abs(e)>50&&Math.abs(e)>Math.abs(a)?e>=0?(console.log("左滑"),this.leftMove()):(console.log("右滑"),this.rightMove()):Math.abs(a)>50&&Math.abs(e)<Math.abs(a)?a<0?console.log("上滑"):console.log("下滑"):console.log("可能是误触！")},rightMove(){this.transitionClass="left-start";const t=setTimeout((()=>{this.nextMonth(),this.transitionClass="left-end",clearTimeout(t)}),300)},leftMove(){this.transitionClass="right-start";const t=setTimeout((()=>{this.prevMonth(),this.transitionClass="right-end",clearTimeout(t)}),300)}},watch:{value:{immediate:!0,handler:function(){this.render()}}}},[["render",function(m,D,g,p,y,b){const v=h,w=u;return t(),e(v,{class:"calendar"},{default:a((()=>[s(v,{class:"calendar-operation"},{default:a((()=>[s(v,{class:"left"},{default:a((()=>[n(m.$slots,"operation-left",{item:g.value},(()=>[i(o(b.formatDate(g.value,"YYYY年MM月")),1)]),!0)])),_:3}),s(v,{class:"right"},{default:a((()=>[n(m.$slots,"operation-right",{item:g.value},(()=>[s(w,{class:"operation-right-btn",onClick:b.prevMonth},{default:a((()=>[i("上个月")])),_:1},8,["onClick"]),s(w,{class:"operation-right-btn",onClick:b.currentMonth},{default:a((()=>[i("今天")])),_:1},8,["onClick"]),s(w,{class:"operation-right-btn",onClick:b.nextMonth},{default:a((()=>[i("下个月")])),_:1},8,["onClick"])]),!0)])),_:3})])),_:3}),s(v,{class:"calendar-header"},{default:a((()=>[(t(!0),l(d,null,r(y.weekList,((s,i)=>(t(),e(v,{key:i},{default:a((()=>[n(m.$slots,"header",{},(()=>[f("span",{class:"calendar-header-title"},o(s),1)]),!0)])),_:2},1024)))),128))])),_:3}),s(v,{class:"transition"},{default:a((()=>[s(v,{class:c(["calendar-content",[y.transitionClass]]),onTouchstart:b.touchStart,onTouchend:b.touchEnd},{default:a((()=>[(t(!0),l(d,null,r(y.dataList,((l,r)=>(t(),e(v,{key:r,class:c([l.type]),onClick:t=>b.selectHandle(l)},{default:a((()=>[n(m.$slots,"default",{cell:l},(()=>[s(v,{class:c(["calendar-data-item",{"is-selected":l.isSelected}])},{default:a((()=>[i(o(l.key),1)])),_:2},1032,["class"])]),!0)])),_:2},1032,["class","onClick"])))),128))])),_:3},8,["class","onTouchstart","onTouchend"])])),_:3})])),_:3})}],["__scopeId","data-v-df445ca2"]]),k=m.importObject("train");const M=v({components:{calendar:w},data:()=>({trainListInfo:{},trainDate:null,memberName:"",value:new Date,showTipes:!0}),onLoad:function(t){t.traineeNo&&(this.traineeNo=t.traineeNo,this.memberName=t.memberName,this.getTrainList())},onShow(){this.showTipes=!0;const t=setTimeout((()=>{this.showTipes=!1,clearTimeout(t)}),3e3)},methods:{async getTrainList(){const t=await k.getTrainList({traineeNo:this.traineeNo});if(t.data&&t.data.length>0){const e={};t.data.forEach((t=>{e[t.trainDate]=t.traineeTitle})),this.trainListInfo=e}},onClickLeft(){D({url:"/pages/myMebers/myMebers"})},selectHandle(t){t.disabled||t.day===this.getDay(new Date)?this.sharePage(t.day):g({url:`/pages/newWorkout/newWorkout?traineeNo=${this.traineeNo}&trainDate=${t.day}&traineeName=${this.memberName}`})},addWorkout(){g({url:`/pages/newWorkout/newWorkout?traineeNo=${this.traineeNo}&trainDate=${this.getDay(new Date)}&traineeName=${this.memberName}`})},sharePage(t){g({url:`/pages/trainingRecordDetail/trainingRecordDetail?traineeNo=${this.traineeNo}&trainDate=${t}&traineeName=${this.memberName}`})},getYearMonth(t){const e=new Date(t);var a;return e.getFullYear()+"."+((a=e.getMonth()+1)<10?"0"+a:a)},getDay(t){const e=t=>t<10?"0"+t:t,a=new Date(t);return a.getFullYear()+"-"+e(a.getMonth()+1)+"-"+e(a.getDate())},getTrainTitle(t){return this.trainListInfo[t]||""}}},[["render",function(n,l,r,d,u,f){const m=h,D=y("van-nav-bar"),g=y("calendar");return t(),e(m,{class:"training-record"},{default:a((()=>[s(m,{class:"background-header"}),s(m,{class:"background"}),s(m,{class:"status_bar"}),s(D,{title:u.memberName,"left-text":"返回主页","left-arrow":"",onClickLeft:f.onClickLeft},null,8,["title","onClickLeft"]),s(m,{class:"calendar"},{default:a((()=>[s(g,{value:u.value,"onUpdate:value":l[0]||(l[0]=t=>u.value=t),ref:"calendar",todayDisabled:"",onSelect:f.selectHandle},{"operation-left":a((()=>[s(m,{class:"calendar-title"},{default:a((()=>[i("训练记录")])),_:1})])),"operation-right":a((({item:t})=>[s(m,{class:"calendar-date"},{default:a((()=>[i(o(f.getYearMonth(t)),1)])),_:2},1024)])),default:a((({cell:n})=>[s(m,{class:"cell-box"},{default:a((()=>[s(m,{class:c(["cell-key",{active:n.isSelected}])},{default:a((()=>[i(o(n.key),1)])),_:2},1032,["class"]),f.getTrainTitle(n.day)?(t(),e(m,{key:0,class:"cell-label"},{default:a((()=>[i(o(f.getTrainTitle(n.day)),1)])),_:2},1024)):p("",!0)])),_:2},1024)])),_:1},8,["value","onSelect"])])),_:1}),s(m,{class:"footer-button"},{default:a((()=>[u.showTipes?(t(),e(m,{key:0,class:"tipes"},{default:a((()=>[i(" 开始今日训练吧 ")])),_:1})):p("",!0),s(m,{class:"add-button",onClick:f.addWorkout},null,8,["onClick"])])),_:1})])),_:1})}],["__scopeId","data-v-4c458244"]]);export{M as default};

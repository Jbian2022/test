import{E as e,Q as a,k as s,a6 as n,o as t,a as l,w as o,i as u,b as c,d as r,t as i,q as m}from"./index.3c07bbe7.js";import{_ as d}from"./_plugin-vue_export-helper.cdc0426e.js";const f=e.importObject("my");const p=d({data:()=>({show:!1,actions:[{name:"拍照上传"},{name:"本地上传"}],userInfo:{username:"",avatar:null,gender:null,comment:null}}),mounted(){this.getUserInfo()},methods:{async getUserInfo(){const e=await f.getUserInfo(),{avatar:a,username:s,gender:n,comment:t}=e.data;this.userInfo={avatar:a||null,username:s||"用户名",gender:0===n?"未知":1===n?"男":2===n?"女":null,comment:t},console.log(e,88888)},onClickLeft(){a({url:"/pages/my/my"})},updateSignature(e){s({url:"/pages/updateSignature/updateSignature?type="+e})},selectHandle(e){"拍照上传"===e.name?this.uploadImage("camera"):"本地上传"===e.name&&this.uploadImage("album")},uploadImage(a){n({count:1,sizeType:["compressed"],extension:["jpg","jpeg","png"],sourceType:[a],success:async a=>{if(a.tempFiles&&a.tempFiles.length>0){const s=await e.uploadFile({cloudPath:Date.now()+"-"+a.tempFiles[0].name,filePath:a.tempFilePaths[0]}),n=await f.updateUserInfo({avatar:s.fileID});this.getUserInfo(),console.log(n)}},fail:()=>{}})}}},[["render",function(e,a,s,n,d,f){const p=u,g=m("van-icon"),h=m("van-image"),I=m("van-cell"),v=m("van-action-sheet");return t(),l(p,{class:"personal-info"},{default:o((()=>[c(p,{class:"status_bar"}),c(p,{class:"arrow-left",onClick:f.onClickLeft},{default:o((()=>[c(g,{name:"arrow-left"})])),_:1},8,["onClick"]),c(p,{class:"header"},{default:o((()=>[c(p,{class:"user-name",onClick:a[0]||(a[0]=e=>f.updateSignature("username"))},{default:o((()=>[r(i(d.userInfo.username||""),1)])),_:1}),c(p,{class:"user-logo",onClick:a[1]||(a[1]=e=>d.show=!0)},{default:o((()=>[c(h,{class:"img",round:"",src:d.userInfo.avatar},null,8,["src"])])),_:1})])),_:1}),c(p,{class:"form"},{default:o((()=>[c(p,{class:"form-content"},{default:o((()=>[c(I,{title:"性别",value:d.userInfo.gender,"is-link":"",onClick:a[2]||(a[2]=e=>f.updateSignature("gender"))},null,8,["value"]),c(I,{title:"签名",value:d.userInfo.comment,"is-link":"",onClick:a[3]||(a[3]=e=>f.updateSignature("comment"))},null,8,["value"])])),_:1})])),_:1}),c(v,{show:d.show,"onUpdate:show":a[4]||(a[4]=e=>d.show=e),actions:d.actions,"cancel-text":"取消","close-on-click-action":"",onSelect:f.selectHandle},null,8,["show","actions","onSelect"])])),_:1})}],["__scopeId","data-v-156f05e4"]]);export{p as default};
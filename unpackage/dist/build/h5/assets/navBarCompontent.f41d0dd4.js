import{N as s,H as a,o as t,a as e,w as l,b as o,d as n,t as _,p as c,u as r,i,C as f}from"./index.3c07bbe7.js";import{_ as p}from"./back.83fd7f48.js";import{_ as u}from"./_plugin-vue_export-helper.cdc0426e.js";const d=u({name:"navBarCompontent",props:["leftNavTitle","contentTitle","jumpType","isAuthority"],data:()=>({}),methods:{goBack(){if("TCBGTX"===this.jumpType)a({url:"/pages/myMebers/myMebers"});else s()}}},[["render",function(s,a,u,d,y,m){const v=r,b=i,T=f;return t(),e(b,{class:"nav_bar_style"},{default:l((()=>[o(b,{class:"nav_left_style",onClick:m.goBack},{default:l((()=>[o(v,{class:"back_img_style",src:p}),o(b,{class:"nav_title_style"},{default:l((()=>[n(_(u.leftNavTitle),1)])),_:1})])),_:1},8,["onClick"]),o(T,{class:"nav_content_style"},{default:l((()=>[n(_(u.contentTitle),1)])),_:1}),o(b,{class:"nav_right_style"},{default:l((()=>[u.isAuthority?(t(),e(T,{key:0,class:"authority_style"},{default:l((()=>[n("数据评测来源于世界权威机构")])),_:1})):c("",!0)])),_:1})])),_:1})}],["__scopeId","data-v-20a66bf6"]]);export{d as N};
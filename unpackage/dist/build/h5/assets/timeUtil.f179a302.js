var e={getCommonTime:function(t=new Date,n=8){let m={};const a=60*t.getTimezoneOffset()*1e3+60*n*60*1e3,{year:g,month:r,day:o,hour:u,minute:i,second:s}=e.getFullTime(t,2);m.now={year:g,month:r,day:o,hour:u,minute:i,second:s};let D=new Date(g,r,0).getDate(),h=new Date(g,12,0).getDate();m.todayStart=new Date(`${g}/${r}/${o}`).getTime()-a,m.today12End=new Date(`${g}/${r}/${o}`).getTime()+43199999-a,m.todayEnd=new Date(`${g}/${r}/${o}`).getTime()+86399999-a,m.monthStart=new Date(`${g}/${r}/1`).getTime()-a,m.monthEnd=new Date(`${g}/${r}/${D}`).getTime()+86399999-a,m.yearStart=new Date(`${g}/1/1`).getTime()-a,m.yearEnd=new Date(`${g}/12/${h}`).getTime()+86399999-a;let l=e.getWeekStartAndEnd(0,t);m.weekStart=l.weekStart,m.weekEnd=l.weekEnd,m.months=[],m.months[0]={monthStart:m.monthStart,monthEnd:m.monthEnd};for(let e=1;e<=12;e++){let t=new Date(g,e,0).getDate(),n=new Date(`${g}/${e}/1`).getTime()-a,r=new Date(`${g}/${e}/${t}`).getTime()+86399999-a;m.months[e]={monthStart:n,monthEnd:r}}return m},timeFormat:function(e,t="yyyy-MM-dd hh:mm:ss",n=8){if(!e)return"";let m;"number"==typeof e?(10==e.toString().length&&(e*=1e3),m=new Date(e)):m=e;const a=60*m.getTimezoneOffset()*1e3+60*n*60*1e3,g=m.getTime()+a;m=new Date(g);let r={"M+":m.getMonth()+1,"d+":m.getDate(),"h+":m.getHours(),"m+":m.getMinutes(),"s+":m.getSeconds(),"q+":Math.floor((m.getMonth()+3)/3),S:m.getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,(m.getFullYear()+"").substr(4-RegExp.$1.length)));for(let o in r)new RegExp("("+o+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?r[o]:("00"+r[o]).substr((""+r[o]).length)));return t},getFullTime:function(e,t=0,n=8){if(!e)return"";"number"==typeof e&&(e=new Date(e));const m=60*e.getTimezoneOffset()*1e3+60*n*60*1e3,a=e.getTime()+m;let g=(e=new Date(a)).getFullYear()+"",r=e.getMonth()+1<10?"0"+(e.getMonth()+1):e.getMonth()+1,o=e.getDate()<10?"0"+e.getDate():e.getDate(),u=e.getHours()<10?"0"+e.getHours():e.getHours(),i=e.getMinutes()<10?"0"+e.getMinutes():e.getMinutes(),s=e.getSeconds()<10?"0"+e.getSeconds():e.getSeconds();return 2===t?{YYYY:Number(g),MM:Number(r),DD:Number(o),hh:Number(u),mm:Number(i),ss:Number(s),year:Number(g),month:Number(r),day:Number(o),hour:Number(u),minute:Number(i),second:Number(s)}:1===t?g+""+r+o+u+i+s:g+"-"+r+"-"+o+" "+u+":"+i+":"+s},getWeekStartAndEnd:function(t=0,n=new Date,m=8){let a={};const g=60*n.getTimezoneOffset()*1e3+60*m*60*1e3,r=n.getTime()+g,o=new Date(r);let u=o.getDay();o.getDate();let i=864e5;n=new Date(n.getTime()+6048e5*t);let s=0!=u?u-1:6,D=new Date(n.getTime()-i*s),h=new Date(D.getTime()+5184e5),l=e.getFullTime(D,2),d=e.getFullTime(h,2);return a.weekStart=new Date(`${l.year}/${l.month}/${l.day}`).getTime()-g,a.weekEnd=new Date(`${d.year}/${d.month}/${d.day}`).getTime()+86399999-g,a}};export{e as u};

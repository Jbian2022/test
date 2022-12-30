const t=(t,n)=>{var e,o=n||200;return function(){var n=this,r=arguments;e&&clearTimeout(e),e=setTimeout((function(){e=null,t.apply(n,r)}),o)}};export{t as d};

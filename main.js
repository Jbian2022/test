import App from './App'



// #ifndef VUE3
import Vue from 'vue'
import Vant from 'vant';
import 'vant/lib/index.css'
Vue.use(vant)
Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
	...App
})
app.$mount()
// #endif


// #ifdef VUE3
import {createSSRApp} from 'vue'
import Vant from 'vant';
import 'vant/lib/index.css'

export function createApp() {
	const app = createSSRApp(App)
	app.use(Vant)
	return {app}
}
// #endif
// const routeInterceptor = () => {
// 	const methodToPatch = ["navigateTo", "redirectTo", "switchTab", "navigateBack"];
// 	methodToPatch.map((type) => {
// 		// 通过遍历的方式分别取出，uni.navigateTo、uni.redirectTo、uni.switchTab、uni.navigateBack// 并且对相应的方法做重写const original = uni[type];uni[item] = function (options = {}) {if (!token) {// 判断是否存在token，不存在重定向到登录页uni.navigateTo({url: "/login",});} else {return original.call(this, opt);}};});
// })
// }
// routeInterceptor() 

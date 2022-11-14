import App from './App'
import i18n from './lang/i18n'


// #ifndef VUE3
import Vue from 'vue'
import Vant from 'vant';
import 'vant/lib/index.css'
Vue.use(vant)
Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
	i18n,
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
	app.use(i18n)
	app.use(Vant)
	return {app}
}
// #endif

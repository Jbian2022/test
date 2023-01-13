// import uniStarterConfig from '@/uni-starter.config.js';
//应用初始化页
// #ifdef APP-PLUS
import checkUpdate from '@/uni_modules/uni-upgrade-center-app/utils/check-update';
import callCheckVersion from '@/uni_modules/uni-upgrade-center-app/utils/call-check-version';

// 实现，路由拦截。当应用无访问摄像头/相册权限，引导跳到设置界面 https://ext.dcloud.net.cn/plugin?id=5095
import interceptorChooseImage from '@/uni_modules/json-interceptor-chooseImage/js_sdk/main.js';
interceptorChooseImage()

// #endif
const db = uniCloud.database()
export default async function() {
	// const debug = uniStarterConfig.debug;

	// uniStarterConfig挂载到getApp().globalData.config
	// setTimeout(() => {
	// 	getApp({
	// 		allowDefault: true
	// 	}).globalData.config = uniStarterConfig;
	// }, 1)


	// 初始化appVersion（仅app生效）
	initAppVersion();

	//clientDB的错误提示
	function onDBError({
		code, // 错误码详见https://uniapp.dcloud.net.cn/uniCloud/clientdb?id=returnvalue
		message
	}) {
		console.log('onDBError', {
			code,
			message
		});
		// 处理错误
		console.error(code, message);
	}
	// 绑定clientDB错误事件
	// db.on('error', onDBError)


	//拦截云对象请求
	uniCloud.interceptObject({
		async invoke({
			objectName, // 云对象名称
			methodName, // 云对象的方法名称
			params // 参数列表
		}) {
			// console.log('interceptObject',{
			// 	objectName, // 云对象名称
			// 	methodName, // 云对象的方法名称
			// 	params // 参数列表
			// });
			// 接入自己逻辑
				console.log(objectName, 'objectName')
				console.log(methodName, 'methodName')
				// 后台到前台
		
				   // 校验token的合法性每个接口都要加token
				   // let whiteCloudName = ['']
				if(objectName == "login") {
					
				} else {
				   uni.getStorage({
				     key: 'uni_id_token',
				     success: function (res) {
				       // console.log(res, '我是token')
				       if (res.data) {
				         let login = uniCloud.importObject('login',{
						  customUI: true // 取消自动展示的交互提示界面
						})
				         login
				           .checkToken(res.data)
				           .then((checkTokenRes) => {
				             // console.log(checkTokenRes, 'token 换取')
							  plus.navigator.closeSplashscreen(); //关闭启动页，进入首页
				           })
				           .catch((err) => {
				             console.log(err, '我是错误')
							 	let tokenExpired = uniCloud.getCurrentUserInfo().tokenExpired
							 		if (tokenExpired > 0) {
										setTimeout(()=> {
							 			login.logout()
										},100)
										setTimeout(()=> {
											uni.clearStorage()
											uni.reLaunch({
											  url: '/pages/logining/logining'
											})
										}, 200)
										return
							 		}
									if (tokenExpired == 0) {
										uni.clearStorage()
										uni.reLaunch({
										  url: '/pages/logining/logining'
										})
									}
							 			
		
							 
				           })
				       }
				     },
				     fail: function (err) {
						  let login = uniCloud.importObject('login',{
							  customUI: true // 取消自动展示的交互提示界面
							})
						 let tokenExpired = uniCloud.getCurrentUserInfo().tokenExpired
						 	if (tokenExpired > 0) {
						 		setTimeout(()=> {
						 		login.logout()
						 		},100)
						 		setTimeout(()=> {
						 			uni.clearStorage()
						 			uni.reLaunch({
						 			  url: '/pages/logining/logining'
						 			})
						 		}, 200)
						 		return
						 	}
						 	if (tokenExpired == 0) {
						 		uni.clearStorage()
						 		uni.reLaunch({
						 		  url: '/pages/logining/logining'
						 		})
						 	}
						 		
				     }
				   })
				}
				 	
		},
		success(e) {
			// console.log(e);
		},
		complete() {

		},
		fail(e){
			// console.error(e);
			// if (debug) {
			// 	uni.showModal({
			// 		content: JSON.stringify(e),
			// 		showCancel: false
			// 	});
			// }else{
			// 	uni.showToast({
			// 		title: '系统错误请稍后再试',
			// 		icon:'error'
			// 	});
			// }
		}
	})


	// #ifdef APP-PLUS
	// 监听并提示设备网络状态变化
	uni.onNetworkStatusChange(res => {
		// console.log(res.isConnected);
		// console.log(res.networkType);
		if (res.networkType != 'none') {
			// uni.showToast({
			// 	title: '当前网络类型：' + res.networkType,
			// 	icon: 'none',
			// 	duration: 3000
			// })
		} else {
			// uni.showToast({
			// 	title: '网络类型：' + res.networkType,
			// 	icon: 'none',
			// 	duration: 3000
			// })
		}
	});
	// #endif

}
/**
 * // 初始化appVersion
 */
function initAppVersion() {
	// #ifdef APP-PLUS
	let appid = plus.runtime.appid;
	// console.log(plus.runtime.appid, 'plus.runtime.appid')
	plus.runtime.getProperty(appid, (wgtInfo) => {
		let appVersion = plus.runtime;
		let currentVersion = appVersion.versionCode > wgtInfo.versionCode ? appVersion : wgtInfo;
		getApp({
			allowDefault: true
		}).appVersion = {
			...currentVersion,
			appid,
			hasNew: false
		}
		// 检查更新小红点
		callCheckVersion().then(res => {
			// console.log('检查是否有可以更新的版本', res);
			if (res.result.code > 0) {
				// 有新版本
				getApp({
					allowDefault: true
				}).appVersion.hasNew = true;
			}
		})
	});
	// 检查更新
	// #endif
}
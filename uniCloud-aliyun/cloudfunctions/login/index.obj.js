// 云对象教程: https://uniapp.dcloud.net.cn/uniCloud/cloud-obj
// jsdoc语法提示教程：https://ask.dcloud.net.cn/docs/#//ask.dcloud.net.cn/article/129
const uniID = require('uni-id')
uniID.init({ // 如果在此处传入配置信息则不会再使用config.json作为配置
	"passwordSecret": "passwordSecret-demo", // 用于加密用户密码
	"tokenSecret": "tokenSecret-demo", // 用于生成token
	"tokenExpiresIn": 7200, // token过期时间
	"passwordErrorLimit": 6, // 同一个ip密码错误最大重试次数
	"passwordErrorRetryTime": 3600, // 超过密码重试次数之后的等待时间
	"service": {
		"sms": {
			"name": "your app name", // 应用名称对应uniCloud.sendSms的data参数内的name
			"codeExpiresIn": 180, // 验证码过期时间，单位：秒，只可取60的整数倍，不填此参数时会取默认值180秒
			"smsKey": "your sms key", // 短信密钥key
			"smsSecret": "your sms secret" // 短信密钥secret
		}
	}
})
module.exports = {
	_before: function () { // 通用预处理器

	},
	/**
	 * method1方法描述
	 * @param {string} param1 参数1描述
	 * @returns {object} 返回值描述
	 */
	/* 
	method1(param1) {
		// 参数校验，如无参数则不需要
		if (!param1) {
			return {
				errCode: 'PARAM_IS_NULL',
				errMsg: '参数不能为空'
			}
		}
		// 业务逻辑
		
		// 返回结果
		return {
			param1 //请根据实际需要返回值
		}
	}
	*/
   // 用户名注册
   register: function(event,context) {
	   const {
	   		username,
	   		password
	   	} = event
	     //自己额外增加的校验密码规范的逻辑（可选）
	     //强弱密码校验,密码至少包含大写字母，小写字母，数字，且不少于6位
	     if(!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{6,16}$/.test(password)){
	       return {
	         code: 401,
	         msg: '密码至少包含大写字母，小写字母，数字，且不少于6位'
	       }
	     }
	   	// 自动验证用户名是否与已经注册的用户名重复，如果重复会直接返回错误。否则会自动生成token并加密password存储username、password、token到数据表uni-id-users，并返回如上响应参数
	   	const res = await uniID.register({ //支持传入任何值，比如可以直接传入mobile即可设置手机号码，切勿直接传入event否则这是一个极大的安全问题
	   	    username,
	   	    password
	   	})
	   	return res
   },
   // 校验token
   checkToken: function(event,context) {
	   const payload = await uniID.checkToken(event.uniIdToken)
	     const {
	       code,
	       token,
	       tokenExpired
	     } = payload
	     if(code) { // code不为0代表token校验未通过
	       return payload
	     }
	     // 其他业务代码
	     return {
	       token,
	       tokenExpired
	     }
   },
   // 登出
   logout: function(event,context) {
	   const res = await uniID.logout(event.uniIdToken)
	   	return res
   },
   // 设置用户头像
   setAvatar: function(event, context) {
	  const {
	  		avatar
	  	} = event
	    const payload = await uniID.checkToken(event.uniIdToken)
	    if(payload.code) {
	      return payload
	    }
	  	const res = await uniID.setAvatar({
	      uid: payload.uid,
	  		avatar
	  	})
	  	return res 
   },
   // 更新用户信息
   updateUser: function(event, context) {
	    payload = await uniID.checkToken(event.uniIdToken)
	     if (payload.code) {
	     	return payload
	     }
	   	const res = await uniID.updateUser({
	       uid: payload.uid,
	       nickname: 'user nickname'
	     })
	   	return res
   },
   // 获取用户信息
   getUserInfo: function(event, context) {
	    payload = await uniID.checkToken(event.uniIdToken)
	     if (payload.code) {
	     	return payload
	     }
	   	const res = await uniID.getUserInfo({
	       uid: payload.uid,
	       field: ['mobile']
	     })
	   	return res
   },
   // 获取用户信息token
   getUserInfoByToken: function (event, context) {
	   const res = await uniID.getUserInfoByToken(event.uniIdToken)
	   	return res
   },
   // 短信验证码登录
   sendSmsCode: function (event, context) {
	  const {
	  		mobile
	  	} = event
	    // 生成验证码可以按自己的需求来，这里以生成6位数字为例
	    const randomStr = '00000' + Math.floor(Math.random() * 1000000)
	    const code = randomStr.substring(randomStr.length - 6)
	  	const res = await uniID.sendSmsCode({
	  		mobile,
	      code,
	      type: 'login'
	  	})
	  	return res 
   }
   // 自行设置验证码
   setVerifyCode: function (event, context) {
	   const {
	   		mobile
	   	} = event
	     // 生成验证码可以按自己的需求来，这里以生成6位数字为例
	     const randomStr = '00000' + Math.floor(Math.random() * 1000000)
	     const code = randomStr.substring(randomStr.length - 6)
	   	const res = await uniID.setVerifyCode({
	   		mobile,
	       code,
	       expiresIn: 180,
	       type: 'login'
	   	})
	   	return res
   },
   //  校验验证码
   verifyCode: function (event, context) {
	   const {
	   		mobile,
	       code
	   	} = event
	   	const res = await uniID.verifyCode({
	   		mobile,
	       code,
	       type: 'login'
	   	})
	   	return res
   },
   // 手机号验证码直接登录
   loginBySms: function (event, context) {
	   const {
	   		mobile,
	       code
	   	} = event
	   	const res = await uniID.loginBySms({
	   		mobile,
	       code
	   	})
	   	return res
   },
   // 手机一键登录
   loginByUniverify: function (event, context) {
	  const {
	  		access_token,
	      openid
	  	} = event
	  	const res = await uniID.loginByUniverify({
	  		access_token,
	      openid
	  	})
	  	return res 
   },
   // 绑定手机号
   bindMobile: function (event,context) {
	   const {
	   		mobile,
	       code
	   	} = event
	     const payload = await uniID.checkToken(event.uniIdToken)
	     if(payload.code) {
	       return payload
	     }
	   	const res = await uniID.bindMobile({
	       uid: payload.uid,
	   		mobile,
	       code
	   	})
	   	return res
   },
   // 解绑手机
   unbindMobile:  function (event,context) {
	 const {
	 		mobile,
	     code
	 	} = event
	   const payload = await uniID.checkToken(event.uniIdToken)
	   if(payload.code) {
	     return payload
	   }
	 	const res = await uniID.unbindMobile({
	     uid: payload.uid,
	 		mobile,
	     code
	 	})
	 	return res

   },
   // 邮箱验证码直接登录
   
   loginByEmail:  function (event,context) {
   const {
   		email,
       code
   	} = event
   	const res = await uniID.loginByEmail({
   		email,
       code
   	})
   	return res
   
   },
   // 微信登录
   loginByWeixin: function(event,context) {
	   // 如下旧写法依然支持
	   	// const res = await uniID.loginByWeixin(event.code)
	   	const res = await uniID.loginByWeixin({
	       code: event.code
	     })
	   	return res
   },
   // 获取微信openid
   code2SessionWeixin: function(event, context) {
	   const res = await uniID.code2SessionWeixin({
	       code: event.code
	     })
	   	return res
   },
   // 绑定微信
   bindWeixin: function(event, context) {
	    payload = await uniID.checkToken(event.uniIdToken)
	     if (payload.code) {
	     	return payload
	     }
	   	const res = await uniID.bindWeixin({
	       uid: payload.uid,
	       code: event.code
	     })
	   	return res
   },
   // 解绑微信
	unbindWeixin: function(event,context) {
		 payload = await uniID.checkToken(event.uniIdToken)
		  if (payload.code) {
		  	return payload
		  }
			const res = await uniID.unbindWeixin(payload.uid)
			return res
	},
	// 微信数据解密
	wxBizDataCrypt: function (event, context) {
		return uniID.wxBizDataCrypt(event)
	},
	// 获取App平台微信登录用户信息
	getWeixinUserInfo: function (event, context) {
		return uniID.getWeixinUserInfo(event)
	},
	// 根据uid获取用户角色
	getRoleByUid: function (event, context) {
		return getRoleByUid.getWeixinUserInfo(event)
	}
   
   
}

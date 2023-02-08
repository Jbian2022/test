// 云对象教程: https://uniapp.dcloud.net.cn/uniCloud/cloud-obj
// jsdoc语法提示教程：https://ask.dcloud.net.cn/docs/#//ask.dcloud.net.cn/article/129
const uniID = require('uni-id')
// uniID.createInstance({ // 如果在此处传入配置信息则不会再使用config.json作为配置
// 	"passwordSecret": "passwordSecret-demo", // 用于加密用户密码
// 	"tokenSecret": "tokenSecret-demo", // 用于生成token
// 	"tokenExpiresIn": 7200, // token过期时间
// 	"passwordErrorLimit": 6, // 同一个ip密码错误最大重试次数
// 	"passwordErrorRetryTime": 3600, // 超过密码重试次数之后的等待时间
// 	"service": {
// 		"sms": {
// 			"name": "登录验证码", // 应用名称对应uniCloud.sendSms的data参数内的name
// 			"codeExpiresIn": 180, // 验证码过期时间，单位：秒，只可取60的整数倍，不填此参数时会取默认值180秒
// 			"smsKey": "301ed8d4b3a67f38ccb433ed4f6f2636", // 短信密钥key
// 			"smsSecret": "01e02edd1f64ecf35105f1c9597faeaa", // 短信密钥secret
// 			"templateId": "16309"
// 		}
// 	}
// })
 console.log(JSON.stringify(uniID) ,'配置文件')
const db = uniCloud.database()
module.exports = {
	_before: function () { // 通用预处理器
		const clientInfo = this.getClientInfo()
		this.uniID = uniID.createInstance({ // 创建uni-id实例，其上方法同uniID
			clientInfo
		})
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
   register: async function(event,context) {
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
   checkToken:  function(validToken) {
	   return new Promise(async (resolve, reject) => {
	   const payload = await uniID.checkToken(validToken)
	     const {
	       code
	     } = payload
		 console.log(payload,'payload')
	     if(code) {
			  resolve(payload)
			   // code不为0代表token校验未通过
	      
	     } else {
			 resolve(payload)
		 }
		
		 
	    
		  
	   })
	   
   },
   // 登出
   logout: async function() {
	  const token = this.getUniIdToken()
	  const res = await uniID.logout(token)
		return res
	  
   },
   // 设置用户头像
   setAvatar: async function(event, context) {
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
   updateUser: async function(event, context) {
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
   getUserInfo: async function(event, context) {
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
   getUserInfoByToken: async function (event, context) {
	   const res = await uniID.getUserInfoByToken(event.uniIdToken)
	   	return res
   },
   // 短信验证码登录
   sendSmsCode:  async function (mobile, type = 'login') {
	 try{
		 // 生成验证码可以按自己的需求来，这里以生成6位数字为例
		 const randomStr = '00000' + Math.floor(Math.random() * 1000000)
		 const code = randomStr.substring(randomStr.length - 4)
		 
		 
		 
		 const res = await uniID.sendSmsCode({
			 templateId: '16334',
			mobile,
			   code,
			   type,
		      data: {
			   name: '健变科技',
			   code: code,
			   expMinute: '5',
			 }
		 })
		 console.log(res, '我是登录的第一步')
		 return res 
		
	}catch(err){
		// 调用失败
				console.log(err.errCode)
				console.log(err.errMsg)
				return {
					code: err.errCode,
					msg: err.errMsg
				}

		
	}
		
   },
   // 自行设置验证码
   setVerifyCode: async function (event, context) {
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
   verifyCode: async function (event, context) {
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
   loginBySms: async function (event, context) {
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
   loginByUniverify: async function (event, context) {
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
   bindMobile: async function (data) {
		const token = this.getUniIdToken()
		const { uid } = await this.uniID.checkToken(token)
	   	const res = await uniID.bindMobile({
	       uid: uid,
	   		mobile: data.mobile,
	   	})
	   	return res
   },
   // 解绑手机
   unbindMobile: async  function (event,context) {
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
   
   loginByEmail: async  function (event,context) {
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
   loginByWeixin: async function(code) {
	   // 如下旧写法依然支持
		console.log(code, '我是发送的code')
	   const res = await uniID.loginByWeixin({
	       code
	     })
	   	return res
   },
   // getWeixinUserInfo
   getWeixinUserInfo: async function(data) {
	   // 如下旧写法依然支持
		console.log(data , 'data')
	   const res = await uniID.getWeixinUserInfo({
	       accessToken: data.accessToken,
		   openid: data.openid
	     })
	   	return res
   },
   // 获取微信openid
   code2SessionWeixin: async function(code) {
	   const res = await uniID.code2SessionWeixin({
	       code
	     })
	   	return res
   },
   // 绑定微信
   bindWeixin: async function(event, context) {
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
	unbindWeixin: async function(event,context) {
		 payload = await uniID.checkToken(event.uniIdToken)
		  if (payload.code) {
		  	return payload
		  }
			const res = await uniID.unbindWeixin(payload.uid)
			return res
	},
	// 微信数据解密
	wxBizDataCrypt: async function (event, context) {
		return uniID.wxBizDataCrypt(event)
	},
	// 获取App平台微信登录用户信息
	getWeixinUserInfo: async function (event, context) {
		return uniID.getWeixinUserInfo(event)
	},
	// 根据uid获取用户角色
	getRoleByUid: async function (event, context) {
		return getRoleByUid.getWeixinUserInfo(event)
	},
	
	// 短信登录业务模块联表对接
	getUserSchema: function (mobile) {
		console.log(mobile)
		return new Promise((resolve, reject) => {
			
			db.collection('uni-id-users')
			  .where({
					mobile: mobile	
				})
			  .get().then(res => {
				  console.log(res,'>>>>>>')
				  resolve(res)
				 
			  }).catch((err) => {
				  reject(err)
			  })
		})
			
	
	},
	// 微信登录业务模块
	getWxSchema: function (wx_unionid) {
		return new Promise((resolve, reject) => {
			db.collection('uni-id-users')
			  .where({
					wx_unionid	
				})
			  .get().then(res => {
				  console.log(res,'>>>>>>')
				  resolve(res)
				 
			  }).catch((err) => {
				  reject(err)
			  })
		})
			
	
	},
	
	getVerifySchema: function () {
		return new Promise((resolve, reject) => {
			db.collection('opendb-verify-codes')
			  .orderBy('created_at', 'desc') // 按照quantity字段升序排序，quantity相同时按照create_date降序排序
			  .get()
			  .then((res) => {
					// console.log(res, '我是验证码')
			   resolve(res.data)
			  })
			  .catch((err) => {
				  reject(err)
			    console.error(err)
			  })
			

		})
			
	
	},
	
	// 完善个人信息
	perfectInfo: async function(data) {
		// 这里反解信息
		const token = this.getUniIdToken()
		const detailInfo = await this.uniID.checkToken(token)
		  // console.log(detailInfo.userInfo)
		return new Promise((resolve, reject) => {
			let resultParam = {
				...detailInfo.userInfo,
				...data
			}
		  delete resultParam['_id']
		   db.collection('uni-id-users').doc(detailInfo.userInfo._id).update(resultParam).then(()=>{
		   let successMessage = {
				success: true,
				message: '编辑成功'
			  }
		   resolve(successMessage)
		   
		   }).catch(err => {
				   // console.log(err, 'err')
					reject(err)
			   })
	   })
	},
	
	// 获取用户个人信息
	 getUserInfoMessage: async function() {
	  const token = this.getUniIdToken()
	  const detailInfo = await this.uniID.checkToken(token)
	  
	  return new Promise((resolve, reject) => {
	   let userInfo = {
	    success: true,
	    ...detailInfo
	   }
	   resolve(userInfo)
	  })
	 },
	 
	// 注销信息
	closeAccount: function(data){
		return new Promise( async(resolve,reject)=>{
			const {uid} = await this.uniID.checkToken(this.getUniIdToken());
			const res = await uniID.closeAccount({uid});
			resolve(res)
		})
	},
	
	
	
	
	
	
   
   
}

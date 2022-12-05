// 云对象教程: https://uniapp.dcloud.net.cn/uniCloud/cloud-obj
// jsdoc语法提示教程：https://ask.dcloud.net.cn/docs/#//ask.dcloud.net.cn/article/129
const db = uniCloud.database()
const uniID = require('uni-id')
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
   // 获取学员列表
   getMemberList: async function(mobile) {
	   const token = this.getUniIdToken()
	   	const detailInfo = await this.uniID.checkToken(token)
		console.log(detailInfo,'detailInfo')
	   return new Promise((resolve, reject) => {
		   db.collection('t_trainee').where({
			   mobile: detailInfo.userInfo.mobile,
			   userId: detailInfo.uid   
		   }).get().then(memberRes => {
			   let successMessage = {
				   success: true,
				   ...memberRes
			   }
			   resolve(successMessage)
			   
		   }).catch(err => {
			   reject(err)
		   })
		   
	   })
   },
   // 添加会员
   addMember: async function(data) {
	   const token = this.getUniIdToken()
		const { uid } = await this.uniID.checkToken(token)
	
	   return new Promise((resolve, reject) => {
		   let resultParam = {
			   ...data,
			  userId: uid
			 
		   }
		  // 先去查一下是否重复
		  db.collection('t_trainee').where({
			  traineeName: resultParam.traineeName
		  }).get().then(valiodRes => {
			  console.log(valiodRes.affectedDocs, 'valiodRes.affectedDocs')
			  if (valiodRes.affectedDocs == 0) {
				  db.collection('t_trainee').add(resultParam).then(() =>{
					  let successMessage = {
					  	success: true,
						message: '添加成功'
					  }
				  resolve(successMessage)
				  }).catch(err => {
					  console.log(err, 'err')
					   reject(err)
				  })
				  	   		   
			  }  else {
				  let errMsage = {
					  success: false,
					  message: '该学员已经被添加'
				  }
				  resolve(errMsage)
			  }
			
		  })
		  

	   })
   },
   // 删除会员
   removeMember: function() {
	   return new Promise((resolve, reject) => {
	   		   
	   	   })
   },
   // 编辑会员
   updateMember: function() {
	   return new Promise((resolve, reject) => {
	   		   db.collection('t_trainee').doc(this.item._id).update(item).then(e=>{
	   		   	// console.log(e)
	   		   
	   		   }).catch(err => {
				   
			   })
	   	   })
   },
   
   
   
   
   
}

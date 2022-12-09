// 云对象教程: https://uniapp.dcloud.net.cn/uniCloud/cloud-obj
// jsdoc语法提示教程：https://ask.dcloud.net.cn/docs/#//ask.dcloud.net.cn/article/129
const db = uniCloud.database()
const dbCmd = db.command
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
   getMemberList: async function(buyStatus) {
	   const token = this.getUniIdToken()
	   	const detailInfo = await this.uniID.checkToken(token)
		// console.log(detailInfo,'detailInfo')
	   return new Promise((resolve, reject) => {
		   db.collection('t_trainee').where({
			   userId: detailInfo.uid,
				buyStatus: String(buyStatus) ? buyStatus : ''	
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
   // 多字段查询会员列表
   getMoreList: async function(data) {
	console.log(new RegExp(/^[0-9]*[1-9][0-9]*$/).test(data) , '我是data')
	   const token = this.getUniIdToken()
		const { uid } = await this.uniID.checkToken(token)
		return new Promise((resolve, reject) => {
				   db.collection('t_trainee')
				   .where(dbCmd.or({
								mobile: new RegExp(data||'', 'i'), // 字段一
								 userId: uid
							}, {
								traineeName: new RegExp(data||'', 'i'), // 字段二
								 userId: uid
							})).get().then(memberRes => {
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
			  // console.log(valiodRes.affectedDocs, 'valiodRes.affectedDocs')
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
   removeMember: async function(data) {
	   const token = this.getUniIdToken()
	   	const detailInfo = await this.uniID.checkToken(token)
		let resultParam = {
			 userId: detailInfo.uid ,
			 _id: data._id
		}
	   return new Promise((resolve, reject) => {
		   db.collection('t_trainee').where(resultParam).remove().then(() => {
			   let successMessage = {
				  success: true,
				   message: '删除成功'
			   }
			   resolve(successMessage)
		   }).catch(err => {
			   reject(err)
		   })		   
	   })
   },
   // 编辑会员
   updateMember: async function(data) {
	   const token = this.getUniIdToken()
	   	const detailInfo = await this.uniID.checkToken(token)
	   let resultParam = {
		   ...data,
		    userId: detailInfo.uid 
	   }
	   delete resultParam['_id']
	   return new Promise((resolve, reject) => {
	   		   db.collection('t_trainee').doc(data._id).update(resultParam).then(()=>{
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
   
   // 身体评测
   
   getPhysicalAssessmentList: async function() {
   	   const token = this.getUniIdToken()
   	   	const detailInfo = await this.uniID.checkToken(token)
   		// console.log(detailInfo,'detailInfo')
   	   return new Promise((resolve, reject) => {
   		   db.collection('t_questionaire').where({
   				questionLevel: 1
   		   }).get().then(physicalList => {
   			   let successMessage = {
   				   success: true,
   				   ...physicalList
   			   }
   			   resolve(successMessage)
   			   
   		   }).catch(err => {
   			   reject(err)
   		   })
   		   
   	   })
   },
   
   
   
   
   
   
}

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
   // 查询指定学员
   getOnlyList: async function(data) {
	   const token = this.getUniIdToken()
	   	const detailInfo = await this.uniID.checkToken(token)
		// console.log(detailInfo,'detailInfo')
	   return new Promise((resolve, reject) => {
		   db.collection('t_trainee').where({
			   userId: detailInfo.uid,
			   traineeName: data.traineeName,
			   mobile: data.mobile
				
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
   // 查询教练手下的会员
   getCoachMemberList: async function() {
	   const token = this.getUniIdToken()
	   	const detailInfo = await this.uniID.checkToken(token)
		// console.log(detailInfo,'detailInfo')
	   return new Promise((resolve, reject) => {
		   db.collection('t_trainee').where({
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
			  mobile: resultParam.mobile,
			  userId: uid
			  
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
   		   db.collection('t_questionaire').orderBy('questionId', 'asc').where({
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
   
   // 查找所有的配置列表
   opearConfigAllList:async function(traineeNo) {
   	   const token = this.getUniIdToken()
   	   	const detailInfo = await this.uniID.checkToken(token)
   		// console.log(detailInfo,'detailInfo')
   	   return new Promise((resolve, reject) => {
   		   db.collection('t_questionaire_answer').where({
   				traineeNo
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
   
   
   // 配置表
   getPhysicalChildAssessmentList: async function(parentCode) {
	   const token = this.getUniIdToken()
	   const detailInfo = await this.uniID.checkToken(token)
	   return new Promise((resolve, reject) => {
		   db.collection('t_questionaire').orderBy('questionId', 'asc').where({
				parentCode: parentCode,
				
		   }).get().then(childList => {
			   let successMessage = {
				   success: true,
				   ...childList
			   }
			   resolve(successMessage)
			   
		   }).catch(err => {
			   reject(err)
		   })
	      		   
	   })
   },
   
   // 配置表操作查询
   opearConfigQuery: async function(data) {
	   const token = this.getUniIdToken()
	   const detailInfo = await this.uniID.checkToken(token)
	   console.log(detailInfo.uid, '我是谁')
	   return new Promise((resolve, reject) => {
		   db.collection('t_questionaire_answer').orderBy('questionId', 'asc').where({
			   traineeNo: data.traineeNo,
				 userId: detailInfo.uid, 
				 questionCode: data.questionCode
				
		   }).get().then(opearConfigRes => {
			   let successMessage = {
				   success: true,
				   ...opearConfigRes
			   }
			   resolve(successMessage)
			   
		   }).catch(err => {
			   reject(err)
		   })
	      		   
	   })
   },
   
   // 配置表保存
   opearConfig:  async function(data, type) { 
	   const token = this.getUniIdToken()
	   const detailInfo = await this.uniID.checkToken(token)
	   // 先查询是否存在如果没有就新增
	   return new Promise((resolve, reject) => {
		   db.collection('t_questionaire_answer').where({
		   			   traineeNo: data.traineeNo,
		   				 userId: detailInfo.uid, 
		   				 questionCode: data.questionCode
		   				
		   }).get().then((compareRes) => {
			   console.log(compareRes, '你是')
			    if (compareRes.affectedDocs === 0) {
					let resultParam = {}
					switch(type) {
						 case 'physical':
						 resultParam = {
						 	...data,
							userId: detailInfo.uid
						 	
						 }
						break;
						case 'bodyTestReport':
						resultParam = {
							...data,
							userId: detailInfo.uid
							
						}
						break
							
						 
					}  
					 db.collection('t_questionaire_answer').add(resultParam).then(() =>{
						  let successMessage = {
							success: true,
							message: '添加成功'
					 			   			  }
					 resolve(successMessage)
					 }).catch(err => {
							  console.log(err, 'err')
							   
					 })
				} else {
					console.log(data, '我是数据',type)
					let resultParam = {}
					switch(type) {
						 case 'physical':
						 resultParam = {
						 	...data,
							userId: detailInfo.uid
						 	
						 }
						break; 
						case 'bodyTestReport':
						resultParam = {
							...data,
							userId: detailInfo.uid
							
						}
						break
					}  
					delete resultParam['_id']
					db.collection('t_questionaire_answer').doc(compareRes.data[0]._id).update(resultParam).then(() =>{
						console.log('它是')
						  let successMessage = {
							success: true,
							message: '编辑成功'
						  }
					resolve(successMessage)
					}).catch(err => {
					  console.log(err, 'err')
					   
					})
					
					
				}
		   }).catch(() => {
			   
		   })
	   })
	   
	
	   
	  

   },
   
   
   // 配置表添加
   opearConfigAdd: async function(data, type) { 
	   const token = this.getUniIdToken()
	   const detailInfo = await this.uniID.checkToken(token)
	   data["userId"] = detailInfo.uid
	   return new Promise((resolve, reject) => {
		   let resultParam = {}
		switch(type) {
			 case 'physical':
			 resultParam = {
			 	...data
			 	
			 }
			break;
				
			 
		}   
		
		  db.collection('t_questionaire_answer').add(resultParam).then(() =>{
			  let successMessage = {
				success: true,
				message: '添加成功'
			  }
		  resolve(successMessage)
		  }).catch(err => {
			  console.log(err, 'err')
			   reject(err)
		  })
	      		   
	   })
   },
   
   // 配置表编辑
   
   opearConfigEdit: async function(data, type) {
   	   const token = this.getUniIdToken()
   	   const detailInfo = await this.uniID.checkToken(token)
   	   return new Promise((resolve, reject) => {
   		   let resultParam = {}
   		switch(type) {
   			 case 'physical':
   			 resultParam = {
   			 	...data
   			 	
   			 }
   			break;
   				
   			 
   		}
		   delete resultParam['_id']
   		
   		  db.collection('t_questionaire_answer').doc(data._id).update(resultParam).then(() =>{
   			  let successMessage = {
   				success: true,
   				message: '编辑成功'
   			  }
   		  resolve(successMessage)
   		  }).catch(err => {
   			  console.log(err, 'err')
   			   reject(err)
   		  })
   	      		   
   	   })
   },
   
   // 删除动作库数据
   removeAtion: async function() {

	   await db.collection("t_action_config").where({
	     _id: dbCmd.neq(null)
	   }).remove()
   }
   
   
   
   
   
   
}

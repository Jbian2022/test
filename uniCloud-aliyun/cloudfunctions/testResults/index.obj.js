// 云对象教程: https://uniapp.dcloud.net.cn/uniCloud/cloud-obj
// jsdoc语法提示教程：https://ask.dcloud.net.cn/docs/#//ask.dcloud.net.cn/article/129

const uniID = require('uni-id')
const db = uniCloud.database()
const dbCmd = db.command
module.exports = {
	_before: function () { // 通用预处理器
		const clientInfo = this.getClientInfo()
		this.uniID = uniID.createInstance({ // 创建uni-id实例，其上方法同uniID
			clientInfo
		})
	},
	//三分钟踏板测试
	async method1(param1,param2,param3,param4) {
		const gender = param1;
		const age = param2;
		const resValue = param3;
		const code = param4;
		const dbc = db.command
		return new Promise((resolve, reject) => {
					   db.collection('t_config').where({
						    gender,
						    code:code,
						    minimumAge:dbc.lt(age).or(dbc.eq(age)),
						    maximumAge:dbc.gt(age).or(dbc.eq(age))
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
	},//100    max101   min 80
	
	opearConfigQuery: async function(data) {
		   const token = this.getUniIdToken()
		   const detailInfo = await this.uniID.checkToken(token)
		   return new Promise((resolve, reject) => {
			   db.collection('t_questionaire_answer').where({
				    traineeNo: data.traineeNo,
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
	//获取体体能评估数据
	opearPHConfigQuery: async function(data) {
		   const token = this.getUniIdToken()
		   const detailInfo = await this.uniID.checkToken(token)
		   return new Promise((resolve, reject) => {
			   db.collection('t_questionaire_answer').where({
				    traineeNo: data.traineeNo,
					questionCode: data.questionCode,
					code:data.code,
					userId:detailInfo.uid
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
	// 查询指定学员
	getOnlyList: async function(data) {
		   const token = this.getUniIdToken()
		   	const detailInfo = await this.uniID.checkToken(token)
			// console.log(detailInfo,'detailInfo')
		   return new Promise((resolve, reject) => {
			   db.collection('t_trainee').where({
				   userId: detailInfo.uid,
				   _id: data.traineeId
					
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
	// 配置表保存
	opearConfig:  async function(data, type) { 
		   const token = this.getUniIdToken()
		   const detailInfo = await this.uniID.checkToken(token)
		   // 先查询是否存在如果没有就新增
		   return new Promise((resolve, reject) => {
			   db.collection('t_questionaire_answer').where({
			   			   traineeNo: data.traineeNo,
			   				 userId: detailInfo.uid, 
			   				 questionCode: data.questionCode,
							 code: data.code
			   				
			   }).get().then((compareRes) => {
				   console.log(compareRes, '你是')
				    if (compareRes.affectedDocs === 0) {
						let resultParam = {}
						switch(type) {
							 case 'physical':
							 resultParam = {
							 	...data
							 	
							 }
							break;
							case 'bodyTestReport':
							resultParam = {
								...data,
								userId: detailInfo.uid
								
							}
							break;
							case 'postureTest':
							resultParam = {
								...data,
								userId: detailInfo.uid
								
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
							break;
							case 'postureTest':
							resultParam = {
								...data,
								userId: detailInfo.uid
								
							}
							break;
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
	// 体态评估保存
	postConfig:  async function(data, type) { 
		   const token = this.getUniIdToken()
		   const detailInfo = await this.uniID.checkToken(token)
		   // 先查询是否存在如果没有就新增
		   return new Promise((resolve, reject) => {
			   db.collection('t_questionaire_answer').where({
							traineeNo: data.traineeNo,
			   				userId: detailInfo.uid, 
			   				questionCode: data.questionCode,
			   				
			   }).get().then((compareRes) => {
				   console.log(compareRes, '你是')
				    if (compareRes.affectedDocs === 0) {
						let resultParam = {}
						switch(type) {
							case 'bodyTestReport':
							resultParam = {
								...data,
								userId: detailInfo.uid
								
							}
							break;
							case 'postureTest':
							resultParam = {
								...data,
								userId: detailInfo.uid
								
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
							break;
							case 'postureTest':
							resultParam = {
								...data,
								userId: detailInfo.uid
								
							}
							break;
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
	// 配置表
	getPhysicalChildAssessmentList: async function(key) {
		   const token = this.getUniIdToken()
		   const detailInfo = await this.uniID.checkToken(token)
		   return new Promise((resolve, reject) => {
			   db.collection('t_questionaire').where({
					key: key,
					
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
	saveReport:async function(data){
		const token = this.getUniIdToken()
		const detailInfo = await this.uniID.checkToken(token)
		return new Promise((resolve, reject) => {
					   db.collection('t_questionaire_answer').where({
									traineeNo: data.traineeNo,
					   				userId: detailInfo.uid, 
					   				questionCode: data.questionCode,
					   				key:'Report'
					   }).get().then((compareRes) => {
						   console.log(compareRes, '你是')
						   if (compareRes.affectedDocs < 3) {
							   let resultParam = {}
							   	resultParam = {
							   		...data,
							   		userId: detailInfo.uid,
							   		key:'Report'
							   		
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
						   }else{
							   db.collection('t_questionaire_answer').doc(compareRes.data[2]._id).update(resultParam).then(() =>{
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
					   })
		})
	},
	opearReportQuery: async function(data) {
		   const token = this.getUniIdToken()
		   const detailInfo = await this.uniID.checkToken(token)
		   return new Promise((resolve, reject) => {
			   db.collection('t_questionaire_answer').where({
				    traineeNo: data.traineeNo,
				    userId: detailInfo.uid, 
				    key:'Report'
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
}

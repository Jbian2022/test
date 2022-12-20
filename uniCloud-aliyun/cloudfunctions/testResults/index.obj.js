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
	async method1(param1,param2,param3) {
		const gender = param1;
		const age = param2;
		const resValue = param3;
		const dbc = db.command
		const res = await db.collection("t_config").where({
			gender,
			minimumAge:dbc.lt(age).or(dbc.eq(age)),
			maximumAge:dbc.gt(age).or(dbc.eq(age)),
			minimumResult: dbc.lt(resValue),
			maximumResult: dbc.gt(resValue)
		}).get();
		return {
			data: res.data
		}
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
}

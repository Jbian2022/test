// 云对象教程: https://uniapp.dcloud.net.cn/uniCloud/cloud-obj
// jsdoc语法提示教程：https://ask.dcloud.net.cn/docs/#//ask.dcloud.net.cn/article/129
const db = uniCloud.database()
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
   // 获取学员列表
   getMemberList: function() {
	   return new Promise((resolve, reject) => {
		   // db.collection('opendb-verify-codes')
	   })
   },
   // 添加会员
   addMember: function(data) {
	   return new Promise((resolve, reject) => {
		   db.collection('t_trainee').add(data).then(e=>{
		   
		   }).catch(err => {
			   
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

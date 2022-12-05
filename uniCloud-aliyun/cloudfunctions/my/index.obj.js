// 云对象教程: https://uniapp.dcloud.net.cn/uniCloud/cloud-obj
// jsdoc语法提示教程：https://ask.dcloud.net.cn/docs/#//ask.dcloud.net.cn/article/129
const uniID = require('uni-id')
module.exports = {
	_before: function () { // 通用预处理器
		const clientInfo = this.getClientInfo()
		this.uniID = uniID.createInstance({ // 创建uni-id实例，其上方法同uniID
			clientInfo
		})
	},
	/**
	 * 查询用户信息
	 * @returns {object} 返回值描述
	 */
	async getUserInfo() {
		const {uid} = await this.uniID.checkToken(this.getUniIdToken());
		// 参数校验，如无参数则不需要
		if (!uid) {
			return {
				errCode: 'PARAM_IS_NULL',
				errMsg: '当前用户未登陆'
			}
		}
		// 业务逻辑
		const db = uniCloud.database()
		const res = await db.collection('uni-id-users').where({_id:uid}).get({getOne:true})
		// 返回结果
		return {
			data:res.data[0] //请根据实际需要返回值
		}
	},
	/**
	 * 设置用户信息
	 * @returns {object} 返回值描述
	 */
	async updateUserInfo(param) {
		const {avatar,username,gender,comment,vipLevel,vipEndDate} = param
		const {uid} = await this.uniID.checkToken(this.getUniIdToken());
		// 业务逻辑
		const db = uniCloud.database()
		const res = await db.collection('uni-id-users').where({_id:uid}).update({
			avatar:avatar||undefined,
			username:username||undefined,
			gender:gender&&gender!==0?gender:undefined,
			comment:comment||undefined,
			vipLevel:vipLevel||undefined,
			vipEndDate:vipEndDate||undefined
		})
		console.log(res)
		// 返回结果
		return {
			data:res //请根据实际需要返回值
		}
	}
}

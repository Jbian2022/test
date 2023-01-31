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
	 * 查询动作列表
	 * @param {Object} param 参数描述
	 * @returns {object} 返回值描述
	 */
	async getActionList(param) {
		const {uid} = await this.uniID.checkToken(this.getUniIdToken());
		const {type,actionClass,actionName} = param
		// 参数校验，如无参数则不需要
		if (!type&&type!==0) {
			return {
				errCode: 'PARAM_IS_NULL',
				errMsg: '动作库类型不能为空'
			}
		}
		if (!actionClass&&actionClass!==0) {
			return {
				errCode: 'PARAM_IS_NULL',
				errMsg: '动作类型不能为空'
			}
		}
		// 业务逻辑
		const db = uniCloud.database()
		const dbCmd = db.command
		const res = await db.collection('t_action_config').where(dbCmd.or(
			{
				type: +type,
				actionClass: +actionClass,
				actionName: new RegExp(actionName||'', 'i'),
				userId: uid
			},
			{
				type: +type,
				actionClass: +actionClass,
				actionName: new RegExp(actionName||'', 'i'),
				userId: null
			}
		)).get()
		// 返回结果
		return {
			data:res.data
		}
	},
	/**
	 * 新增动作
	 * @param {Object} param 参数描述
	 * @returns {object} 返回值描述
	 */ 
	async addAction(param){
		const {uid} = await this.uniID.checkToken(this.getUniIdToken());
		const {type,actionClass,actionName,actionType} = param
		// 参数校验，如无参数则不需要
		if (!type&&type!==0) {
			return {
				errCode: 'PARAM_IS_NULL',
				errMsg: '动作库类型不能为空'
			}
		}
		if (!actionClass&&actionClass!==0) {
			return {
				errCode: 'PARAM_IS_NULL',
				errMsg: '动作类型不能为空'
			}
		}
		if (!actionName) {
			return {
				errCode: 'PARAM_IS_NULL',
				errMsg: '动作名称不能为空'
			}
		}
		// 业务逻辑
		const db = uniCloud.database()
		const res = await db.collection('t_action_config').add({
			type:+type,
			actionClass:+actionClass,
			actionName,
			actionType,
			actionId: Math.random().toString(36).substring(2),
			userId: uid
		})
		// 返回结果
		return {
			data:res
		}
	},
	/**
	 * 修改动作
	 * @param {Object} param 参数描述
	 * @returns {object} 返回值描述
	 */ 
	async updateAction(param){
		const {uid} = await this.uniID.checkToken(this.getUniIdToken());
		const {type,actionClass,actionName,actionType,id} = param
		// 参数校验，如无参数则不需要
		if (!type&&type!==0) {
			return {
				errCode: 'PARAM_IS_NULL',
				errMsg: '动作库类型不能为空'
			}
		}
		if (!actionClass&&actionClass!==0) {
			return {
				errCode: 'PARAM_IS_NULL',
				errMsg: '动作类型不能为空'
			}
		}
		if (!actionName) {
			return {
				errCode: 'PARAM_IS_NULL',
				errMsg: '动作名称不能为空'
			}
		}
		// 业务逻辑
		const db = uniCloud.database()
		const res = await db.collection('t_action_config').where({_id:id}).update({
			type:+type,
			actionClass:+actionClass,
			actionName,
			actionType,
			actionId: Math.random().toString(36).substring(2),
			userId: uid
		})
		// 返回结果
		return {
			data:res
		}
	},
	async deleteAction(param){
		const {uid} = await this.uniID.checkToken(this.getUniIdToken());
		const {id} = param
		// 参数校验，如无参数则不需要
		if (!id) {
			return {
				errCode: 'PARAM_IS_NULL',
				errMsg: 'id不能为空'
			}
		}
		// 业务逻辑
		const db = uniCloud.database()
		const res = await db.collection('t_action_config').where({
			userId: uid,
			_id: id
		}).remove()
		// 返回结果
		return {
			data:res
		}
	}
}

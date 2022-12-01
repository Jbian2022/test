// 云对象教程: https://uniapp.dcloud.net.cn/uniCloud/cloud-obj
// jsdoc语法提示教程：https://ask.dcloud.net.cn/docs/#//ask.dcloud.net.cn/article/129
module.exports = {
	_before: function () { // 通用预处理器

	},
	/**
	 * 查询动作列表
	 * @param {Object} param 参数1描述
	 * @returns {object} 返回值描述
	 */
	async getActionList(param) {
		const {type,actionClass,actionName} = param
		// 参数校验，如无参数则不需要
		if (!type) {
			return {
				errCode: 'PARAM_IS_NULL',
				errMsg: '动作库类型不能为空'
			}
		}
		if (!actionClass) {
			return {
				errCode: 'PARAM_IS_NULL',
				errMsg: '动作类型不能为空'
			}
		}
		// 业务逻辑
		const db = uniCloud.database()
		const res = await db.collection('t_action_config').where({
			type: +type,
			actionClass: +actionClass,
			actionName: new RegExp(actionName||'', 'i')
		}).get()
		// 返回结果
		return {
			data:res.data
		}
	}
}

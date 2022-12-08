// 云对象教程: https://uniapp.dcloud.net.cn/uniCloud/cloud-obj
// jsdoc语法提示教程：https://ask.dcloud.net.cn/docs/#//ask.dcloud.net.cn/article/129
module.exports = {
	_before: function () { // 通用预处理器
		
	},
	/**
	 * 查询训练信息
	 * @param {object} param 参数1描述
	 * @returns {object} 返回值描述
	 */
	async getTrainList(param) {
		const {traineeNo,trainDate} = param
		// 参数校验，如无参数则不需要
		if (!traineeNo) {
			return {
				errCode: 'PARAM_IS_NULL',
				errMsg: '学员编号不能为空'
			}
		}
		// 业务逻辑
		const db = uniCloud.database()
		const res = await db.collection('t_training_log').where({
			traineeNo,
			trainDate:trainDate||undefined
		}).get()
		// 返回结果
		return {
			data: res.data
		}
	},
	/**
	 * 添加训练信息
	 * @param {object} param 参数描述
	 * @returns {object} 返回值描述
	 */
	async addTrainInfo(param) {
		// 参数校验，如无参数则不需要
		if (!param.trainDate) {
			return {
				errCode: 'PARAM_IS_NULL',
				errMsg: '训练时间不能为空'
			}
		}
		if (!param.traineeNo) {
			return {
				errCode: 'PARAM_IS_NULL',
				errMsg: '学员编号不能为空'
			}
		}
		if (!param.trainContent) {
			return {
				errCode: 'PARAM_IS_NULL',
				errMsg: '训练内容不能为空'
			}
		}
		// 业务逻辑
		const db = uniCloud.database()
		const res = await db.collection('t_training_log').add(param)
		// 返回结果
		return {
			data:res //请根据实际需要返回值
		}
	},
	/**
	 * 添加训练信息
	 * @param {object} param 参数描述
	 * @returns {object} 返回值描述
	 */
	async updateTrainInfo(param) {
		const {traineeNo,trainDate} = param
		// 参数校验，如无参数则不需要
		if (!param.trainDate) {
			return {
				errCode: 'PARAM_IS_NULL',
				errMsg: '训练时间不能为空'
			}
		}
		if (!param.traineeNo) {
			return {
				errCode: 'PARAM_IS_NULL',
				errMsg: '学员编号不能为空'
			}
		}
		if (!param.trainContent) {
			return {
				errCode: 'PARAM_IS_NULL',
				errMsg: '训练内容不能为空'
			}
		}
		// 业务逻辑
		const db = uniCloud.database()
		const res = await db.collection('t_training_log').where({
			trainDate,
			traineeNo
		}).update(param)
		// 返回结果
		return {
			data:res //请根据实际需要返回值
		}
	},
	/**
	 * 删除训练信息
	 * @param {object} param 参数描述
	 * @returns {object} 返回值描述
	 */
	async deleteTrainInfo(param) {
		const {traineeNo,trainDate} = param
		// 参数校验，如无参数则不需要
		if (!param.trainDate) {
			return {
				errCode: 'PARAM_IS_NULL',
				errMsg: '训练时间不能为空'
			}
		}
		if (!param.traineeNo) {
			return {
				errCode: 'PARAM_IS_NULL',
				errMsg: '学员编号不能为空'
			}
		}
		// 业务逻辑
		const db = uniCloud.database()
		const res = await db.collection('t_training_log').where({
			trainDate,
			traineeNo
		}).remove()
		// 返回结果
		return {
			data:res //请根据实际需要返回值
		}
	},
	/**
	 * 删除训练信息
	 * @param {object} param 参数描述
	 * @returns {object} 返回值描述
	 */
	async uploadBase64(param) {
		const {base64} = param
		const base64Str = base64.replace(/^data:image\/\w+;base64,/, '')
		// 参数校验，如无参数则不需要
		if (!param.base64) {
			return {
				errCode: 'PARAM_IS_NULL',
				errMsg: 'Base64不能为空'
			}
		}
		// 业务逻辑
		const result = await uniCloud.uploadFile({
			cloudPath: Date.now() + "-share.png",
			fileContent: new Buffer(base64Str, 'base64')
		})
		// 返回结果
		return result //请根据实际需要返回值
	}
}

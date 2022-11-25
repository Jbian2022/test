// cf2/index.js
const createConfig = require('uni-config-center')
const shareConfig = createConfig({ // 获取配置实例
    pluginId: 'share-config' // common/uni-config-center下的插件配置目录名
})
const Config = shareConfig.config() // 获取common/uni-config-center/share-config/config.json的内容
exports.main = async function(event, context) {
	console.log(Config) //打印配置
}
// module.exports = function(e) {
// 	// 公用模块用法请参考 https://uniapp.dcloud.io/uniCloud/cf-common
// 	return e
	
// }

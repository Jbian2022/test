const fs = require('fs');
const path = require('path')
module.exports = {
	// 统一 - 支付回调地址,格式为 "服务空间ID":"URL化地址"
	"notifyUrl": {
		// 本地开发环境-支付回调地址
		"mp-4e6f1c48-a4dc-4897-a866-0a1a071023c3": "https://fc-mp-4e6f1c48-a4dc-4897-a866-0a1a071023c3.next.bspapp.com/uni-pay-co",
		// 线上正式环境-支付回调地址
		// "499e2a37-0c77-418a-82aa-3e5820ecb057": "https://499e2a37-0c77-418a-82aa-3e5820ecb057.bspapp.com/uni-pay-co",
	},
	"notifyKey":"5FB2CD73C7B9873646FKHJDLSKDF18728417C50762E6D45FB2CD73C7B53918728417C50762E6D4", // 跨云函数通信时的加密密钥，建议手动改下，不要使用默认的密钥，长度保持在64位以上即可
	// 微信支付相关
	"wxpay": {
		"enable": true, // 是否启用微信支付
		// 微信 - 小程序支付
		"mp": {
			"appId": "", // 小程序的appid
			"secret": "", // 小程序的secret
			"mchId": "", // 商户id
			"key": "", // v2的api key
			"pfx": fs.readFileSync(__dirname + '/wxpay/apiclient_cert.p12'), // v2需要用到的证书
			"v3Key": "", // v3的api key
			"appCertPath": path.join(__dirname, 'wxpay/apiclient_cert.pem'), // v3需要用到的证书
			"appPrivateKeyPath": path.join(__dirname, 'wxpay/apiclient_key.pem'), // v3需要用到的证书
			"version": 2, // 启用支付的版本 2代表v2版本 3 代表v3版本
		},
		// 微信 - APP支付
		"app": {
			"appId": "wxf790c35e4d544ded", // app开放平台下的应用的appid
			"secret": "d622e34a6c359fa5c6977d9749530b62", // app开放平台下的应用的secret
			"mchId": "1637353318", // 商户id
			"key": "wxpaykey", // v2的api key
			"pfx": fs.readFileSync(__dirname + '/wxpay/apiclient_cert.p12'), // v2需要用到的证书
			"v3Key": "", // v3的api key
			"appCertPath": path.join(__dirname, 'wxpay/apiclient_cert.pem'), // v3需要用到的证书
			"appPrivateKeyPath": path.join(__dirname, 'wxpay/apiclient_key.pem'), // v3需要用到的证书
			"version": 2, // 启用支付的版本 2代表v2版本 3 代表v3版本
		},
		// 微信 - 扫码支付
		"native": {
			"appId": "wxf790c35e4d544ded", // app开放平台下的应用的appid
			"secret": "d622e34a6c359fa5c6977d9749530b62", // app开放平台下的应用的secret
			"mchId": "1637353318", // 商户id
			"key": "wxpaykey", // v2的api key
			"pfx": fs.readFileSync(__dirname + '/wxpay/apiclient_cert.p12'), // v2需要用到的证书
			"v3Key": "", // v3的api key
			"appCertPath": path.join(__dirname, 'wxpay/apiclient_cert.pem'), // v3需要用到的证书
			"appPrivateKeyPath": path.join(__dirname, 'wxpay/apiclient_key.pem'), // v3需要用到的证书
			"version": 2, // 启用支付的版本 2代表v2版本 3 代表v3版本
		},
		// 微信 - 公众号支付
		"jsapi": {
			"appId": "", // 公众号的appid
			"secret": "", // 公众号的secret
			"mchId": "", // 商户id
			"key": "", // v2的api key
			"pfx": fs.readFileSync(__dirname + '/wxpay/apiclient_cert.p12'), // v2需要用到的证书
			"v3Key": "", // v3的api key
			"appCertPath": path.join(__dirname, 'wxpay/apiclient_cert.pem'), // v3需要用到的证书
			"appPrivateKeyPath": path.join(__dirname, 'wxpay/apiclient_key.pem'), // v3需要用到的证书
			"version": 2, // 启用支付的版本 2代表v2版本 3 代表v3版本
		},
		// 微信 - 手机外部浏览器H5支付
		"mweb": {
			"appId": "", // 可以是小程序或公众号或app开放平台下的应用的任意一个appid
			"secret": "", // secret
			"mchId": "", // 商户id
			"key": "", // v2的api key
			"pfx": fs.readFileSync(__dirname + '/wxpay/apiclient_cert.p12'), // v2需要用到的证书
			"v3Key": "", // v3的api key
			"appCertPath": path.join(__dirname, 'wxpay/apiclient_cert.pem'), // v3需要用到的证书
			"appPrivateKeyPath": path.join(__dirname, 'wxpay/apiclient_key.pem'), // v3需要用到的证书
			"version": 2, // 启用支付的版本 2代表v2版本 3 代表v3版本
			// 场景信息，必填
			"sceneInfo": {
				"h5_info": {
					"type": "Wap", // 此值固定Wap
					"wap_url": "", // 你的H5首页地址，必须和你发起支付的页面的域名一致。
					"wap_name": "", // 你的H5网站名称
				}
			}
		},
	},
	// 支付宝相关（证书记得选java版本）
	"alipay": {
		"enable": true, // 是否启用支付宝支付
		// 支付宝 - 小程序支付配置
		"mp": {
			"appId": "", // 支付宝小程序appid
			"privateKey": "", // 支付宝商户私钥
			"appCertPath": path.join(__dirname, 'alipay/appCertPublicKey.crt'), // 支付宝商户公钥路径
			"alipayPublicCertPath": path.join(__dirname, 'alipay/alipayCertPublicKey_RSA2.crt'), // 支付宝公钥路径
			"alipayRootCertPath": path.join(__dirname, 'alipay/alipayRootCert.crt'), // 支付宝根证书路径
		},
		// 支付宝 - APP支付配置
		"app": {
			"appId": "2021003174613818", // 支付宝开放平台下应用的appid
			"privateKey": "MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDEK3Aa7s8t5BUvgglqsqcfUBNOVMbWAlinogJIYKB9AUPvJKe5Jwj/eSePLC4ZMSMZVAY9FCKN7INdq+9MJ2ZYHl1WE/nUB5Vz4MBdzS8T1UGsihHAI9TLV5sutkSg6HcovB+XCunK1V6wU3ZQVh4ck0GU0nSbg8V+ob7m+Oc78afaDUbyl2rMuWCBicNjTjHsMvTw9y37OVyP5KFrg9S5JrktE1eO6pIZG+PdDdOi2/odH82K8Kzv3jezwtHU8gk9aRep38+YwPm2P9bVcra9mxIl03EFoEmZVZ/ISkfSQuUbpa7SNWrrJaI82fqtyQVtmfoSgZpF+HgLminXWrM3AgMBAAECggEAS7e4fazPqxbuVngKynRKrXtq+EEgvloJfiq6VtV1HMrwPc4YLw8yGenZqxmScYbV1WDpR4oODFnOGsnSg8JxbnHJ9P+g3oZO2XtWxN393dnij4Z7c35hFFusOkuAEduoosB6MQK1WuUgt05/zGJxHPZ5ycex2pTyFf64gM5x8mCXDd8c5Ag3qlMqpGhClag0zESqFaIZY37xDyst0Kt/5aTV95M5cXYEzCBC0S1yYFA00lHCDX3ey2WDHwuFtCh8+WoDucsUaxZK4NqSzltDXqHMzWnqv/7EbEgMI7lJtPZ4c6s+vSHy18MQ4W8psgfT+aCCYid3hdLZVqj5Td1FAQKBgQDqVs+avosR3nkJFFN31oY+R60uG9e2id4OJtVWNALNgIL6V1TE5A1xOSP022C2FcZnmlyUouXJ6R1Ox1uDhIUNQfR8tQcxVEfBpbvqCFrFbQqxJ+UJV70UQTMAYuKBE1aRWhcZtnQB0xFEP5+FuGvwUxeJsIvF2jB4lYda8BpULwKBgQDWTWuMwiovSnAO+G+0+5bIhqIMhFyu7Ps9bXhAFg27wO5GPR6+qbxbTqwqGATXdhCpo+Pi7tgUpJWxA5J9wsL0MNG9aE8p8cjTHUCHL2Z1LoIDkgXNGsPpnU/gNUJl7wMvOIhnr2wT0wpnAuUsPjalXLDKD5qRvHnMMoc7KRZneQKBgA0v5W7n2hufUWBZbHkJ8XP/xJcbqf/zsjNJrCe1tZKq8LP1xiduTfNZK9TTo5WblBawcRVMNXIvVB7iyRuVkYc1dvStm0IDZCZZlUGORs1lXXyqqhDkhxdks+IJroVk+TIkx7gCtHSF1CrrCacUwb48bs6oyLTRmniusXdEm7axAoGAcd6LYiydi6lK57l8abcxRHW9T1dZhB0p1lb/iVXukDAQq8O4PWklS4L/GhLPJ8l1Sx5pbWCp8jYN0BPs1+QQAP6bw7/UKJ5vrjWh3vMBxwwiS1Fgwb4SEWTkV2cVU+JvV7z7RdTBYbtGkLvKF/sqwC0DRyqJYBy8vxKuJnJLlEkCgYEA1LrYpGc7mW5VGzzmJ96yZm81lXrT0whijE2n6HEkOEJjSB88VcQkebQiA1GVT9TkfUq3nB566DoGlhe4KVzXUglMxcjXgmmF0LRnQ6bB7pLrez6IWvl+L44ko06xs6zLs0xtJoKL1PcHBMY9R8ZAYHRl/Ub+3LH1cfDgcBue+k8=", // 支付宝商户私钥
			"appCertPath": path.join(__dirname, 'alipay/appCertPublicKey.crt'), // 支付宝商户公钥路径
			"alipayPublicCertPath": path.join(__dirname, 'alipay/alipayCertPublicKey_RSA2.crt'), // 支付宝公钥路径
			"alipayRootCertPath": path.join(__dirname, 'alipay/alipayRootCert.crt'), // 支付宝根证书路径
		},
		// 支付宝 - H5支付配置（包含：网站二维码、手机H5，需申请支付宝当面付接口权限）
		"native": {
			"appId": "2021003174613818", // 支付宝开放平台下应用的appid
			"privateKey": "MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDEK3Aa7s8t5BUvgglqsqcfUBNOVMbWAlinogJIYKB9AUPvJKe5Jwj/eSePLC4ZMSMZVAY9FCKN7INdq+9MJ2ZYHl1WE/nUB5Vz4MBdzS8T1UGsihHAI9TLV5sutkSg6HcovB+XCunK1V6wU3ZQVh4ck0GU0nSbg8V+ob7m+Oc78afaDUbyl2rMuWCBicNjTjHsMvTw9y37OVyP5KFrg9S5JrktE1eO6pIZG+PdDdOi2/odH82K8Kzv3jezwtHU8gk9aRep38+YwPm2P9bVcra9mxIl03EFoEmZVZ/ISkfSQuUbpa7SNWrrJaI82fqtyQVtmfoSgZpF+HgLminXWrM3AgMBAAECggEAS7e4fazPqxbuVngKynRKrXtq+EEgvloJfiq6VtV1HMrwPc4YLw8yGenZqxmScYbV1WDpR4oODFnOGsnSg8JxbnHJ9P+g3oZO2XtWxN393dnij4Z7c35hFFusOkuAEduoosB6MQK1WuUgt05/zGJxHPZ5ycex2pTyFf64gM5x8mCXDd8c5Ag3qlMqpGhClag0zESqFaIZY37xDyst0Kt/5aTV95M5cXYEzCBC0S1yYFA00lHCDX3ey2WDHwuFtCh8+WoDucsUaxZK4NqSzltDXqHMzWnqv/7EbEgMI7lJtPZ4c6s+vSHy18MQ4W8psgfT+aCCYid3hdLZVqj5Td1FAQKBgQDqVs+avosR3nkJFFN31oY+R60uG9e2id4OJtVWNALNgIL6V1TE5A1xOSP022C2FcZnmlyUouXJ6R1Ox1uDhIUNQfR8tQcxVEfBpbvqCFrFbQqxJ+UJV70UQTMAYuKBE1aRWhcZtnQB0xFEP5+FuGvwUxeJsIvF2jB4lYda8BpULwKBgQDWTWuMwiovSnAO+G+0+5bIhqIMhFyu7Ps9bXhAFg27wO5GPR6+qbxbTqwqGATXdhCpo+Pi7tgUpJWxA5J9wsL0MNG9aE8p8cjTHUCHL2Z1LoIDkgXNGsPpnU/gNUJl7wMvOIhnr2wT0wpnAuUsPjalXLDKD5qRvHnMMoc7KRZneQKBgA0v5W7n2hufUWBZbHkJ8XP/xJcbqf/zsjNJrCe1tZKq8LP1xiduTfNZK9TTo5WblBawcRVMNXIvVB7iyRuVkYc1dvStm0IDZCZZlUGORs1lXXyqqhDkhxdks+IJroVk+TIkx7gCtHSF1CrrCacUwb48bs6oyLTRmniusXdEm7axAoGAcd6LYiydi6lK57l8abcxRHW9T1dZhB0p1lb/iVXukDAQq8O4PWklS4L/GhLPJ8l1Sx5pbWCp8jYN0BPs1+QQAP6bw7/UKJ5vrjWh3vMBxwwiS1Fgwb4SEWTkV2cVU+JvV7z7RdTBYbtGkLvKF/sqwC0DRyqJYBy8vxKuJnJLlEkCgYEA1LrYpGc7mW5VGzzmJ96yZm81lXrT0whijE2n6HEkOEJjSB88VcQkebQiA1GVT9TkfUq3nB566DoGlhe4KVzXUglMxcjXgmmF0LRnQ6bB7pLrez6IWvl+L44ko06xs6zLs0xtJoKL1PcHBMY9R8ZAYHRl/Ub+3LH1cfDgcBue+k8=", // 支付宝商户私钥
			"appCertPath": path.join(__dirname, 'alipay/appCertPublicKey.crt'), // 支付宝商户公钥路径
			"alipayPublicCertPath": path.join(__dirname, 'alipay/alipayCertPublicKey_RSA2.crt'), // 支付宝公钥路径
			"alipayRootCertPath": path.join(__dirname, 'alipay/alipayRootCert.crt'), // 支付宝根证书路径
		}
	},
	// ios内购相关
	"appleiap" :{
		// ios内购支付
		"app": {
			"password": "", // App 专用共享密钥，App 专用共享密钥是用于接收此 App 自动续期订阅收据的唯一代码。如果您要将此 App 转让给其他开发者或不想公开主共享密钥，建议使用 App 专用共享密钥。非自动续订场景不需要此参数
			"timeout": 10000, // 请求超时时间，单位：毫秒
			"sandbox": true, // 是否是沙箱环境
		},
	}
}

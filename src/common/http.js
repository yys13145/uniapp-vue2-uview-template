import {
	config
} from './config.js'

const http = {	 
	request({
		url,
		data = {},
		method = 'GET',
		headersType,
		responseType
	}) {
		return new Promise((resolve, reject) => {
			this._request(url, resolve, reject, data, method, headersType,responseType)
		})
	},
 
	_request(url, resolve, reject, data = {}, method = 'GET', headersType = 'application/json',responseType ='text') {
		uni.request({
            url: `${config.base_url}${url}`,
            //本地请求先使用vue.config代理解决跨域
			// url: `/apie${url}`,
			method: method,
			data: data,
			header: {
				'content-type': headersType,
				// 'Authorization': uni.getStorageSync('token') || 'Bearer a72f6d0b-f883-4615-85c4-1ac2bb9921e1',
				'Authorization': uni.getStorageSync('token') || 'Bearer 3756dbe0-4939-4f9f-92df-b11236f18236',
				'appId': config.appId,
				'token': uni.getStorageSync('AuthTokens')
				
			},
			responseType:responseType,
			success: (res) => {	 
				resolve(res.data)	
			},
			fail: (err) => {
				reject()
				this._show_error(err.message)
			}
		})
	},
	_show_error(error_code, _message) {
		uni.showToast({
			title: `${_message}`,
			icon: 'none',
			duration: 2000
		})
	}
}

export {
    http
}

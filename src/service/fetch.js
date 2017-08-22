export default async(type, url, data) => {
	let requestConfig = {
		//credentials: 'include',
		method: type,
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
		},
		mode: "cors",
		//cache: "force-cache"
	}
	if(type == 'GET') {
		let dataStr = ''; //数据拼接字符串
		Object.keys(data).forEach(key => {
			dataStr += key + '=' + data[key] + '&';
		})

		if(dataStr !== '') {
			dataStr = dataStr.substr(0, dataStr.lastIndexOf('&'));
			let temp = url.indexOf('?') > 0 ? "&" : "?";
			// console.log(temp)
			url = url + temp + dataStr;
		}
	}
	if(type == 'POST') {
		Object.defineProperty(requestConfig, 'body', {
			value: JSON.stringify(data)
		})
	}
	//兼容 fetch存在兼容性，用ajax替代
	if(window.fetch) {
		try {
			let response = await window.fetch(url, requestConfig);
			// console.log(response, 'response///JSOn')
			let responseJson = await response.json();
		} catch(error) {
			alert('获取资源一不小心失败了，，大佬重试吧~嘤嘤嘤')
			throw new Error(error)
		}
		//console.log()
		return responseJson
	} else {
		//new Promise(function())
		let xhr;
		if(window.XMLHttpRequest) {
			xhr = new XMLHttpRequest();
		} else {
			xhr = new ActiveXObject;
		}
		let sendData = '';
		if(type == 'POST') {
			sendData = JSON.stringify(data);
		}
		xhr.open(type, url, true);
		xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		xhr.send(sendData);
		return new Promise(function(resolve, reject) {
			xhr.onreadystatechange = function() {
				if(xhr.readyState == 4) {
					if(xhr.status == 200) {
						let obj = xhr.response
						if(typeof obj !== 'object') {
							obj = JSON.parse(obj);
						}
						resolve(obj)
					} else {
						// 不再处理reject的状态，直接抛错误
						alert('获取资源一不小心失败了，，大佬重试吧~嘤嘤嘤')
						throw new Error(xhr)
					}
				}
			}
		})
	}
}

/**
 * Created by SMac on 17/8/13.
 */

// fn 返回值不为undefined就加入数组
const deploy = (obj, fn, end) => {
	// 只允许展开对象格式的数据
	if (specType(obj) !== 'Object') {
		console.warn(`数据格式应当是完美对象类型,不包括数组类型, ${obj} 是${specType(obj)}类型将不被允许展开`)
		return;
	}
	let Els = [];
	let isBreak = false;
	for (let key in obj) {
		let rs;
		rs = fn.call(this, obj[key], key);
		if (rs === false) {
			isBreak = true;
			break;
		}
		rs !== undefined && Els.push(rs);
	}
	end && end.call(this);
	return isBreak ? false : Els;
};
// 返回具体类型
const specType = (o) => {
	if (o === null) return "Null"
	if (o === undefined) return "Undefined"
	return Object.prototype.toString.call(o).slice(8, -1);
};
// 将真实的json数据进行抽离成字段
/*
*
* return
* 转化成功后的 { data: outData }
* 转化失败后的 { error: { message } }
*
* */
const JsonConvert = (json, option) => {
	let defaultOption = {
		label: 'name',
		children: 'children',
		dataType: 'dataType'
	}
	Object.assign(defaultOption, option || {});
	let inDataParse = (json, fn) => {
		if (typeof json === 'string') {
			try {
				json = JSON.parse(json);
			} catch (e) {
				return fn({
					message: 'json数据结构有误'
				});
			}
		}
		// 如果输入的类型是Array，则转化为携带data字段的数据
		if (specType(json) === 'Array') {
			let o = {};
			o['data'] = json;
			json = o;
		}
		return fn(undefined, json);
	}
	/*
	 * 转化格式设置  为数组添加字段对象
	 *
	 * like it  Initialization [] => Initialization [{name: xx, ?children: [] }]
	 *
	 * */
	let dataFormatSetting = (Initialization, value, child, type) => {
		if (typeof child === 'string') {
			type = child;
			child = undefined;
		}
		let normal = {
			[defaultOption['label']]: value,
			[defaultOption['dataType']]: type
		}
		if (!!child) {
			Object.assign(normal, {
				[defaultOption['children']]: child
			})
		}
		Initialization.push(normal)
	}
	// 转化器
	let Convert = (json, Fields) => {
		deploy(json, (value, field) => {
			if (typeof value === 'object') {
				let child = [];
				// 将child 组到 Fields下面去
				dataFormatSetting(Fields, field, child, specType(value));
				Convert(specType(value) === 'Array' ? value[0] : value, child)
			} else {
				dataFormatSetting(Fields, field, specType(value));
			}
		})
		return Fields;
	}
	let outData = inDataParse(json, (err, json) => {
		if (err) {
			return {error: err}
		} else {
			return {
				data: Convert(json, [])
			}
		}
	})
	return outData;
}
const getParent = (child, filters) => {
	let parent = child;
	let isFilter = (target) => {
		return deploy(filters, (data, attr) => {
			return target.getAttribute(attr) === data;
		})
	};
	while (!isFilter(parent) || (
	filters === undefined && parent.nodeName !== 'BODY')) {
		parent = parent.parentNode;
		// code...
	}
	return parent;
}

export {deploy, specType, getParent, JsonConvert}

/**
 * Created by SMac on 17/8/9.
 */

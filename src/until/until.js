// fn 返回值不为undefined就加入数组
const deploy = (obj, fn, end) => {
	let Els = [];
	let isBreak = false;
	for (let key in obj) {
		let rs;
		rs = fn.call(this, obj[key], key);
		if(rs === false) {
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
const JsonConvert = (json, option) => {
	let defaultOption = {
		label: 'name',
		children: 'children',
		dataType: 'dataType'
	}
	Object.assign(defaultOption, option||{});
	let Fields = [];
	let instantParse = (instant, value, child, type) => {
		if(typeof child === 'string') {
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
		instant.push(normal)
	}
	let Convert = (json, Fields) => {
		deploy(json, (value, field) => {
			if (typeof value === 'object') {
				let child = [];
				instantParse(Fields, field, child, specType(value));
				Convert(specType(value) === 'Array' ? value[0] : value, child)
			} else {
				instantParse(Fields, field, specType(value));
			}
		})
	}
	Convert(json, Fields);
	return Fields;
}
const getParent = (child, filters) => {
	let parent = child;
	let isFilter = (target) => {
		return deploy(filters, (data, attr) => {
			return target.getAttribute(attr) === data;
		})
	};
	while(!isFilter(parent)||(
	filters === undefined && parent.nodeName !== 'BODY')) {
		parent = parent.parentNode;
		// code...
	}
	return parent;
}

export { deploy, specType, getParent, JsonConvert }

/**
 * Created by SMac on 17/8/9.
 */

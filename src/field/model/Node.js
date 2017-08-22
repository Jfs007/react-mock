import Status from './status.js';
let seed = 0;
let option = {
	child: 'children',
	label: 'name'
};
let status = new Status();
// ex
/*
 *
 * data
 * children
 *
 * */
const getPropertyFromData = function (node, prop) {
	const data = node.data || {};
	const config = option[prop];
	if (typeof config === 'function') {
		return config(data, node);
	} else if (typeof config === 'string') {
		return data[config];
	} else if (typeof config === 'undefined') {
		return '';
	}
};
export default class Node {
	constructor(options, lazyMan) {
		this.status = status;
		this.id = ++seed;
		this.data = null;
		this.parent = null;
		this.level = 0;
		this.name = '';
		this.childNodes = [];
		for (let key in options) {
			this[key] = options[key];
		}
		if (this.parent) {
			this.level = this.parent.level + 1;
		}
		this.setData(this.data)
	}

	get root() {
		let root = this;
		let notRoot = true;
		while (notRoot) {
			!root.parent ? ( notRoot = false ) : ( root = root.parent)
		}
		return root;
	}
	setData(data) {
		let child;
		this.childNodes = [];
		if (!this.parent && data instanceof Array) {
			child = this.data;
		} else {
			child = getPropertyFromData(this, 'child') || []
		}
		for (let i = 0; i < child.length; i++) {
			this.insertChild({data: child[i]}, i)
		}
	}

	hasChild(node) {
		return node.childNodes.length;
	}

	insertChild(child, index) {
		let node = new Node(
			Object.assign(child, {
				parent: this,
				store: this.store
			})
		)
		if (index === undefined) {
			this.childNodes.push(node);
		} else {
			this.childNodes.splice(index, 0, node)
		}
	}
	update(callback) {
		this.store.setRoot(
			this.root,
			!callback ? new Function() : callback
		)
	}
	newChild() {
		this.insertChild({
			data: {
				name: '新建节点'
			}
		}, this.childNodes.length)
		this.update();
	}

	removeChild(index) {
		let parent = this.parent || this;
		parent.childNodes.splice(index, 1);
		this.update();
	}
	// 当前待交换和拖拽者比较，判断是否为当前
	isCurrent(drager) {
		return drager.id === this.id
	}
	// 判断当前需要交换的节点是否为拖动者的父级
	isParent(drager) {
		let completeId = this.id;
		let model = drager;
		let isParent = false;
		console.log(completeId, model.id, model)
		while (model) {
			if (model.id === completeId) {
				console.log('禁止交换');
				isParent = true;
				model = undefined;
			}
			if(!!model) {
				model = model.parent;
				console.log(model&&model.id, completeId)
			}
		}
		return isParent
	}
	// 判断两者是否存在同胞关系
	isSibbing(drager, changer) {
		let dragerParent = drager.parent;
		let changerParent = changer.parent;
		// 如果有一个只有父节点
		if (!!dragerParent ^ !!changerParent) {
			return false
		} else {
			return dragerParent.id === changerParent.id
		}
	}

	canExChange(drager) {
		let isSibbing = this.isSibbing(drager, this);
		if (isSibbing) return true;
		let isParent = this.isParent(drager);
		if(isParent) return false;
		return true
	}
	changeName(name) {
		this.data.name = name;
		this.update()
	}
	// 转移节点，不同于交换
	transferNode(dragerModel,callback) {
		let fieldModel = dragerModel['fieldModel'];
		let dragerId = dragerModel['index'];
		let drager_parent = fieldModel.parent || fieldModel;
		drager_parent.childNodes.splice(dragerId, 1);
		this.insertChild(fieldModel, 0);
		this.update(() => {
			callback(dragerModel)
		});
	}
	// 前提是可以交换，才可以使用该函数，可以先执行this.canExChange(a, b)做判断
	exChangeNode(dragerModel, changerId, callback) {
		// changerId交换的后者
		let fieldModel = dragerModel['fieldModel'];
		let dragerId = dragerModel['index'];
		let isSibbing = this.isSibbing(fieldModel, this);
		// 存在同胞关系时
		if (isSibbing) {
			let parent = this.parent || this;
			let _childNode = parent.childNodes;
			let temp = _childNode[dragerId];
			_childNode[dragerId] = _childNode[changerId];
			_childNode[changerId] = temp;
			// [parent[findex], parent[tindex]] = [parent[tindex], parent[findex]];
		} else {
			let drager_parent = fieldModel.parent || fieldModel;
			let changer_parent = this.parent || this;
			this.removeChild(changerId);
			fieldModel.removeChild(dragerId);
			changer_parent.insertChild(fieldModel, changerId);
			drager_parent.insertChild(this, dragerId);
		}
		this.update(() => {
			callback({isSibbing, dragerId, changerId});
		});
	}
}

/**
 * Created by SMac on 17/8/16.
 */

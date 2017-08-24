
const types = [
	'String',
	'Number',
	'Array',
	'Object'
]
export default class Typer {
	constructor() {
		this.Num = 0;
		this.canInsert = false;
		this.types = types;
		this.dataType = 'Any';
	}
	setType(type) {
		this.dataType = type;
	}
	isObject(dataType) {
		let Object = ['Array', 'Number'];
		return !!Object.filter((e) => {
			return dataType === e;
		}).length;
	}
	setNum(num) {
		this.Num = num;
	}
}
/**
 * Created by SMac on 17/8/23.
 */

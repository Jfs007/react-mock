
export default class Status {
	constructor() {
		this.status = {
			fromData: '',
			toData: ''
		}

	}
	get fromData() {
		return this.status.fromData
	}
	get toData() {
		return this.status.toData
	}
	setStatus(options) {
		let status = this.status;
		for(let key in options) {
			status[key] = options[key]
		}
	}
}

/**
 * Created by SMac on 17/8/20.
 */

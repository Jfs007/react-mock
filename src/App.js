import React, {Component} from 'react';
import { JsonConvert } from './until/until';
import Field from './field/src/Field';
import Ticket from './ticket.json';

class App extends Component {
	constructor(props) {
		super(props);
		// 普通的json数据
		this.trans = [];

		// 把普通的json数据转化为可显示的数据
		this.trans = JsonConvert(Ticket);
		console.log(this.trans)
	}
	render() {
		let trans = this.trans;
		return (
			<div className="xx_box" style={{
				width: '1040px',
				minHeight: '700px',
				margin: '20px auto'
			}}>
				<Field fieldsData={trans} >
				</Field>
			</div>
		)
	}
}
;
export default App

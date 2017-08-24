import React, {Component} from 'react';
import { JsonConvert } from './until/until';
import Field from './field/src/Field';
import Ticket from './ticket.json';
import { Button } from 'antd';
import './App.css';
class App extends Component {
	constructor(props) {
		super(props);
		// 普通的json数据
	}
	render() {
		return (
			<div
				className="xx_box"
				style={{
				width: '1040px',
				minHeight: '750px',
				margin: '20px auto'
				}}
			>
				<Field>
				</Field>
				<div style={{textAlign: 'center'}}>MockDatas WTF v0.0.1</div>
			</div>
		)
	}
}
;
export default App

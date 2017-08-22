import React from 'react';
import Component from '../../lib/Component';
import node from '../model/Node.js';
import Node from './Node.js';
export default class Field extends Component {
	constructor(props) {
		super(props)
		let { fieldsData } = this.props;
		this.state = {
			root: new node({
				data: fieldsData,
				store: this
			})
		}
		this.exchangeData = {
			dragerData: {},
			changerData: {}
		}
		// console.log(fieldsData,this.state.root,  'fieldsData')
	}
	componentWillUpdate(nextProps, nextState) {
		return true
	}
	get root() {
		return this.state.root;
	}
	// 设置标记 , 需要交换的元素
	setData(target, data) {
		console.log(target)
		let op = {
			'drager': 'dragerData',
			'changer': 'changerData'
		}
		target = op[target];
		this.exchangeData[target] = data;
	}

	getData(target) {
		let op = {
			'drager': 'dragerData',
			'changer': 'changerData'
		};
		target = op[target];
		return this.exchangeData[target];
	}
	// 设置更新后的节点
	setRoot(options,callback) {
		this.setState({
			root: options
		}, () => {
			callback();
		})
	}

	render() {
		let root = this.state.root;
		return (
			<div>
				{
					root.childNodes.map((child, index) => {
						return (
							<Node
								fieldModel= {child}
								root= {this}
								index={index}
							  key={index}
							/>
						)
					})
				}
				<div
					onClick={
						(e) => {
							root.newChild();
						}
					}
				>+</div>
				<button
					onClick={
						(e) => {
							console.log(this.root, '显示root')
						}
					}
				>显示</button>
			</div>
		)
	}
}


/**
 * Created by SMac on 17/8/16.
 */

import React from 'react';
import Component from '../../lib/Component';
import node from '../model/Node.js';
import Node from './Node.js';
import Mock from 'mockjs';
import { Icon } from 'antd';
import { JsonConvert } from '../../until/until';
import { Button, Row, Input } from 'antd';
import Ticket from '../../ticket.json';
import Navs from '../../Navs.json';
import Lists from '../../lists.json';
import Users from '../user.json';
import '../field.css'
export default class Field extends Component {
	constructor(props) {
		super(props);
		let fieldsData = JsonConvert(Ticket);
		// let { fieldsData } = this.props;
		//fieldsData = null;
		this.state = {
			root: new node({
				data: fieldsData || [],
				store: this
			}),
			mockDatas: {}
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
	// case 字段转化
	mocks() {
		let root = this.root;
		
	}
	setMockField(json) {
		console.log(json)
		let fieldsData = JsonConvert(json);
		this.setState({
			root: new node({
				data: fieldsData || [],
				store: this
			})
		})
	}
	toMock() {
		let template = {};
		let Models = this.root.childNodes;
		let genTemplate = (models, templ) => {
			models.map((model, i) => {
				let field = model['data'].name;
				let type = model.dataType;
				let Num = model.Num;
				console.log(field)
				if(type === 'Array') {
					field = `${field}|${Num}`;
				}
				if(type === 'Object' || type === 'Array') {
					let array = new Array();
					array.push({})
					let temp = type === 'Object' ? {}: array ;
					templ[field] = temp;
					genTemplate(model.childNodes, type === 'Object' ? temp: temp[0])
				}else {
					templ[field] = '@address';
				}
			})
		}
		genTemplate(Models, template);
		console.log(template)
		let mockDatas = Mock.mock(template);
		this.setState({
			mockDatas
		})
		console.log(mockDatas)
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
				<Row>
					<Button type="primary" onClick={
						(e) => {
							this.setMockField(Ticket);
						}
					}>getTicket</Button>
					<Button type="primary" onClick={
						(e) => {
							this.setMockField(Navs);
						}
					}
					>getNavs</Button>
					<Button type="primary" onClick={
						(e) => {
							this.setMockField(Lists);
						}
					}
					>getLists</Button>
					<Button type="primary" onClick={
						(e) => {
							this.setMockField(Users);
						}
					}
					>getUsers</Button>
					<Button type="primary" onClick={
						(e) => {
							this.setMockField({});
						}
					}
					>getNone</Button>
				</Row>
				<Row>
					<div className="mockDatas">
						<textarea
							cols="70"
							rows="4"
							ref="mockDatas"
							className="x_mockDatas_text"
							value={JSON.stringify(this.state.mockDatas)}
						>
						</textarea>
					</div>
					<span
						style={{
							cursor: 'pointer',
							marginRight: '10px'
						}}
						onClick={
							(e) => {
								console.log(this.refs.mockDatas)
								let mockDatas = this.refs.mockDatas;
								//let mockDatas = document.getElementsByClassName('mockDatas')[0]
								mockDatas.select(); // 选择对象
								document.execCommand("Copy"); // 执行浏览器复制命令
								alert("已复制好，可贴粘。");
							}
						}
					>
						<Icon type="file" style={{
							marginRight: '10px'
						}} />
					<span>Copy it</span>
					</span>

				</Row>
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
					className="x_add"
					onClick={
						(e) => {
							root.newChild();
						}
					}
				>
					<Icon
						type="plus"
						style={{
							'fontSize': '20px'
						}}
					/>
					<span
						style={{
							'fontSize': '20px'
						}}
					>
						添加字段
					</span>
				</div>
				<div>
					<Button type="primary" onClick={
						(e) => {
							this.toMock();
						}
					}>i want to mock!!!</Button>
				</div>
			</div>
		)
	}
}


/**
 * Created by SMac on 17/8/16.
 */

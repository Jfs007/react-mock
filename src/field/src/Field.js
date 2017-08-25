import React from 'react';
import Component from '../../lib/Component';
import node from '../model/Node.js';
import Node from './Node.js';
import Mock from 'mockjs';
import {Icon, message} from 'antd';
import {JsonConvert} from '../../until/until';
import {Button, Row, Input, Modal} from 'antd';
import Ticket from '../../ticket.json';
// import Navs from '../../Navs.json';
import Lists from '../../lists.json';
import Users from '../user.json';
import '../field.css'
let Navs = '{'
export default class Field extends Component {
	constructor(props) {
		super(props);
		let outData = JsonConvert(Ticket);
		if(outData.error) {
			message.error(outData.error.message);
		}else {
			this.state = {
				root: new node({
					data: outData.data || [],
					store: this
				}),
				mockDatas: {},
				visible: false,
				currentModel: ''
			}
		}
		// let { fieldsData } = this.props;
		//fieldsData = null;
		this.exchangeData = {
			dragerData: {},
			changerData: {}
		}
		this.mockType = [
			{ "name": "日期", "type": "@date" },
			{ "name": "时间", "type": "@datetime" },
			{ "name": "当前时间", "type": "@now" },
			{ "name": "色彩", "type": "@color" },
			{ "name": "英文段句", "type": "@sentence" },
			{ "name": "英文单词", "type": "@word" },
			{ "name": "英文标题", "type": "@title" },
			{ "name": "中文段落", "type": "@cparagraph" },
			{ "name": "中文短句", "type": "@csentence" },
			{ "name": "中文词汇", "type": "@cword" },
			{ "name": "中文标题", "type": "@ctitle" },
			{ "name": "中文名字", "type": "@cname" },
			{ "name": "链接url", "type": "@url" },
			{ "name": "域名", "type": "@domain" },
			{ "name": "邮箱", "type": "@email" },
			{ "name": "ip", "type": "@ip" },
			{ "name": "地区", "type": "@region" },
			{ "name": "省", "type": "@province" },
			{ "name": "城市", "type": "@city" },
			{ "name": "随机id", "type": "@id" }
			]
		// console.log(fieldsData,this.state.root,  'fieldsData')
	}

	componentWillUpdate(nextProps, nextState) {
		return true
	}

	// case 字段转化
	mocks() {
		let root = this.root;

	}

	setcurrentModel(currentModel) {
		this.setState({
			currentModel
		})
	}

	showModel() {
		this.setState({
			visible: true
		})
	}

	setMockField(json) {
		//console.log(json)
		let outData = JsonConvert(json);
		console.log(outData, 'outData')
		if(outData.error) {
			message.error(outData.error.message);
		}else {
			this.setState({
				root: new node({
					data: outData.data || [],
					store: this
				})
			})
		}
	}

	toMock() {
		let template = {};
		let Models = this.root;
		/*
		*
		* Models [ {data:xx, childNodes: [] }, {}, {}]
		*
		* */
		let genTemplate = (models, templ) => {
				if(models.childNodes.length<=0) {
					return;
				}
				models.childNodes.forEach((model, i) => {
					let field = model['data'].name;
					let type = model.dataType;
					let Num = model.Num;
					let mockDatas = model.mockDatas;
					let hasChild = model.childNodes.length;
					if (type === 'Array') {
						field = `${field}|${Num}`;
					}
					if ((type === 'Object' || type === 'Array')&&hasChild) {
						let array = [];
						array.push({})
						let temp = type === 'Object' ? {} : array;
						templ[field] = temp;
						genTemplate(model, type === 'Object' ? temp : temp[0])
					} else {
						let mockThis = mockDatas.type || '没有设置数据';
						type === 'Array' ?
							( templ[field] = [mockThis] ):
							( templ[field] = mockThis );
					}
				})
		}
		genTemplate(Models, template);
		 // console.log(template, Models)
		let mockDatas = Mock.mock(template);
		this.setState({
			mockDatas
		})
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
	setRoot(options, callback) {
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
					<Input
						value=''
						onChange={(e) => {
							this.setMockField(e.target.value);
						}}
					>
					</Input>
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
							onChange={() => {

							}}
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
								//console.log(this.refs.mockDatas)
								let mockDatas = this.refs.mockDatas;
								//let mockDatas = document.getElementsByClassName('mockDatas')[0]
								mockDatas.select(); // 选择对象
								document.execCommand("Copy"); // 执行浏览器复制命令
								message.success('已复制');
							}
						}
					>
						<Icon type="file" style={{
							marginRight: '10px'
						}}/>
					<span>Copy it</span>
					</span>

				</Row>
				{
					root.childNodes.map((child, index) => {
						return (
							<Node
								fieldModel={child}
								root={this}
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
				<Modal
					visible={this.state.visible}
					title="选择数据"
					onCancel={() => {
						this.setState({
							visible: false
						})
					}}
				>
					{
						this.mockType.map((mt, i) => {
							return (
								<Button onClick={() => {
									this.state.currentModel.setMockDatas(mt);
									this.setState({
										visible: false
									})
								}} key={i}
								>
									{mt.name}
								</Button>
							)
						})
					}

				</Modal>
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

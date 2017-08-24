import Component from '../../lib/Component.js';
import { getParent } from '../../until/until.js';
import { Row, Col, Icon, Input, Select, InputNumber } from 'antd';
import React from 'react';
import './Node.css';
const Option = Select.Option;
export default class Node extends Component {
	constructor(props) {
		super(props);
		this.state = {
			// 当前高亮
			isHighLight: false,
			// 当前是否折叠
			isFolder: true,
			isTransfer: false
		}
		this.timer = null;

		// this.root = root;
	}
	componentDidMount() {
	}
	// 是否有子树
	hasChild(fieldModel) {
		return fieldModel.childNodes&&fieldModel.childNodes.length
	}
	get root() {
		return this.props.root;
	}
	get index() {
		return this.props.index
	}
	beginTime() {
		let { fieldModel } = this.props;
		if(!fieldModel.canInsert()) {
			return;
		}
		this.timer = setTimeout(() => {
			this.setState({
				isTransfer: true
			})
		}, 1200)
	}
	clearTime() {
		clearTimeout(this.timer);
	}
	// 禁用管理
	_disable() {
		let { fieldModel, root } = this.props;
		let drager = root.getData('drager')['fieldModel'];
		// 如果是当前就禁用
		if(fieldModel.isCurrent(drager)) {
			return true;
		};
		// 如果不可以交换就禁用
		if(!fieldModel.canExChange(drager)) {
			return true;
		}
	}
	// 修改input name的值
	_change(e, fieldModel) {
		e.stopPropagation();
		fieldModel.changeName(e.target.value)
	}
	_dragStart(e) {
		e.stopPropagation();
		e.dataTransfer.dropEffect = 'copy';
		// 设置拖拽者
		let { fieldModel, root } = this.props;
		root.setData('drager', {
			index: this.index,
			fieldModel: fieldModel
		})
		// 将当前折叠
		this.setState({
			isFolder: true
		})
	}
	_dragEnter(e) {
		e.stopPropagation();
		if(this._disable()) {
			return;
		}
		//console.log('进入时要高亮')
		this.beginTime();
		this.setState({
			isHighLight: true,
			isFolder: false
		})
	}
	_dragOver(e) {
		e.preventDefault();
		//console.log('我想在over上做文章');
	}
	_dragLeave(e) {
		//console.log(e.target, 'hh')
		e.stopPropagation();
		console.log(e.currentTarget);
		this.clearTime();
		//console.log('离开了就不高亮')
		this.setState({
			isHighLight: false,
			isTransfer: false
		})
		//this.clearTime();
		//e.target.style.background = 'green';
		//let target = getParent(e.target, { 'data-box': 'drag'});
		// target.style.boxShadow = "none";
		// target.style.background = "#fff"

	}
	_dragEnd(e) {
		e.stopPropagation();
	}
	_drop(e) {
		e.stopPropagation();
		console.log(e.clientX, e.screenX, 'e')
		this.clearTime();
		if(this._disable()) {
			return;
		}
		let { fieldModel, root } = this.props;
		let _this = this;
		!this.state.isTransfer ? fieldModel.exChangeNode(
			root.getData('drager'),
			this.index,
			({isSibbing, f_index, t_index}) => {
			}
		): fieldModel.transferNode(root.getData('drager'), () => {
			_this.setState({
				isHighLight: false,
				isTransfer: false
			})
		});
		// cons-----!
		// )
	}
	render() {
		let pad = {paddingLeft: '15px'};
		let { fieldModel, root } = this.props;
		let data = fieldModel.data;
		let state = this.state;
		let generateChild = (fieldModel) => {
			let hasChild = this.hasChild(fieldModel);
			if(hasChild) {
				return (
					<div
						className={
							this.className(
								"field_child",
								{dis_none: state.isFolder}
							)
						}
						style={pad}>
						{
							fieldModel.childNodes.map((child, index) => {
								return (
									<Node
										fieldModel= { child }
										parent={this}
										root= {root}
										index={ index }
										key={index}
									/>
								)
							})
						}
					</div>
				)
			}else {
				return null;
			}
		}
		return (
			<div
				className="field_layer"
				onDragEnter={this._dragEnter.bind(this)}
				onDragLeave={this._dragLeave.bind(this)}
				onDragOver={this._dragOver.bind(this)}
				onDrop={this._drop.bind(this)}
			  onDragExit={
				  (e) => {
				  	console.log('!!!', 'yuuuu')
				  }
			  }
			>
				<Row
					gutter={20}
					align="middle"
					type="flex"
					className={
						this.className(
							"x_field_content",
							"x_drag_box",
							{x_drag_highlight: state.isHighLight},
							{x_will_insert: state.isTransfer}
						)
					}
					data-box="drag"
					onClick={
						(e) => {
							// e.stopPropagation();
							// fieldModel.data.name = '112323'
							// this.setState({});
						}
					}
					onMouseUp={
						(e) => {

						}
					}
					onDoubleClick={
						(e) => {
							e.stopPropagation();
							this.setState({
								isFolder: !state.isFolder
							})
						}
					}
					onMouseOver={
						(e) => {
							//console.log('我hover过来了', fieldModel.id)
						}
					}
					onMouseOut={
						(e) => {

							//console.log('我hover出去了😯', fieldModel.id)
						}
					}
					onDragStart={this._dragStart.bind(this)}
					onDragEnd={this._dragEnd.bind(this)}
					draggable
				>

					<Col
						className={this.className('x_drag_index')}
					  span={1}
					>
						<span>
							{this.index}
						</span>
					</Col>
					<Col
						className={this.className('field_input')}
					  span={5}
					>
						<Input
							placeholder="default field"
							value={data.name}
							onChange={
								(e) => {
									this._change(e, fieldModel)
								}
							}
						/>
					</Col>
					<Col className='select_type' span={3}>
						<Select
							style={{ width: 120 }}
							value={fieldModel.dataType}
							onChange={(value) => {
								fieldModel.setType(value);
							}}
						>
							{
								fieldModel.types.map((e, i) => {
									return (
										<Option value={e} key={i}>
											{e}
										</Option>
									)
								})
							}
						</Select>
					</Col>
					<Col className="show_down" span={2}
						style={{
							display: this.hasChild(fieldModel)? 'block': 'none'
						}}
					>
						<span>双击显示</span>
					</Col>
					<Col
						span={2}
						className="remove_field"
						onClick={
							(e) => {
								fieldModel.removeChild(this.index);
							}
						}
					>
						<Icon type="close" />
						<span>
							移除字段
						</span>
					</Col>
					<Col
						span={2}
						className='add_field'
						onClick={
							(e) => {
								e.stopPropagation();
								if(!this.hasChild(fieldModel)) {
									this.setState({
										isFolder: false
									})
								}
								fieldModel.newChild();
							}
						}
					  style={{
					  	display: fieldModel.isObject() ? 'block': 'none'
					  }}
					>
						<Icon type="plus" />
						<span>新增字段</span>
					</Col>
					<Col span={4}
					     style={{
						     display: fieldModel.dataType === 'Array' ? 'block': 'none'
					     }}
					>
						<span>生产条数</span>
						<InputNumber
							min={1}
							max={1000}
							value={fieldModel.Num}
							onChange={(num) => {
							fieldModel.setNum(num);
								}
							}
						/>
					</Col>
				</Row>
				{generateChild(fieldModel)}
			</div>
		)
	}
}

/**
 * Created by SMac on 17/8/18.
 */

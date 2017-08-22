import Component from '../../lib/Component.js';
import { getParent } from '../../until/until.js';
import React from 'react';
import './Node.css';
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
		// console.log('haha')
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
		if(fieldModel.isCurrent(drager)) {
			return true
		};
		if(!fieldModel.canExChange(drager)) {
			return true
		}
	}
	// 修改input name的值
	_change(e, fieldModel) {
		e.stopPropagation();
		fieldModel.changeName(e.target.value)
	}
	_dragStart(e) {
		e.stopPropagation();
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
		this.beginTime();
		this.setState({
			isFolder: false,
			isHighLight: true
		})
		//console.log(this.props.fieldModel.id, 'this.props.fieldModel.id')
	}
	_dragOver(e) {
		e.preventDefault();
		//this.beginTime();
		//console.log('hhhh')
	}
	_dragLeave(e) {
		e.stopPropagation();
		this.clearTime();
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
		this.clearTime();
		if(this._disable()) {
			return;
		}
		let { fieldModel, root } = this.props;
		!this.state.isTransfer ? fieldModel.exChangeNode(
			root.getData('drager'),
			this.index,
			({isSibbing, f_index, t_index}) => {
				this.setState({
					isHighLight: false,
					isTransfer: false
				})
			}
		): fieldModel.transferNode(root.getData('drager'), () => {
			this.setState({
				isHighLight: false,
				isTransfer: false
			})
		});
		// cons-----!
		// )
	}
	render() {
		let pad = {paddingLeft: '10px'};
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
			>
				<div
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
					onDragEnter={this._dragEnter.bind(this)}
					onDragLeave={this._dragLeave.bind(this)}
					onDrop={this._drop.bind(this)}
					onDragEnd={this._dragEnd.bind(this)}
					onDragOver={this._dragOver.bind(this)}
					draggable
				>
					<p className={this.className('x_item','x_drag_index')}>
						{this.index}
					</p>
					<p className={this.className('x_item')}>
						<span className='x_input'>
							<input
								type="text"
								value={data.name}
								onChange={
									(e) => {
										this._change(e, fieldModel)
									}
								}
							/>
						</span>
					</p>
					<p className="x_item">
						<span style={{marginLeft: '40px'}}>{this.hasChild(fieldModel) ? '双击显示': ''}</span>
						<span
							onClick={
								(e) => {
									fieldModel.removeChild(this.index);
								}
							}
							style={{
								marginLeft: '40px'
							}}
						>X {fieldModel.id}</span>
						<span
							onClick={
								(e) => {
									e.stopPropagation();
									fieldModel.newChild();
								  this.setState({
									  isFolder: false
								  })

								}
							}
						  style={{
						  	marginLeft: '40px'
						  }}
						>+</span>
					</p>
				</div>
				{generateChild(fieldModel)}
			</div>
		)
	}
}

/**
 * Created by SMac on 17/8/18.
 */

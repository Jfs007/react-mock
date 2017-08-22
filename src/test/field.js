import React from 'react';
import Node from '../field/model/Node.js';
import Component from '../lib/Component';
import '../field/field.css';
import { getParent } from '../until/until.js';
// import Drag from './drag.js';
export default class Field extends Component {
	constructor(props) {
		super(props);
		let { field } = this.props;
		this.state = {
			// 调换位置
			from: '111',
			to: '',
			shield: false,
			isOpen: false
		}
		// console.log(this.props.className, 'classNmae')
	}
	componentDidMount() {
		console.log('元素启动');
		let { parent } = this.props;
		this.parent = parent;
		console.log(this.root, 'this.root')
	}
	componentWillUnmount() {
		console.log('元素销毁')
	}
	findComponent(e) {
		let isShield = false;
		let $ = this;
		// console.log(this.$childComp)
	}
	setFrom(index) {
		this.setState({
			from: index
		})
	}
	setTo(index) {
		console.log('setto', index)
		this.setState({
			to: index
		})
	}
	reset() {
		this.setFrom('');
		this.setTo('');
	}
	changePlace() {
		let { from, to } = this.state;
		let field = this.state.field;
		console.log(to, 'to', field)
		if(this.hasChild(field)) {
			let child = field.child;
			if(from === to) {
				this.reset();
			}else {
				[child[from], child[4]] = [child[4], child[from]];
				this.setState({
					field: field
				})
				this.reset();
			}
		}
		return;
	}
	dragStart(e) {
		e.stopPropagation();
		let { index } = this.props;
		let parent = this.parent;
		if(!parent) {
			return;
		}
		parent.setFrom(index);
	}
	dragEnter(e, index) {
		this.findComponent()
		// this.setState({
		// 	to: index
		// })
		console.log(this.props.index, 'indexEnter')
		e.stopPropagation();
		let target = getParent(e.target, { 'data-box': 'drag'});
		target.style.boxShadow="1px 1px 3px #cccccc";
		target.style.background = "#cccccc"
	}
	dragOver(e) {
		e.stopPropagation();
		e.preventDefault();
	}
	dragLeave(e) {
		console.log(this.props.index, 'indexLeave')
		let target = getParent(e.target, { 'data-box': 'drag'});
		target.style.boxShadow = "none";
		target.style.background = "#fff"
	}
	click(e, index) {
		//console.log('...')
		// e.stopPropagation();
		// let { field } = this.state;
		// field.splice(index, 1);
		// this.setState({
		// 	field: field
		// })
	}
	dbClick(e, field) {
		e.stopPropagation();
		console.log(field.child, 'field.child')
		if(field.child&&field.child.length) {
			field.isOpen = !field.isOpen;
			this.setState({
				field: this.state.field
			})
		}else{
			console.log('xin')
			field = Object.assign(field, {child: [{
				name: '',
				isOpen: false
			}]})
			this.setState({
				field: this.state.field
			})
		}
	}
	drapEnd(e) {
		console.log('drapEnd结束');
		e.stopPropagation();
		// let index = this.props.index;
		// let parent = this.parent;
		// parent.setTo(index);
		// parent.changePlace();
	}
	drop(e) {
		e.preventDefault();
		let index = this.props.index;
		let parent = this.parent;
		parent.setTo(index);
		parent.changePlace();
	}
	judegType(fields) {
		console.log(fields, '传递')
	}
	find() {

	}
	hasChild(field) {
		return field.child&&field.child.length;
	}
	render() {
		let state = this.state;
		let field = this.props.field;
		let pad = {paddingLeft: '10px'};
		// let generateChild = (field, index) => {
		// //	console.log(field.child, 'field.chid')
		// 	if(this.hasChild(field)) {
		// 	return(
		// 			<div className="field_child"  key={index} style={{
		// 				display: field.isOpen? 'block': 'none'
		// 			}}>
		// 				<Field fields={field.child} $parent={this}/>
		// 			</div>
		// 		)
		// }
		// };
		let generateChild = (field) => {
			let hasChild = this.hasChild(field);
			if(hasChild) {
				return (
					<div className={this.className("field_child", 'fl')} style={pad}>
						{
							field.child.map((field, index) => {
								return (
									<Field
										field = { field }
										parent={this}
										index={ index }
										key={index}/>
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

			<div className="field_layer">
				<div
					className="drag_box"
					draggable
				  data-box="drag"
					onClick={(e) => {
						e.stopPropagation();
						let { parent, field } = this.props;
						field.name = 'sdsdfasfd';
						console.log('force update')

						this.setState({})
						//console.log($parent, fields, 'hhh')
					}}
					onDragOver={(e) => {
						this.dragOver(e)
					}}
					onDrop={(e) => {
						console.log('end', this.props.index)
						this.drop(e)
					}}
					onDragStart={(e) => {
						console.log(this.props.index, 'indexstart');
						this.dragStart(e)
					}}
					onDragEnter={(e) => {
						this.dragEnter(e)
					}}
					onDragLeave={(e) => {
						this.dragLeave(e)
					}}
					onDragEnd={(e) => {
						this.drapEnd(e);
					}}
					onDoubleClick={(e) => {
						this.dbClick(e, field)
					}
					}
				>
					<p>
						{field.name}
						<span>{this.hasChild(field) ? '双击显示': ''}</span>
						<span>X</span>
					</p>
				</div>
				{generateChild(field)}
			</div>
			// <div className="fields_layer" style={pad}>
			// 	{
			// 		fields.map((field, index) => {
			// 			return (
			// 				<div
			// 					className="drag_box"
			// 					style={{padding: '15px', background:'#cccccc', borderBottom: '1px solid #000000'}}
			// 					draggable
			// 					data-box="drag"
			// 					key={index}
			// 					onClick={(e) => {
			// 						e.stopPropagation();
			// 						let { $parent, fields } = this.props;
			// 						//console.log($parent, fields, 'hhh')
			// 					}}
			// 					onDragStart={(e) => {
			// 						this.dragStart(e, index)
			// 					}}
			// 			    onDragEnter={(e) => {
			// 			      this.dragEnter(e, index)
			// 			    }}
			// 			    onDragLeave={(e) => {
			// 			      this.dragLeave(e)
			// 			    }}
			// 			    onDragEnd={(e) => {
			// 			      this.drapEnd(e);
			// 			    }}
			// 				  onDoubleClick={(e) => {
			// 					  this.dbClick(e, field, index)
			// 				  }
			// 				  }
			// 					>
			// 					<p
			// 						className="field"
			// 					>{field.name}
			// 					<span>{this.hasChild(field) ? '双击显示' : ''}</span>
			// 					<span style={{marginLeft: "400px"}}
			// 						onClick={(e) => {
			// 							this.click(e, index)
			// 						}}
			// 					>x点击删除</span>
			// 					</p>
			// 					{
			// 						generateChild(field, index)
			// 					}
			// 				</div>
			// 			)
			// 			})
			// 	}
			// </div>
		)
	}
}

/**
 * Created by SMac on 17/8/12.
 */

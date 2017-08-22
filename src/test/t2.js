
import React from 'react';
import { Component } from 'react'
export default class Group extends Component {
	constructor(props) {
		super(props);
		let {e} = this.props
		this.state = {
			name: e.name
		}
	}
	render() {
		let { root, e } = this.props;
		return (
			<div className="kkjf">
				{e.b}
				<button onClick={
					(e) => {
						root.set([{name: 'a', b: 1}, {name: 'b', b: 1}, {name: 'c', b: 1}])
					}}
				>xxx</button>
			</div>
		)
	}
}
/**
 * Created by SMac on 17/8/20.
 */

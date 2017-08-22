import React from 'react';
import { Component } from 'react'
export default class Group extends Component {
	render() {
		return (
			<div className="kkjf">
				{
					React.Children.map(this.props.children, ele => {
						return ;
					})
				}
			</div>
		)
	}
}
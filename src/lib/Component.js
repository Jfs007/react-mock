
import React from 'react';
import classnames from 'classnames';
export default class Component extends React.Component {
	classNames(...args) {
		return classnames(args);
	}
	className(...args) {
		// console.log(this.props.className, 'show', args)
		return this.classNames.apply(this, args.concat([this.props.className]))
	}
}

/**
 * Created by SMac on 17/8/16.
 */

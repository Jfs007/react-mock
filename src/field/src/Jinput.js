import Component from '../../lib/Component';
export default class Jinput extends Component {
	constructor(props) {
		super(props);
		let {value } = this.props;
		this.state = {
			value
		}
	}
	onChange(e) {
		this.setState({
			value: e.target.value
		})
	}
	render() {
		return (
			<input
				type="text"
			  onChange={
			  	this.onChange.bind(this)
			  }
			  value={this.state.value}
			/>
		)
	}
}

/**
 * Created by SMac on 17/8/20.
 */

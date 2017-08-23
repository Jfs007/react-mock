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
			<div className="x_select">
				<div className="x_input">
					<input type="text"/>
				</div>
				<div className="x_select_down">
					
				</div>
			</div>
		)
	}
}

/**
 * Created by SMac on 17/8/23.
 */

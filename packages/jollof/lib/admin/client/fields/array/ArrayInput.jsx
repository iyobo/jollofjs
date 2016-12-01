import React, {PropTypes, Component} from 'react';
const uuid = require('uuid');
const _ = require('lodash');
import TextField from 'material-ui/TextField';

/**
 * Renders multiple instances of given field
 */
export class ArrayInput extends Component {
	componentWillMount() {
		console.log('Array component on mount...', this.props);
		const key = uuid();

		this.state = {
			key: key,
		}
	}

	componentDidMount() {

	}


	render() {
		return (
			<div >

			</div>
		);
	}
}

ArrayInput.propTypes = {
	input: PropTypes.object,
	field: PropTypes.object,
	label: PropTypes.string,
	onChange: PropTypes.func,
	source: PropTypes.string.isRequired
};

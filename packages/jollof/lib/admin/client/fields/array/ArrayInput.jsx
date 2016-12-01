import React, {PropTypes, Component} from 'react';
const uuid = require('uuid');
const _ = require('lodash');
import IconButton from 'material-ui/IconButton';
import ContentAdd from 'material-ui/svg-icons/content/add';

/**
 * handles array of given field
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

	onAddItem( evt ) {
		const items = this.props.input.value === '' ? [] : this.props.input.value;
		items.push('');
		this.props.input.onChange(items);//???aa
	}

	onRemoveItem( evt , index) {
		const items = this.props.input.value === '' ? [] : this.props.input.value;
		items.splice(index,1);
		this.props.input.onChange(items);
	}


	render() {
		const Item = this.props.itemComponent;

		// let items = [
		// 	<Item key={uuid()} source={1} {...this.props.options}/>,
		// 	<Item key={uuid()} source={2} {...this.props.options}/>,
		// 	<Item key={uuid()} source={3} {...this.props.options}/>
		// ]

		let items = this.props.input.value.map ? this.props.input.value.map(( v )=> {
			return <Item key={v} source={v} {...this.props.options}   />
		}) : [];

		return (
			<div >
				{items}
				<div className="">
					<IconButton onClick={this.onAddItem.bind(this)}>
						<ContentAdd />
					</IconButton>
				</div>
			</div>
		);
	}
}

ArrayInput.propTypes = {
	input: PropTypes.object,
	itemComponent: PropTypes.any,
	label: PropTypes.string,
	onChange: PropTypes.func,
	source: PropTypes.string.isRequired,
	options: PropTypes.any,
	meta: PropTypes.object,
	name: PropTypes.string
};

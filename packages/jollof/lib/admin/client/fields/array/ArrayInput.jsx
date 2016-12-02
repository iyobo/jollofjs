import React, {PropTypes, Component} from 'react';
const uuid = require('uuid');
const _ = require('lodash');
import IconButton from 'material-ui/IconButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import ContentRemove from 'material-ui/svg-icons/content/remove';

/**
 * handles array of given field
 */
let arrayItemCountStyle = {
	'fontWeight': 600,
	'fontSize': '20px',
	color: '#dedede',
	'fontStyle': 'italic',
	float: 'left',
	paddingTop: '12px'
}

let arrayItemActionStyle = {
	display: 'inline-flex',
	padding: '5px'
}


export class ArrayInput extends Component {
	componentWillMount() {
		console.log('Array component on mount...', this.props);
		const key = uuid();

		let items = [];

		if (Array.isArray(this.props.input.value))
			items = this.props.input.value;

		this.state = {
			key: key,
			items: items
		}
	}

	componentDidMount() {

	}

	_updateItems( items ) {
		this.setState({items: items});
		this.props.input.onChange(items);

		console.log('this.state.items', items)
	}

	onAddItem( evt ) {
		let items = [ ...this.state.items, '' ];

		this._updateItems(items);
	}

	onRemoveItem( evt, index ) {
		let items = [ ...this.state.items ];

		//remove index
		items.splice(index, 1);

		this._updateItems(items);
	}

	onChildChange( i, evt, value ) {
		console.log(i, value);
		let items = [ ...this.state.items ];

		items[ i ] = value;
		this._updateItems(items);
	}

	onChildBlur( evt, i ) {

	}

	onDragStart( evt, i ) {

	}

	onDrop( evt, i ) {

	}

	onFocus( evt, i ) {

	}


	render() {
		const Item = this.props.itemComponent;
		let meta = {touched: null, error: null};


		let items = this.state.items.map(( v, i )=> {

			let options = {id: this.state.key + '_' + i}
			let input = {
				...this.props.input,
				value: this.state.items[ i ],
				onChange: this.onChildChange.bind(this, i),
				onBlur: this.onChildBlur.bind(this, i),
				onDragStart: this.onDragStart.bind(this, i),
				onDrop: this.onDrop.bind(this, i),
				onFocus: this.onFocus.bind(this, i),
				name: this.props.input.name + '_' + i

			}

			return (
				<div key={options.id} className="row">
					<div className="col-md-1 " style={arrayItemActionStyle}>

						<IconButton onClick={this.onRemoveItem.bind(this, i)}>
							<ContentRemove color="red"/>
						</IconButton>
						<span style={arrayItemCountStyle}>
							{i + 1}
						</span>
					</div>
					<div className="col-md-11">
						<Item options={options} {...this.props} source={v} meta={meta} input={input} label=""/>
					</div>
				</div>
			)
		});

		return (
			<div>
				{items}
				<div className="actions">
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
	name: PropTypes.string,

	style: PropTypes.object,
	type: PropTypes.string,
	validation: PropTypes.object,
};

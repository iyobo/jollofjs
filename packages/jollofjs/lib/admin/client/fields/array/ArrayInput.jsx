import React, {PropTypes, Component} from 'react';
const uuid = require('uuid');
const _ = require('lodash');
import IconButton from 'material-ui/IconButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import ContentRemove from 'material-ui/svg-icons/content/remove';

/**
 * handles array of given field
 */
export class ArrayInput extends Component {
	componentWillMount() {
		console.log('Array component on mount...', this.props);
		const key = uuid();

		this.state = {
			key: key,
			items: []
		}
	}

	componentDidMount() {

	}

	_updateItems(items){
		this.setState({items:items});
		this.props.input.onChange(items);

		console.log('this.state.items', this.state.items)
	}

	onAddItem( evt ) {
		let items =  [ ...this.state.items, '' ];

		this._updateItems(items);
	}

	onRemoveItem( evt, index ) {
		let items =  [ ...this.state.items];

		//remove index
		items.splice(index,1);

		this._updateItems(items);
	}

	onChildChange( evt, i ) {
		let items =  [ ...this.state.items]


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
		let meta = {touched: <div></div>, error: null};


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

			}

			return (
				<div key={options.id}>
					<IconButton onClick={this.onRemoveItem.bind(this,i)}>
						<ContentRemove />
					</IconButton>
					<Item options={options} {...this.props} source={v} meta={meta} input={input}/>
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

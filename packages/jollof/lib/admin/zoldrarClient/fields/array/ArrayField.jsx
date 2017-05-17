import React, {PropTypes, Component} from 'react';

let arrayItemCountStyle = {
	'fontWeight': 600,
	'fontSize': '20px',
	color: '#dedede',
	'fontStyle': 'italic'
}
//R
export const ArrayField = ( {record = {}, source, formFactor} ) => {
	const val = record[ source ];
	const len = (val && val.length) ? val.length : null;

	if (formFactor === 'list')
		return <div> { len ? `[ ${len} item${len > 1 ? 's' : ''} ]` : '[]'} </div>
	else {
		if (len && len > 0) {
			let items = val.map(( t, i )=> {
				return <div key={i} className="row" style={{padding: '5px'}}>
					<div className="col-md-1" style={arrayItemCountStyle}>{i+1}</div>
					<div className="col-md-11">{JSON.stringify(t)}</div>
					</div>
			})

			return (
				<div>
					{items}
				</div>
			)
		} else {
			return <div><i>No items</i></div>
		}

	}
};

ArrayField.propTypes = {
	source: PropTypes.string.isRequired,
	record: PropTypes.object,
	formFactor: PropTypes.string
};



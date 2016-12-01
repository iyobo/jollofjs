import React, {PropTypes, Component} from 'react';

//R
export const ArrayField = ( {record = {}, source, formFactor} ) => {
	const val = record[ source ];
	const len = (val && val.length) ? val.length : null;

	return <div> { len ? `[ ${len} item${len > 1 ? 's' : ''} ]` : '[]'} </div>
};

ArrayField.propTypes = {
	source: PropTypes.string.isRequired,
	record: PropTypes.object,
	formFactor: PropTypes.string
};



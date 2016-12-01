import React, {PropTypes, Component} from 'react';

//R
export const MapField = ( {record = {}, source, formFactor} ) => {
	const loc = record[ source ];

	return <div> { loc ? loc.full : '--'} </div>
};

MapField.propTypes = {
	source: PropTypes.string.isRequired,
	record: PropTypes.object,
	formFactor: PropTypes.string
};



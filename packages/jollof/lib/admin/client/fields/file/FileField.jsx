import React, {PropTypes, Component} from 'react';

//R
export const FileField = ( {record = {}, source} ) => {

	let file = record[ source ];

	return (
		<a href={file.url}>{file.name}</a>
	)
};

FileField.propTypes = {
	source: PropTypes.string.isRequired,
	record: PropTypes.object,
};



import React, {PropTypes, Component} from 'react';

//R
export const FileField = ( {record = {}, source, formFactor} ) => {

	let file = record[ source ];

	if (file) {
		console.log('showing file',file);
		var path = file.url ? file.url : 'javascript:null;';

		if (file.url && file.type.indexOf('image') > -1) {
			return <a href={path}><img src={path} className={formFactor}/></a>
		} else {
			return <a href={path}><i className={"fa fa-file fa-lg"}/></a>
		}

	} else {
		return <div> </div>
	}
};

FileField.propTypes = {
	source: PropTypes.string.isRequired,
	record: PropTypes.object,
	formFactor: PropTypes.string
};



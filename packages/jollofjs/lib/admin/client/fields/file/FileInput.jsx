import React, {PropTypes, Component} from 'react';
var Dropzone = require('react-dropzone');
const uuid = require('node-uuid');
const _ = require('lodash');

export class FileInput extends Component {
	constructor( props ) {
		super(props)
		this.state = {}
	}

	onDrop( files ) {
		console.log('files', files)
		this.setState({files: files.concat(this.state.files || [])});
	}

	onPreviewClick(file){
		_.remove(this.state.files, file);
		// this.forceUpdate();
		this.setState({files: this.state.files});
	}

	derivePreviewStyle( path ) {
		return {
			background: `url('${path}') center / cover`
		}
	}

	render() {
		//Loop through all uploaded files...
		if (this.state.files) {
			var previews = this.state.files.map(( file ) => {
				let path = file.preview;

				if (file.type.indexOf('image') === -1)
					path = '/jollofstatic/doc.png'


				//...and render a preview
				return (
					<div key={file.name} className="filePreview" onClick={this.onPreviewClick.bind(this,file)}>
						<div  className="clickable image"
							  style={this.derivePreviewStyle(path)}></div>
						<span className="fileName">{file.name}</span>
					</div>

				)

			});
		}

		return (
			<div className="fileInput">
				<Dropzone ref="dropzone" onDrop={this.onDrop.bind(this)}>
					<div className="fill clickable">Click or drag file here to upload.</div>
				</Dropzone>

				{previews}
			</div>
		);
	}
}
//
// const onDrop = (files)=>{
// 	console.log('File Input: ', files);
// }
//
//
// export const FileInputold = ( {record = {}, source} ) => {
// 	let file = record[ source ];
//
// 	return (
// 		<div>
// 			<Dropzone onDrop={onDrop}>
// 				<div>Click or drag file here to upload.</div>
// 			</Dropzone>
// 			<div>
//
// 			</div>
// 		</div>
// 	)
// }
//

FileInput.propTypes = {
	source: PropTypes.string.isRequired,
	record: PropTypes.object,
};

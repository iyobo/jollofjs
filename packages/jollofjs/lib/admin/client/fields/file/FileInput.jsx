import React, {PropTypes, Component} from 'react';
var Dropzone = require('react-dropzone');
const uuid = require('uuid');
const _ = require('lodash');

export class FileInput extends Component {
	constructor( props ) {
		super(props)
		this.state = {}
	}

	onDrop( files ) {
		console.log('files', files, this.props.record, this.props.source)
		this.props.record[ this.props.source ] = files.concat(this.state.files || [])
		this.setState({files: this.props.record[ this.props.source ]});
	}

	/**
	 * remove file on click
	 * @param file
	 */
	onPreviewClick( file ) {
		_.remove(this.props.record[ this.props.source ], file);
		// this.forceUpdate();
		this.setState({files: this.props.record[ this.props.source ]});
	}

	derivePreviewStyle( path ) {
		return {
			background: `url('${path}') center / cover`
		}
	}

	previewFile( evt ) {
		let file = evt.target.files[ 0 ]
		var reader = new FileReader();

		reader.addEventListener("load", () =>{
			console.log('file',file);

			var preview = reader.result;
			if (file.type.indexOf('image') === -1)
				preview = '/jollofstatic/doc.png';

			this.setState({...this.state, file: file, preview: preview});
		}, false);

		if (file) {
			reader.readAsDataURL(file);
		}
	}

	render() {
		//Loop through all uploaded files...
		// if (this.state.file) {
		// 	var previews = this.state.files.map(( file ) => {
		// 		let path = file.preview;
		//
		// 		if (file.type.indexOf('image') === -1)
		// 			path = '/jollofstatic/doc.png'
		//
		//
		// 		//...and render a preview
		// 		return (
		// 			<div key={file.name} className="filePreview">
		// 				<div className="clickable image"
		// 					 onClick={this.onPreviewClick.bind(this, file)}
		// 					 style={this.derivePreviewStyle(path)}>
		// 					<div className="overlay">
		// 						<span className="x">X</span>
		// 					</div>
		// 				</div>
		// 				<span className="fileName">{file.name}</span>
		// 			</div>
		//
		// 		)
		//
		// 	});
		// }

		var preview = <div>Upload a File to see Preview...</div>;

		if (this.state.preview) {
			preview = (
				<div className="filePreview">
					<div className="clickable image"
						 style={this.derivePreviewStyle(this.state.preview)}>
						<div className="overlay">
							<span className="x">X</span>
						</div>
					</div>
					{/*<span className="fileName">{this.state.file.name}</span>*/}
				</div>
			)
		}

		return (
			<div className="row">
				<div className="fileInput col-md-3">
					<input type="file" name={this.props.key} onChange={this.previewFile.bind(this)}/>
				</div>
				<div className="col-md-8">
					{preview}
				</div>
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

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
		console.log('files', files, this.props.record, this.props.source)
		this.props.record[this.props.source] = files.concat(this.state.files || [])
		this.setState({files: this.props.record[this.props.source]});
	}

	/**
	 * remove file on click
	 * @param file
	 */
	onPreviewClick( file ) {
		_.remove(this.props.record[this.props.source], file);
		// this.forceUpdate();
		this.setState({files: this.props.record[this.props.source]});
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
					<div key={file.name} className="filePreview">
						<div className="clickable image"
							 onClick={this.onPreviewClick.bind(this, file)}
							 style={this.derivePreviewStyle(path)}>
							<div className="overlay">
								<span className="x">X</span>
							</div>
						</div>
						<span className="fileName">{file.name}</span>
					</div>

				)

			});
		}

		return (
			<div className="mdl-grid">
				<div className="fileInput mdl-cell mdl-cell--4-col">
					<Dropzone ref="dropzone" onDrop={this.onDrop.bind(this)}>
						<div className="fill clickable">Click or drag file here to upload.</div>
					</Dropzone>
				</div>
				<div className="mdl-cell--8-col">
					{previews}
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

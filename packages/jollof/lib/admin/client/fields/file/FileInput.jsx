import React, {PropTypes, Component} from 'react';
var Dropzone = require('react-dropzone');
const uuid = require('uuid');
const _ = require('lodash');
import EditorInsertDriveFile from 'material-ui/svg-icons/editor/insert-drive-file';
import FlatButton from 'material-ui/FlatButton';

export class FileInput extends Component {
	componentWillMount( ) {
		this.state = {
			key: uuid(),
		}
	}


	derivePreviewStyle( path ) {
		return {
			background: `url('${path}') center / cover`
		}
	}

	onFileAdded( evt ) {
		evt.preventDefault();
		let file = evt.target.files[ 0 ]
		var reader = new FileReader();

		reader.addEventListener("load", () => {
			// console.log('file', file);

			var preview = reader.result;

			this.setState({...this.state, file: file, preview: preview});

			// console.log('file uploaded', this.props);

			this.props.input.onChange(file);

		}, false);

		if (file) {
			reader.readAsDataURL(file);
		}
	}

	/**
	 * remove file on click
	 * @param file
	 */
	onPreviewClick() {
		this.setState({...this.state, file: null, preview: null, key: uuid()});
		this.props.input.onChange('');
	}

	render() {

		var preview = <div>Upload a File to see Preview...</div>;var previewImage = <img src={this.state.preview} className="fileImage"/>

		if (this.state.preview) {

			var previewImage = <img src={this.state.preview} className="fileImage"/>
			if (this.state.file.type.indexOf('image') === -1) //if not an image
				previewImage = <EditorInsertDriveFile className="fileImage" />;

			preview = (
				<div className="filePreview row">

					<div className="col-md-3">
						{previewImage}
					</div>
					<div className="col-md-9">
						<div className="wrapText pad-5 bold">{this.state.file.name}</div>
						<div className="wrapText pad-5">{Math.round(this.state.file.size / 1024)} KB</div>
						<div className="wrapText pad-5"><FlatButton label="Delete" secondary={true}
																	onClick={this.onPreviewClick.bind(this)}
																	className="clickable"/></div>
					</div>

				</div>
			)
		}

		return (
			<div className="fileInput">
				<input type="file" name={this.props.key}
					   key={this.state.key}
					   onChange={this.onFileAdded.bind(this)}
				/>
				{preview}
			</div>
		);
	}
}

FileInput.propTypes = {
	input: PropTypes.object,
	label: PropTypes.string,
	onChange: PropTypes.func,
	source: PropTypes.string.isRequired,
};

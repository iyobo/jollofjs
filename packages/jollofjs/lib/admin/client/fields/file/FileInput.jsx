import React, {PropTypes, Component} from 'react';
var Dropzone = require('react-dropzone');
const uuid = require('uuid');
const _ = require('lodash');
import deleteIcon from 'material-ui/svg-icons/action/delete';
import FlatButton from 'material-ui/FlatButton';

export class FileInput extends Component {
	constructor( props ) {
		super(props)
		this.state = {
			key: uuid()
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
			if (file.type.indexOf('image') === -1)
				preview = '/jollofstatic/doc.png';

			this.setState({...this.state, file: file, preview: preview});
			// this.props.record[this.props.source] = file;
			// this.props.input.value = file;

			console.log('file uploaded', this.props);

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
	}

	render() {

		var preview = <div>Upload a File to see Preview...</div>;

		if (this.state.preview) {
			preview = (
				<div className="filePreview row">
					{/*<div className="col-md-5">*/}
					{/*<div className="clickable image"*/}
					{/*onClick={this.onPreviewClick.bind(this)}*/}
					{/*style={this.derivePreviewStyle(this.state.preview)}>*/}
					{/*<div className="overlay">*/}
					{/*<span className="x">X</span>*/}
					{/*</div>*/}
					{/*</div>*/}
					{/*</div>*/}
					<div className="col-md-3">
						<img src={this.state.preview} className="fileImage"/>
					</div>
					<div className="col-md-9">
						<div className="wrapText pad-5 bold">{this.state.file.name}</div>
						<div className="wrapText pad-5">{Math.round(this.state.file.size / 1024)} KB</div>
						<div className="wrapText pad-5"><FlatButton label="Delete" secondary={true}
																	onClick={this.onPreviewClick.bind(this)} className="clickable"/></div>
					</div>

				</div>
			)
		}

		return (
			<div className="fileInput">
				<input type="file" name={this.props.key}
					   onChange={this.onFileAdded.bind(this)}/>
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

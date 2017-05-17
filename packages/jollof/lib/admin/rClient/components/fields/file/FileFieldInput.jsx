/**
 * Created by iyobo on 2017-04-14.
 */
import React, {Component, PropTypes} from 'react';
import {rs} from 'react-spoon';
import {observer} from 'mobx-react';
import {observable} from 'mobx';
const uuid = require('uuid');
const _ = require('lodash');
import FlatButton from 'material-ui/FlatButton';


@observer
export default class FileFieldInput extends Component {

    constructor() {
        super();
    }

    componentWillMount() {
        const file = this.props.data; //observable.map(this.props.data || {});
        this.state = {
            key: uuid(),
            preview: file ? file.url : null,
            file: file
        }
         //console.log('File field props',this.props)

    }

    componentWillReceiveProps(newprops) {
        const file = newprops.data;

        this.setState({
            ...this.state,
            preview: file ? file.url||this.state.preview : null,
            file: file
        })
        //console.log('componentWillReceiveProps state',this.state)
    }


    derivePreviewStyle(path) {
        return {
            background: `url('${path}') center / cover`
        }
    }

    onFileAdded(evt) {
        evt.preventDefault();
        let file = evt.target.files[0]
        var reader = new FileReader();

        reader.addEventListener("load", () => {
             //console.log('file', file);

            var preview = reader.result;

            this.setState({ ...this.state, file: file, preview: preview });

             //console.log('file loaded', this.state);
            this.props.onChange(file);

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
        this.setState({ ...this.state, file: null, preview: null, key: uuid() });
        this.props.onChange(null);
    }

    render() {

        var preview = <div>Upload a File to see Preview...</div>;
        //var previewImage = <img src={this.state.preview} className="fileImage"/>

        //console.log('state on rendering', this.state)
        if (this.state.preview) {

            var previewImage = <img src={this.state.preview} className="fileImage"/>
            if (this.state.file.type.indexOf('image') === -1) {//if not an image
                previewImage = <i className="fa fa-lg fa-file"/>
            }

            preview = (
                <div key={'filePreview_'+this.state.key} className="filePreview row">

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
            <div key={'file_' + this.state.key} className="fileInput">
                <input type="file" name={this.props.name}
                       key={'fileInput_'+this.state.key}
                       onChange={this.onFileAdded.bind(this)}
                />
                {preview}
            </div>
        );
    }
}



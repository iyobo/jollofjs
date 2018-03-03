/**
 * Created by iyobo on 2017-04-14.
 */
import React, {Component} from 'react';
import {rs} from 'react-spoon';
import {observer} from 'mobx-react';
import {observable} from 'mobx';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import {Tab, Tabs} from 'material-ui/Tabs';
import {isImage, isVideo} from '../../../util/mediaUtil';
import ReactPlayer from 'react-player'
import TextField from 'material-ui/TextField';

const uuid = require('uuid');
const _ = require('lodash');

const styles = {
    button: {
        margin: 12,
    },
    exampleImageInput: {
        cursor: 'pointer',
        position: 'absolute',
        top: 0,
        bottom: 0,
        right: 0,
        left: 0,
        width: '100%',
        opacity: 0,
    },
};

@observer
export default class FileFieldInput extends Component {

    static propType = {
        data: Object, //html5 file object or similar
        onchange: Function,
    }

    constructor() {
        super();
        this.state = {
            key: uuid(),
            external: false
        };
    }

    onFileAdded = (evt) => {
        evt.preventDefault();
        this.onClearClick()
        let file = evt.target.files[0]
        var reader = new FileReader();

        reader.addEventListener("load", () => {
            //console.log('file', file);

            var preview = reader.result;
            //console.log({preview})

            //this.setState({ ...this.state, external: true });

            file.url = preview;
            file.preview = preview;

            //console.log('file loaded', this.state);
            this.props.onChange(file);

        }, false);

        if (file) {
            reader.readAsDataURL(file);
        }
    }

    onURLChange = (evt) => {
        const url = evt.target.value;

        let mediaType = 'unknown';
        if (isImage(url)) {
            mediaType = 'image'
        }
        else if (isVideo(url)) {
            mediaType = 'video'
        }
        const file = { url };
        file.engine = 'http';
        try {
            file.name = 'webfile'
            file.size = 0;
            file.type = mediaType;
        } catch (e) {
        }
        file.url = url;
        file.path = url;
        file.preview = url;


        this.props.onChange(file);
    }

    /**
     * remove file on click
     * @param file
     */
    onClearClick = () => {
        const file = {};
        file.engine = null;
        file.name = null;
        file.size = null;
        file.path = null;
        file.url = null;
        file.type = null;

        this.props.onChange(file);
    }

    buildMediaPreview(url, mimeType) {
        //console.log({ url, mimeType })
        if (!url) return <span></span>;

        let mediaElement = <i className="fa fa-2x fa-lg fa-file" style={{ float: 'left', margin: '10px' }}/>
        // Create the image or video representation

        if (isVideo(url, mimeType)) {
            mediaElement = (
                <ReactPlayer
                    width="400px"
                    height="300px"
                    url={url}
                    controls
                />
            )
        }
        else if (isImage(url, mimeType)) {
            mediaElement = <img src={url}
                                className="fileImage"
                                style={{ float: 'left', margin: '10px', maxWidth: '300px' }}/>;
        }

        return mediaElement;
    }

    buildPreviewBox(key, file, hideStats) {
        //console.log(file)
        let preview = <div>Upload a File to see Preview...</div>;
        if (!file) return preview;

        // Create the image or video representation
        let mediaPreview = this.buildMediaPreview(file.url || file.preview, file.type)

        // Draw with this
        preview = (
            <div
                //key={'filePreview_' + key}
                className="filePreview row">

                <div className="col-md-12">
                    {mediaPreview}
                    {!hideStats && <div>
                        <div className="wrapText pad-5 bold">{file.name}</div>
                        <div className="wrapText pad-5">{Math.round(file.size / 1024)} KB</div>
                        <div className="wrapText pad-5">
                            <FlatButton
                                onClick={this.onClearClick}
                                className="clickable">Clear</FlatButton>
                        </div>
                    </div>}

                </div>

            </div>
        )

        return preview;
    }

    render() {

        var preview = <div>Upload a File to see Preview...</div>;

        //console.log('state on rendering', this.state)
        let previewBox = this.buildPreviewBox(this.state.key, this.props.data, this.state.external)

        return (
            <div
                //key={'file_' + this.state.key}
                className="fileInput">

                <Tabs
                    value={this.state.external}
                    onChange={(val) => {
                        this.setState({ ...this.state, external: val });
                    }}
                >
                    <Tab label="Upload as File" value={false}>
                        <div>

                        </div>
                    </Tab>
                    <Tab label="Paste as URL" value={true}>
                        <div>

                        </div>
                    </Tab>
                </Tabs>

                <br/>
                <div className="row">
                    <div className="col-xs-12">
                        {!this.state.external && <div>
                            <RaisedButton
                                label="Browse Files..."
                                labelPosition="before"
                                style={styles.button}
                                containerElement="label"
                            >
                                <input type="file"
                                       name={this.props.name}
                                    //key={'fileInput_' + this.state.key}
                                       onChange={this.onFileAdded}
                                       style={styles.exampleImageInput}/>

                            </RaisedButton>

                            {previewBox}</div>}
                        {this.state.external && (<div>
                            <TextField
                                hintText="Paste file url here"
                                floatingLabelText="File URL"
                                placeholder="Paste the URL"
                                name={this.props.name}
                                onChange={this.onURLChange}
                                value={this.props.data ? this.props.data.url || this.props.data.preview : null}
                                fullWidth={true}
                            />
                            {previewBox}</div>)}
                    </div>
                </div>

            </div>
        );
    }
}

import React, {Component, PropTypes} from 'react';
import {observer} from 'mobx-react';
import 'react-quill/dist/quill.snow.css';
import ReactQuill from 'react-quill';
const _ = require('lodash');
import TinyMCE from 'react-tinymce';

@observer
export default class RichTextInput extends Component {

    constructor(props) {
        super(props);
    }

    handleEditorChange = (e) => {

        //console.log('Content was updated:', e.target.getContent());
        this.props.onChange(e.target.getContent());
    }

    render() {
        return (
            <TinyMCE
                content={this.props.data || ''}
                config={{
                    plugins: 'link image code',
                    toolbar: 'undo redo | bold italic | alignleft aligncenter alignright | code'
                }}
                onChange={this.handleEditorChange}
            />
        );
    }

}



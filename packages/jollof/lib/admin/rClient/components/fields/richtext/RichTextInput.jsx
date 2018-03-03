import React, {Component} from 'react';
import {observer} from 'mobx-react';
import 'react-quill/dist/quill.snow.css';
import TinyMCE from 'react-tinymce';

const _ = require('lodash');

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
                    plugins: 'link image code media autolink emoticons hr lists table',
                    toolbar: 'undo redo | bold italic | alignleft aligncenter alignright numlist bullist | code insert media | emoticons table'
                }}
                onChange={this.handleEditorChange}
            />
        );
    }

}



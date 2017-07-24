import React, {Component, PropTypes} from 'react';
import {observer} from 'mobx-react';
import 'react-quill/dist/quill.snow.css';
import ReactQuill from 'react-quill';
const _ = require('lodash');

@observer
export default class RichTextInput extends Component {

    constructor(props) {
        super(props);

        this.modules = {
            toolbar: [
                //[{ 'header': [1, 2, false] }],
                //['bold', 'italic', 'underline', 'strike', 'blockquote','code-block'],
                //[{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
                //['link', 'image'],
                //['clean']
                ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
                ['blockquote', 'code-block'],

                [{ 'header': 1 }, { 'header': 2 }],               // custom button values
                [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
                [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
                [{ 'direction': 'rtl' }],                         // text direction

                [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
                [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

                [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
                [{ 'font': [] }],
                [{ 'align': [] }],

                ['clean']
            ],
        }

        this.formats = [
            'header',
            'bold', 'italic', 'underline', 'strike', 'blockquote',
            'list', 'bullet', 'indent',
            'link', 'image'
        ]
    }

    render() {

        //if (!this.state) return <div>Loading state...</div>

        //console.log('textfield propss', this.props);
        //const field = this.props.field;

        return (

            <ReactQuill
                value={this.props.data || ' '}
                onChange={this.props.onChange}
                theme="snow"
                modules={this.modules}
                formats={this.formats}
            />


        );
    }
}



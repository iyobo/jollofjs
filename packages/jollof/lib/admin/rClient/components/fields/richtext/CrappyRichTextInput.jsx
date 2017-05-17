import React, {Component, PropTypes} from 'react';
import {observer} from 'mobx-react';
import {convertFromHTML, convertToRaw, EditorState, ContentState} from 'draft-js';
import {Editor} from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
const _ = require('lodash');

@observer
export default class RichTextInput extends Component {

    constructor(props) {
        super(props);

        //console.log('props.data:', props.data)
        const editorContent = this.deriveDraftFromHtml(props.data)

        this.state = {
            editorState: EditorState.createWithContent(editorContent),
            editorContent
        };

    }

    deriveDraftFromHtml(html) {
        const blocksFromHTML = htmlToDraft(html || '<p></p>');
        const contentBlocks = blocksFromHTML.contentBlocks;
        const contentState = ContentState.createFromBlockArray(contentBlocks);

        return contentState;
    }

    componentWillReceiveProps(newProps) {
        const props = newProps || this.props

        if (props.data !== this.props.data && props.data) {

            console.log(props)

            const editorContent = this.deriveDraftFromHtml(props.data);

            this.setState({
                editorContent,
                editorState: EditorState.createWithContent(editorContent),
            });
        }
    }


    onEditorStateChange = (editorState) => {

        //console.log('editorState:', editorState);
        //this.setState({
        //    editorState,
        //});
    };

    onEditorContentChange = (editorContent) => {
        const html = draftToHtml(editorContent);
        console.log('editorContent:', html);

        this.setState({
            editorContent,
            editorState: EditorState.createWithContent(editorContent),
        });
        this.props.onChange(html);
    };

    //clearContent = () => {
    //    this.setState({
    //        contentState: convertToRaw(ContentState.createFromText('')),
    //    });
    //};


    render() {

        if (!this.state) return <div>Loading state...</div>

        //console.log('textfield props', this.props);
        const field = this.props.field;

        return (

            <div>
                <Editor
                    editorState={this.state.editorState}
                    name={this.props.name}
                    //toolbarClassName="playground-toolbar"
                    //wrapperClassName="playground-wrapper"
                    //editorClassName="playground-editor"
                    onEditorStateChange={this.onEditorStateChange}
                    onContentStateChange={this.onEditorContentChange}
                />
            </div>

        );
    }
}



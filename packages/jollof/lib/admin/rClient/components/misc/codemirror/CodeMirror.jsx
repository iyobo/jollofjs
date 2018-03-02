import React from 'react';
let codemirror = require('codemirror');

export default class CodeMirror extends React.Component {

    componentDidMount() {

        this.editor = codemirror(this.ref);
        this.editor.on('change', () => this.props.onChange(this.editor.getValue()));
    }

    componentWillReceiveProps(nextProps) {

        Object.keys(nextProps.options || {}).forEach(key => this.editor.setOption(key, nextProps.options[key]));
        this.editor.setValue(nextProps.value || '');
    }

    render() {
        return (
            <div ref={(self) => this.ref = self}/>
        )
    }
}
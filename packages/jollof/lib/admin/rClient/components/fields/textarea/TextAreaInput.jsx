import React, {Component, PropTypes} from 'react';
import {observer} from 'mobx-react';
const _ = require('lodash');

@observer
export default class TextAreaInput extends Component {

    constructor() {
        super();
    }

    render() {
        //console.log('textfield props', this.props);
        const field = this.props.field;

        return (

            <div>
                <label>
                    <textarea
                        name={this.props.name}
                        value={this.props.data}
                        disabled={field.meta.disableEdit ? true : false}
                        required={field.required ? true : false}
                        onChange={this.props.onChange}
                        rows="4"
                    />
                </label>
            </div>

        );
    }
}



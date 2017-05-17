/**
 * Created by iyobo on 2017-04-14.
 */
import React, {Component, PropTypes} from 'react';
import {rs} from 'react-spoon';
import {observer} from 'mobx-react';
const _ = require('lodash');

@observer
export default class GenericFieldInput extends Component {

    constructor() {
        super();
    }

    render() {
        //console.log('textfield props', this.props);
        const field = this.props.field;

        let inputType = null;

        //Determine input type
        if (field.meta.type === 'String') {
            inputType = 'text'
        } else if (field.meta.type === 'Number') {
            inputType = 'number'
        }


        //The field
        let returnedField = <div><i>Unknown Field Type:</i> {JSON.stringify(this.props.data)}</div>

        if (inputType) {
            returnedField = <input

                name={this.props.name}
                type={inputType}
                className="form-control"
                placeholder={this.props.name}
                required={field.required ? true : false}
                disabled={this.props.name === 'id' || field.meta.disableEdit ? true : false}
                value={this.props.data}
                onChange={this.props.onChange}
            />

        }


        return (
            <div>
                {returnedField}
            </div>

        );
    }
}



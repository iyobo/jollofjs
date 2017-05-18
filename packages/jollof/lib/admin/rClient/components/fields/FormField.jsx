/**
 * Created by iyobo on 2017-04-14.
 */
import React, {Component, PropTypes} from 'react';
import GenericFieldInput from './generic/GenericFieldInput';
import DateInput from './date/DateInput';
import BooleanInput from './boolean/BooleanInput';
import TextAreaInput from './textarea/TextAreaInput';
import RichTextInput from './richtext/RichTextInput';
import ObjectFieldInput from './object/ObjectFieldInput';
import ArrayFieldInput from './array/ArrayFieldInput';
import MapFieldInput from './map/MapFieldInput';
import FileFieldInput from './file/FileFieldInput';
import RefInput from './ref/RefInput';
import PasswordInput from './password/PasswordInput';
const _ = require('lodash');

export default class FormField extends Component {

    constructor() {
        super();

    }

    render() {

        //aa
        let fieldElem = null;
        const field = this.props.field;
        const meta = field.meta;

        let hideLabel = this.props.hideLabel;

        console.log(this.props)

        if (meta.type === 'Date') {
            fieldElem = <DateInput {...this.props} />
        } else if (meta.type === 'Boolean') {
            hideLabel = true;
            fieldElem = <BooleanInput {...this.props} />
        } else if (meta.widget === 'password') {
            fieldElem = <PasswordInput {...this.props} />
        } else if (meta.widget === 'textarea') {
            fieldElem = <TextAreaInput {...this.props} />
        } else if (meta.widget === 'ref') {
            fieldElem = <RefInput {...this.props} />
        } else if (meta.widget === 'richtext') {
            fieldElem = <RichTextInput {...this.props} />
        } else if (meta.widget === 'map') {
            fieldElem = <MapFieldInput {...this.props} />
        } else if (meta.widget === 'file') {
            fieldElem = <FileFieldInput {...this.props} />
        } else if (meta.type === 'Object') {
            //hideLabel = true;
            fieldElem = <ObjectFieldInput {...this.props} />
        } else if (meta.type === 'Array') {
            //hideLabel = true;
            fieldElem = <ArrayFieldInput {...this.props} />
        } else {
            fieldElem = <GenericFieldInput {...this.props} />
        }

        fieldElem = fieldElem || <div>No Matching Field Element found</div>

        return (
            <div class="form-group">
                {hideLabel ? '' : <label>{this.props.name}</label>}
                {fieldElem}
            </div>
        );
    }
}

FormField.contextTypes = {
    router: PropTypes.any
}


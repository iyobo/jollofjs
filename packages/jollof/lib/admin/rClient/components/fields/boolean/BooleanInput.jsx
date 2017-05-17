import 'rc-checkbox/assets/index.css';
import React, {Component, PropTypes} from 'react';
import {observer} from 'mobx-react';
import Checkbox from 'rc-checkbox';
const _ = require('lodash');

@observer
export default class BooleanInput extends Component {

    constructor() {
        super();
    }


    handleChange=(evt)=>{
        //console.log(evt, val);

        this.props.onChange(evt.target.checked)
    }

    render() {
        //console.log('textfield props', this.props);
        const field = this.props.field;

        return (

            <div >
                <label className="chkbox">
                    <Checkbox
                        name={this.props.name}
                        checked={this.props.data}
                        disabled={field.meta.disableEdit ? true : false}
                        required={field.required ? true : false}
                        onChange={this.handleChange}

                    /> &nbsp; {field.meta.description || this.props.name}
                </label>
            </div>

        );
    }
}



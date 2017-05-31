import React, {Component} from 'react';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import {observer} from 'mobx-react';
const _ = require('lodash');

@observer
export default class SelectInput extends Component {

    constructor() {
        super();
    }

    handleChange = (event, index, value) => {
        this.props.onChange(value);
    }


    render() {
        //console.log('textfield props', this.props);
        const field = this.props.field;
        const choices = field.meta.choices;

        const items = choices.map((it, i) => {
            return <MenuItem key={this.props.name+'-option-'+i} value={it} primaryText={it}/>
        });

        return (

            <div>

                <SelectField
                    name={this.props.name}
                    value={this.props.data || choices[0]}
                    onChange={this.handleChange}
                >
                    {items}

                </SelectField>

            </div>

        );
    }
}



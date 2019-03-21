/**
 * Created by iyobo on 2017-04-14.
 */
import React, {Component, PropTypes} from 'react';
import {rs} from 'react-spoon';
import {observer} from 'mobx-react';
import {observable} from 'mobx';
import FormField from '../FormField';
const _ = require('lodash');

@observer
export default class ObjectFieldInput extends Component {

    constructor() {
        super();
    }

    handleChange(valueMap){
        this.props.onChange(valueMap)
    }

    render() {
        //console.log('object field props', this.props);
        const field = this.props.field;
        const schema = field.schema;
        const parentName = this.props.name;

        const childData = observable.map(this.props.data||{});

        if (!schema) return <div><i>This field block has no fields. Check Model. Raw Data: <pre>{JSON.stringify(this.props.data)}</pre></i></div>

        const fields = []

        for (const childName in schema) {

            //console.log(childName);
            const fieldProps = {
                field: schema[childName],
                data: childData.get(childName),
                onChange: (e) => {

                    let value = e;

                    if (e && e.target) {
                        value = e.target.value;
                    }

                    //console.log('updating objectField:', value)
                    childData.set(childName, value);
                    this.handleChange(childData)

                }
            };

            const key = parentName+'.'+childName;

            let fieldElem = (
                <div key={key}>
                    <FormField {...fieldProps} name={key}></FormField>
                </div>
            );

            fields.push(fieldElem);

        }

        return (
            <div>
                <div>{field.meta.description}</div>
                <blockquote>
                    {fields}
                </blockquote>
            </div>

        );
    }
}



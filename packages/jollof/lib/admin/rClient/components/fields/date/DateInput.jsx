/**
 * Created by iyobo on 2017-04-14.
 */
import React, {Component, PropTypes} from 'react';
import {rs} from 'react-spoon';
import {observer} from 'mobx-react';
import 'react-date-picker/index.css';
import {DateField, DatePicker, TransitionView} from 'react-date-picker';
import {observable} from 'mobx';
const _ = require('lodash');

const Moment = require('moment');


@observer
export default class DateInput extends Component {

    constructor() {
        super();
    }

    static contextTypes = {
        router: PropTypes.any
    }

    handleChange = (value) => {
        //console.log('value', new Moment(value))
        //const val = (new Moment(value)).toFormat("YYYY-MM-DD HH:mm:ss")
        //console.log('val',val)

        const m = new Moment(value);
        const d = m.toDate();
        console.log('selected date:', value, 'dateObj', d)
        this.props.onChange(value)
    }


    render() {
        //console.log('textfield props', this.props);
        const field = this.props.field;

        return (
            <div>
                <DateField
                    name={this.props.name}
                    required={field.required ? true : false}
                    disabled={this.props.name === 'id' || field.meta.disableEdit ? true : false}
                    dateFormat="YYYY-MM-DD HH:mm:ss"
                    //forceValidDate={true}
                    value={this.props.data ? new Moment(this.props.data).toDate() : ''}
                    onChange={this.handleChange}
                >
                    <TransitionView>
                        <DatePicker
                            navigation={true}
                            locale="en"
                            //forceValidDate={true}
                            highlightWeekends={true}
                            highlightToday={true}
                            weekNumbers={true}
                            weekStartDay={0}
                            onChange={this.handleChange}
                        />
                    </TransitionView>
                </DateField>

            </div>

        );
    }
}



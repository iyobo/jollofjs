/**
 * Created by iyobo on 2017-04-14.
 */
import React, {Component, PropTypes} from 'react';
import {rs} from 'react-spoon';
import {observer} from 'mobx-react';
import {observable} from 'mobx';
import FormField from '../FormField';
import IconButton from 'material-ui/IconButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import ContentRemove from 'material-ui/svg-icons/content/remove';
const _ = require('lodash');
const uuid = require('uuid');

/**
 * handles array of given field
 */
let arrayItemCountStyle = {
    'fontWeight': 600,
    'fontSize': '20px',
    color: '#dedede',
    'fontStyle': 'italic',
    float: 'left',
    paddingTop: '12px'
}

let arrayItemActionStyle = {
    display: 'inline-flex',
    padding: '5px'
}


@observer
export default class ArrayFieldInput extends Component {

    constructor() {
        super();

        this.state={
            key: uuid()
        }
    }

    handleChange(valueArray) {
        this.props.onChange(valueArray)
    }


    onAddItem = () => {
        let items = this.props.data|| [];
        items.push(null);

        //console.log('on add:',items)

        this.props.onChange(items);
        //this.setState({...this.state, key: uuid()})
    }

    onRemoveItem = (index, evt) => {
        let items = this.props.data|| [];

        //console.log('removing ', index, 'from', items);
        //remove index
        items.splice(index, 1);

        this.props.onChange(items);

        this.setState({...this.state, key: uuid()})
    }

    render() {
        //console.log('Array field props', this.props);
        const field = this.props.field;
        const schema = field.schema;
        const parentName = this.props.name;

        this.listData = observable(this.props.data || []);

        //NOTE: For Each list Data
        const listFieldElements = this.listData.map((data, index) => {

            const pathName = `${parentName}.${index+1}`;

            const fieldProps = {
                field: schema,
                data: data,
                onChange: (e) => {

                    let value = e;

                    if (e && e.target) {
                        value = e.target.value;
                    }

                    //console.log(`Updating array. ${pathName}`)
                    this.listData[index] = value;
                    this.handleChange(this.listData)
                }
            };


            return (

                <div key={pathName} className="row">
                    <div className="col-md-1 " style={arrayItemActionStyle}>

                        <IconButton onClick={() => this.onRemoveItem(index)}>
                            <ContentRemove color="red"/>
                        </IconButton>
                        <span style={arrayItemCountStyle}>
                        {index + 1}
                    </span>
                    </div>
                    <div className="col-md-11">
                        <FormField {...fieldProps} name={pathName}/>
                    </div>
                </div>

            )

        });
        //------end forEach listData

        return (
            <div key={this.state.key}>
                <div>{field.meta.description}</div>
                <div className="actions">
                    <IconButton onClick={this.onAddItem}>
                        <ContentAdd />
                    </IconButton>
                </div>
                <div>
                    {listFieldElements}
                </div>
                <div className="actions">
                    <IconButton onClick={this.onAddItem}>
                        <ContentAdd />
                    </IconButton>
                </div>
            </div>

        );
    }
}



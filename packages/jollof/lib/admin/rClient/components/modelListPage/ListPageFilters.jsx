/**
 * Created by iyobo on 2017-02-18.
 */
import React, {Component, PropTypes} from 'react';
import {inject, observer} from 'mobx-react';
import TextField from 'material-ui/TextField';

import RefreshIcon from 'material-ui/svg-icons/navigation/refresh';
import RemoveIcon from 'material-ui/svg-icons/navigation/cancel';
import FlatButton from 'material-ui/FlatButton';
const _ = require('lodash');
const uuid = require('uuid');

@inject('store')
@observer
export default class ListPageFilters extends Component {

    constructor() {
        super();

        this.filterOptions = [
            '=', 'ne', 'gt', 'gte', 'lt', 'lte', 'in', 'nin', 'regex'
        ];

        this.filters = [];
    }

    //refresh page
    fetchList = (evt) => {
        if (evt) {
            evt.preventDefault();
        }

        this.props.store.models.fetchTable();
    }

    clearFilters = (evt) =>{
        if (evt) {
            evt.preventDefault();
        }

        this.props.store.models.clearFilters();
    }

    handleFilterChange = (evt, str) => {

        this.props.store.models.changeQueryConditions(str);
    }


    render() {

        //TODO: populate and attach this to models on load
        this.autoFillFields = this.props.store.models.active.model.fieldOrder.toJS();

        return (
            <form onSubmit={this.fetchList}>
                <div className="filterBlock row">

                    <div class="col-xs-10">
                        <TextField
                            floatingLabelText="Conditions"
                            fullWidth={true}
                            value={this.props.store.models.modelQuery.conditions}
                            onChange={this.handleFilterChange}
                        />
                        <FlatButton
                            label="Refresh"
                            labelPosition="before"
                            primary={true}
                            icon={<RefreshIcon />}
                            onClick={this.fetchList}
                        />
                        <FlatButton
                            label="Clear"
                            labelPosition="before"
                            primary={true}
                            icon={<RemoveIcon />}
                            onClick={this.clearFilters}
                        />
                    </div>
                    <div class="col-xs-2">


                    </div>



                    <input type="submit" style={{ display: 'none' }} value="Refresh"/>
                </div>

            </form>
        );
    }
}



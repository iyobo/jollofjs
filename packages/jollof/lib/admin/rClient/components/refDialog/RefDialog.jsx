/**
 * Created by iyobo on 2017-02-12.
 */
import React, {Component, PropTypes} from 'react';
import {inject, observer} from 'mobx-react';
import Dialog from 'material-ui/Dialog';
import RefDialogFilters from './RefDialogFilters';
import RefDialogPager from './RefDialogPager';
const _ = require('lodash');


@inject('store')
@observer
export default class RefDialog extends Component {

    constructor(props) {
        super(props);

    }

    selectItem = (row) => {

        this.props.onChange(row.id);
        this.props.closeDialog();
    }

    sort = (fieldName) => {
        this.props.store.models.sortRefTable(fieldName);
    }

    render() {
        const field = this.props.field;
        const meta = field.meta;
        if (!this.props.store.models.refActive.model.name) {
            return <div></div>
        }

        const headers = [<th key={'header'}></th>];
        _.each(this.props.store.models.refActive.model.fieldOrder.slice(0, 4), (fieldName) => {
            headers.push((
                <th key={'header' + fieldName}>
                    <a href="javascript:;" onClick={() => {
                        this.sort(fieldName)
                    }}>
                        <div>{ fieldName }

                            {this.props.store.models.refModelQuery.sort[fieldName] === 1 ?
                                <i className="fa fa-sort-asc" aria-hidden="true"></i> : ''}
                            {this.props.store.models.refModelQuery.sort[fieldName] === -1 ?
                                <i className="fa fa-sort-desc" aria-hidden="true"></i> : ''}

                        </div>
                    </a>
                </th>
            ));
        });

        //The order of the fields
        const fieldOrder = this.props.store.models.refActive.model.fieldOrder.slice(0, 5);

        //Create array of rows
        const dataRows = this.props.store.models.refActive.table.map((row) => {
            //console.log('row',row);

            const dataColumns = fieldOrder.map((fieldName) => {
                let colVal = row[fieldName];

                if (fieldName === 'id') {
                    return (
                        <td key={'datacols' + fieldName}>
                            <a href="javascript:;" onClick={() => this.selectItem(row)}>
                                <div>
                                    { colVal }
                                </div>
                            </a>
                        </td>
                    );
                }
                else {

                    if (typeof colVal === 'object') {
                        colVal = <i>{Object.keys(colVal).length} fields</i>;
                    }
                    else if (Array.isArray(colVal)) {
                        colVal = <i>{colVal.length} items</i>
                    }


                    return (
                        <td key={'datacols' + fieldName}>
                            <div>
                                { colVal}
                            </div>
                        </td>
                    );
                }

            });

            return (
                <tr key={'datarows' + row.id}>
                    <td>
                        {/*<a href="javascript:;" onClick={() => this.deleteItem(row)}>*/}
                        {/*<i className="fa fa-trash redText" aria-hidden="true"></i>*/}
                        {/*</a>*/}
                    </td>
                    {dataColumns}

                </tr>
            );
        });


        return (<Dialog
            title={this.props.name + ": Choose a " + meta.ref}
            modal={false}
            open={this.props.open}
            onRequestClose={this.props.closeDialog}
            autoDetectWindowHeight={true}
            autoScrollBodyContent={true}
            repositionOnUpdate={true}
            contentStyle={
                {width: '90%',
                height: '90%'}
            }
        >
            <div className="content table-responsive table-full-width">

                <RefDialogFilters/>
                <RefDialogPager />

                <table className="table table-hover table-striped">

                    <thead>
                    <tr>
                        {headers}
                    </tr>
                    </thead>

                    <tbody>
                    {dataRows}
                    </tbody>
                </table>

                <RefDialogPager />

            </div>
        </Dialog>)
    }

}
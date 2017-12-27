/**
 * Created by iyobo on 2017-02-12.
 */
import React, {Component} from 'react';
import {inject, observer} from 'mobx-react';
import ListPageHeader from '../../components/modelListPage/ListPageHeader';
import ListPagePager from '../../components/modelListPage/ListPagePager';

const _ = require('lodash');


@inject('store')
@observer
export default class ModelListPage extends Component {

    constructor(props) {
        super(props);

    }

    static onEnter(props) {
        props.store.models.resetQuery();

        props.store.models.fetchTable();

    }

    /**
     * We want to load table upon entering this page
     */
        //componentDidMount() {
        //	console.log('model list page mounted')
        //	this.props.store.fetchTable();
        //}


    sort = (fieldName) => {
        this.props.store.models.sortTable(fieldName);
    }

    static contextTypes = {
        router: React.PropTypes.any
    };

    deleteItem = (item) => {

        this.props.store.models.deleteItem(item.id).then(() => {
            this.props.store.models.fetchTable();
        });
    }

    editItem = (id) => {

        //this.props.store.models.edit(item);
        this.context.router.go('models.edit', { modelName: this.props.store.models.active.model.name, id: id });
    }


    render() {

        if (!this.props.store.models.active.model.name) {
            return <div>loading Table...</div>
        }

        const headers = [<th key={'header'}></th>];

        _.each(this.props.store.models.active.model.fieldOrder.slice(0, 5), (fieldName) => {
            headers.push((
                <th key={'header' + fieldName}>
                    <a href="javascript:;" onClick={() => {
                        this.sort(fieldName)
                    }}>
                        <div>{ fieldName }

                            {this.props.store.models.modelQuery.sort[fieldName] === 1 ?
                                <i className="fa fa-sort-asc" aria-hidden="true"></i> : ''}
                            {this.props.store.models.modelQuery.sort[fieldName] === -1 ?
                                <i className="fa fa-sort-desc" aria-hidden="true"></i> : ''}

                        </div>
                    </a>
                </th>
            ));
        });

        //The order of the fields
        const fieldOrder = this.props.store.models.active.model.fieldOrder.slice(0, 5);

        //Create array of rows
        const dataRows = this.props.store.models.active.table.map((row) => {
            //console.log('row',row);

            const dataColumns = fieldOrder.map((fieldName) => {
                let colVal = row[fieldName];

                if (fieldName === 'id') {
                    return (
                        <td key={'datacols' + fieldName}>
                            <a href="javascript:;" onClick={() => this.editItem(colVal)}>
                                <div>
                                    { colVal }
                                </div>
                            </a>
                        </td>
                    );
                }
                else {
                    if (!colVal) {
                        colVal = <i></i>
                    }
                    else if (typeof colVal === 'object') {
                        colVal = <i>{Object.keys(colVal).length} fields</i>;
                    }
                    else if (Array.isArray(colVal)) {
                        colVal = <i>{colVal.length} items</i>
                    }
                    else if (typeof colVal === 'string' && colVal.length> 30) {
                        colVal = <i>{colVal.substring(0,30)+'....'} </i>
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
                        <a href="javascript:;" onClick={() => this.deleteItem(row)}>
                            <i className="fa fa-trash redText" aria-hidden="true"></i>
                        </a>
                    </td>
                    {dataColumns}

                </tr>
            );
        });


        return (
            <div key={'page' + this.props.modelName} className="content animated fadeInLeft">
                <div className="container-fluid">
                    <div className="row">

                        <div className="col-xs-12 col-sm-12 col-md-12">
                            <div className="card">

                                <ListPageHeader />

                                <div className="content table-responsive table-full-width">

                                    <ListPagePager />

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

                                    <ListPagePager />

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


        );
    }
}
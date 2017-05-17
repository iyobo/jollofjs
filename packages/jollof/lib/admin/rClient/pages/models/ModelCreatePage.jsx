/**
 * Created by iyobo on 2017-02-12.
 */
import React, {Component, PropTypes} from 'react';
import {inject, observer} from 'mobx-react';
import FormField from '../../components/fields/FormField';
import {deriveEntityName} from '../../util/dataUtil';

@inject('store')
@observer
export default class ModelCreatePage extends Component {

    constructor() {
        super();
    }

    static contextTypes = {
        router: PropTypes.any
    }


    handleSubmit = (evt) => {
        evt.preventDefault();

        //console.log(this.props, this.context)

        this.props.store.models.createActiveItem().then((data) => {
            if(data)
                this.goBack()
        });

    }

    /**
     * Go back to models.list if we came from there.
     */
    goBack = (evt) => {
        const prevUrl = sessionStorage.getItem(this.props.modelName + '.list');

        console.log('going back to', prevUrl)

        if (prevUrl) {
            window.location.href = prevUrl
        } else {
            this.context.router.go('models.list', { modelName: this.props.modelName });
        }
    }


    render() {
        const schema = this.props.store.models.active.model;
        const data = this.props.store.models.active.single;

        const fields = [];

        //console.log('schema', schema)
        //console.log('fieldOrder', schema.fieldOrder)

        //loop thru the schema's keys
        schema.fieldOrder.forEach((key) => {

            if (key === 'id' || key === 'dateCreated' || key === 'lastUpdated') {
                return;
            }

            const fieldProps = {
                field: schema.schema[key],
                data: data.get ? data.get(key) : null,
                onChange: (e) => {

                    let value = e;

                    if (e && e.target) {
                        value = e.target.value;
                    }

                    //console.log('updating ', value)
                    this.props.store.models.active.single.set(key, value);
                }
            };

            let fieldElem = (
                <div key={key}>
                    <FormField {...fieldProps} name={key}></FormField>
                </div>
            );

            fields.push(fieldElem);

        });


        return (
            <div className="container-fluid animated fadeInLeft">
                <div className="row">

                    <div className="col-md-12">
                        <div className="card">
                            <div className="header">
                                <h4 className="title">New {this.props.modelName} <b>{deriveEntityName(data)}</b></h4>

                                {/*<p className="category">Coming soon</p>*/}
                            </div>
                            <div className="content">
                                <form onSubmit={this.handleSubmit} method="patch">
                                    {fields}

                                    <button type="submit" class="btn btn-info btn-fill pull-right marg-5">Create
                                    </button>
                                    <button type="button" class="btn btn-fill pull-right marg-5" onClick={this.goBack}>
                                        Cancel
                                    </button>
                                    <div class="clearfix"></div>
                                </form>
                                {/*<FormField {...fieldProps}></FormField>*/}

                            </div>
                        </div>
                    </div>

                </div>

            </div>
        );
    }
}
import 'rc-checkbox/assets/index.css';
import React, {Component} from 'react';
import {inject, observer} from 'mobx-react';
import FlatButton from 'material-ui/FlatButton';
import RefDialog from '../../refDialog/RefDialog';
import IconButton from 'material-ui/IconButton';

const _ = require('lodash');

@inject('store')
@observer
export default class RefInput extends Component {

    constructor() {
        super();
        this.state = {
            open: false,
            item: null
        }
    }

    componentWillMount(props) {
        this.fetch(this.props.data);
    }

    /**
     * Load the referenced item and keep it in this component's instance
     */
    fetch = (id) => {
        if (id) {
            this.props.store.models.fetchSpecificItem(this.props.field.meta.ref, id).then((item) => {
                this.setState({ item })
            })
        }
    }

    openDialog = () => {
        //Set collection to be used in this launch
        this.props.store.models.setActiveRefModel(this.props.field.meta.ref);

        //fetch data for collection
        this.props.store.models.fetchRefTable().then(() => {
            this.setState({ open: true });
        });

    }

    closeDialog = () => {
        this.setState({ open: false });

    }

    clearRef = () => {
        this.props.onChange(null);
    }

    onChange = (id) => {
        this.props.onChange(id);
        this.fetch(id);
    }

    getDisplayName() {

        if (this.props.data) {
            if (this.state.item) {
                return this.props.data + ' - ' + (this.state.item.name || this.state.item.title || this.state.item.firstName || '')
            } else {
                return this.props.data;
            }
        } else return 'Choose...';
    }

    render() {
        //console.log('REF props', this.props);
        const field = this.props.field;
        const meta = field.meta;


        const label = this.getDisplayName();
        return (

            <div>
                <FlatButton label={label} onClick={this.openDialog}/>
                <IconButton iconClassName="muidocs-icon-action-cancel" onClick={this.clearRef}/>

                <RefDialog {...this.props} open={this.state.open} closeDialog={this.closeDialog}
                           openDialog={this.openDialog} onChange={this.onChange}/>
            </div>

        );
    }
}



import 'rc-checkbox/assets/index.css';
import React, {Component, PropTypes} from 'react';
import {inject, observer} from 'mobx-react';
import FlatButton from 'material-ui/FlatButton';
const _ = require('lodash');


@inject('store')
@observer
export default class PasswordInput extends Component {

    constructor() {
        super();
        this._defaultState = {
            editMode: false,
            msg: 'Empty',
            p1: '',
            p2: '',
            matching: true
        };
        this.state = _.clone(this._defaultState);
    }

    toggleEditMode = () => {
        this.setState({ editMode: !this.state.editMode });
    }

    onFieldsChange = () => {
        if (this.state.p1 !== this.state.p2) {
            this.setState({ matching: false })
        }
        else {
            this.setState({ matching: true })
        }
    }

    onConfirm = () => {
        if (this.state.p1 === this.state.p2){
            this.props.onChange(this.state.p1);
            this.setState(_.clone(this._defaultState));
        }
        else{
            $.notify(this.props.name+": Password fields don't match")
        }

    }

    onP1Change=(evt)=>{
        const newState={};
        newState.p1 = evt.target.value;

        if(this.state.p2 === newState.p1){
            newState.matching = true;
        }
        else{
            newState.matching = false;
        }

        this.setState(newState);
    }

    onP2Change=(evt)=>{
        const newState={};
        newState.p2= evt.target.value;

        if(this.state.p1 === newState.p2){
            newState.matching = true;
        }
        else{
            newState.matching = false;
        }

        this.setState(newState);
    }

    render() {
        //console.log('REF props', this.props);
        const field = this.props.field;
        const meta = field.meta;
        const label = this.props.data ? '**Encrypted**' : ' Empty ';

        let editBox = <div></div>;

        if (this.state.editMode) {
            editBox = (
                <div>
                    <strong>Editing Encrypted Field</strong>
                    Enter value to change password to. BOTH fields must match or the attempt to change the password will
                    be ignored.
                    <div class="form-group">
                        <input type="text" className={"form-control"} value={this.state.p1}
                               onChange={this.onP1Change}/>
                        <small class="form-text text-muted">Password</small>
                    </div>
                    <div class={"form-group " + (this.state.matching ? "has-success" : "has-danger")}>
                        <input type="text"
                               className={"form-control " + (this.state.matching ? "form-control-success" : "form-control-danger") }
                               value={this.state.p2} onChange={this.onP2Change}/>
                        <small class="form-text text-muted">Confirm Password</small>
                    </div>
                    <FlatButton label='Confirm' onClick={this.onConfirm}/>
                </div>
            )
        }

        return (

            <div>
                <FlatButton label={label} onClick={this.toggleEditMode}/>

                {editBox}
            </div>

        );
    }
}



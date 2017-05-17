/**
 * Created by iyobo on 2017-02-12.
 */
import React, {Component, PropTypes} from 'react';
import {inject, observer} from 'mobx-react';
import LinearProgress from 'material-ui/LinearProgress';

@inject('store')
@observer
export default class ModelLayout extends Component {

    constructor(props) {
        super(props);
        this.name = "";

    }

    //static onEnter=(nextState, replace, done)=>{
    //	const name = nextState.params.modelName;
    //	console.log('Subpage entered: Entering ',name );
    //	store.changeModelPage(name);
    //	done();
    //}

    static onEnter(props) {
        //console.log(props)
        props.store.app.changeModelPage(props.modelName);
    }

    //componentDidMount(){
    //	console.log('model layout mounted')
    //}

    render() {

        const loader = this.props.store.models.loadingCount > 0 ? <LinearProgress mode="indeterminate"/> : '';
        return <div >
            {loader}
            {this.props.children}
        </div>

    }
}

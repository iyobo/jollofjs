import React, {Component, PropTypes} from 'react';
import {inject, observer} from 'mobx-react';
import ListPageFilters from './ListPageFilters';
const _ = require('lodash');
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import FlatButton from 'material-ui/FlatButton';



@inject('store')
@observer
export default class ListPageHeader extends Component {

	constructor() {
		super();
	}

	goToCreatePage = (e) => {

		this.context.router.go('models.create', {modelName: this.props.store.models.active.model.name});
	}

    static contextTypes = {
        router: React.PropTypes.any
    }

	render() {
		return (
			<div className="header">
				{/*<!--<h4 className="title">Striped Table with Hover</h4>-->*/}
				<div className="pull-right">

                    <FlatButton
                        label="Create"
                        labelPosition="before"
                        primary={true}
                        icon={<ContentAdd />}
                        onClick={this.goToCreatePage}
                    />
				</div>

				<ListPageFilters />

			</div>
		);
	}
}



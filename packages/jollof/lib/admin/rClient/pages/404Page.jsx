/**
 * Created by iyobo on 2017-02-12.
 */
import React, {Component, PropTypes} from 'react';
import {inject, observer} from 'mobx-react';

@inject('store')
@observer
export default class DashboardPage extends Component {

	constructor() {
		super();
	}

	componentDidUpdate(){
		this.props.store.app.setPageName('Oops');
	}

	render() {
		return (
			<div className="container-fluid">
				<div className="row">

					<div className="col-md-12">
						<div className="card">
							<div className="content">
								<h2> 404 - Nothing here</h2>
							</div>
						</div>
					</div>
				</div>

			</div>
		);
	}
}
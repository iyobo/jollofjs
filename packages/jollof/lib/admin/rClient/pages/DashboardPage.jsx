/**
 * Created by iyobo on 2017-02-12.
 */
import React, {Component, PropTypes} from 'react';
import {inject, observer} from 'mobx-react';

@inject('store')
@observer
export default class DashboardPage extends Component {

	constructor(props) {
		super(props);

	}


	componentWillMount(){
		//console.log('Dashboard')
		this.props.store.app.setPageName("Dashboard");
	}

	render() {
		return (
			<div className="container-fluid animated fadeInLeft">
				<div className="row">

					<div className="col-md-12">
						<div className="card">
							<div className="header">
								<h4 className="title">Data Stats</h4>
								<p className="category">Coming soon</p>
							</div>
							<div className="content">
								Are you hungry yet?
							</div>
						</div>
					</div>
				</div>

			</div>
		);
	}
}
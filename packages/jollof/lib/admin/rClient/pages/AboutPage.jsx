/**
 * Created by iyobo on 2017-02-12.
 */
import React, {Component, PropTypes} from 'react';
import {inject, observer} from 'mobx-react';

@inject('store')
@observer
export default class AboutPage extends Component {

	constructor(props) {
		super(props);

	}

	componentWillMount(){
		console.log('About')
		this.props.store.app.setPageName("About");
	}

	render() {
		return (
			<div className="container-fluid animated fadeInLeft">
				<div className="row">

					<div className="col-md-12">
						<div className="card">
							<div className="header">
								<h4 className="title">About Us</h4>
								<p className="category">We Rule</p>
							</div>

						</div>
					</div>
				</div>

			</div>
		);
	}
}
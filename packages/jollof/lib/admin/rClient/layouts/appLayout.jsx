/**
 * Created by iyobo on 2017-02-12.
 */
import React, {Component, PropTypes} from 'react';
import {Link} from 'react-spoon';
import {inject, observer} from 'mobx-react';

@inject('store')
@observer
export default class AppLayout extends Component {

	constructor() {
		super();

	}


    render() {

		let sideMenuListItems = this.props.store.models.models.map((r) => {
			return (
				<li key={'sideBarLink-' + r.name}>
					<Link toName="models.list" params={{modelName: r.name}} >
						<i className="pe-7s-server"></i>
						<p>{r.name}</p>
					</Link>
				</li>
			);
		});

		return (
			<div className="wrapper jollofadmin">
				{this.props.store.app.loadingCount>0? <div>'Loading...'</div>:''}
				<div className="sidebar" data-color="black" data-image="/jollofstatic/img/jollof2.jpg">

					{/*<!--*/}

					{/*Tip 1: you can change the color of the sidebar using: data-color="blue | azure | green | orange | red | purple"*/}
					{/*Tip 2: you can also add an image using data-image tag*/}

					{/*-->*/}

					<div className="sidebar-wrapper">
						<div className="logo">
							<a href="/" className="simple-text">
								<i className="pe-7s-home"></i>
								Back to App
							</a>
						</div>

						<ul className="nav">
							<li>
								<Link toName="dashboard">
									<i className="pe-7s-graph"></i>
									<p>Dashboard</p>
								</Link>

							</li>

							{sideMenuListItems}

						</ul>
					</div>
				</div>

				<div className="main-panel">
					<nav className="navbar navbar-default navbar-fixed">
						<div className="container-fluid">
							<div className="navbar-header">
								<button type="button" className="navbar-toggle" data-toggle="collapse"
										data-target="#navigation-example-2">
									<span className="sr-only">Toggle navigation</span>
									<span className="icon-bar"></span>
									<span className="icon-bar"></span>
									<span className="icon-bar"></span>
								</button>
								<a className="navbar-brand" href="#">Jollof Admin <b>{ this.props.store.app.pageName }</b></a>
							</div>
							<div className="collapse navbar-collapse">

								<ul className="nav navbar-nav navbar-right">

									<li>
										<a href={logoutPath}>
											Log out
										</a>
									</li>
								</ul>
							</div>
						</div>
					</nav>

					<div className="content">
						{this.props.children}
					</div>


					<footer className="footer">
						<div className="container-fluid">
							<p className="copyright pull-right">
								JollofJS created by <a href="http://yobeki.com" target="_blank">Iyobo Eki</a>. Admin
								Theme by <a
								href="http://www.creative-tim.com">Creative Tim</a>
							</p>
						</div>
					</footer>

				</div>
			</div>);
	}
}

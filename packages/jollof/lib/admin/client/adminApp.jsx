/**
 * Created by iyobo on 2016-11-08.
 */
import React from 'react';
import {render} from 'react-dom';
import {simpleRestClient, jsonServerRestClient, Admin, Resource} from 'admin-on-rest';
import Dashboard from './Dashboard';

import {buildResource} from "./resourceBuilder";

const axios = require('axios');
const _ = require('lodash');


let modelResources = [];
axios.get('/api/admin/models')
	.then(function ( response ) {

		_.each(response.data, ( schema )=> {
			modelResources.push(buildResource(schema));
		});

		render(
			<Admin dashboard={Dashboard} title="Jollof Admin"
				   restClient={jsonServerRestClient(apiRoot + '/api/admin/v1')}>
				{modelResources}
			</Admin>
			, document.getElementById('root')
		)

	})
	.catch(function ( error ) {
		console.log(error);
	});

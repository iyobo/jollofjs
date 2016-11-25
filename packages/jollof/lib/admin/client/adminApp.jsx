/**
 * Created by iyobo on 2016-11-08.
 */
import React from 'react';
import {render} from 'react-dom';
import {simpleRestClient, jsonServerRestClient, Admin, Resource} from 'admin-on-rest';
import Dashboard from './Dashboard';
import {
	List,
	Edit,
	Create,
	Show,
	Datagrid,
	DateField,
	TextField,
	EditButton,
	DisabledInput,
	TextInput,
	LongTextInput,
	DateInput,
	SelectInput,
	Filter,
	ReferenceInput,
	Delete
} from 'admin-on-rest/lib/mui';

import {buildResource} from "./resourceBuilder";
// import jollofRestClient from "./rest/jollofRestClient";

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
				   restClient={simpleRestClient(apiRoot + '/api/admin/v1')}>
				{modelResources}
			</Admin>
			, document.getElementById('root')
		);

	})
	.catch(function ( error ) {
		console.log(error);
	});

/**
 * Created by iyobo on 2016-11-08.
 */
import React from 'react';
import {render} from 'react-dom';
import {simpleRestClient,jsonServerRestClient, Admin, Resource} from 'admin-on-rest';
import Dashboard from './Dashboard';
import {
	List,
	Edit,
	Create,
	Datagrid,
	DateField,
	TextField,
	EditButton,
	DisabledInput,
	TextInput,
	LongTextInput,
	DateInput
} from 'admin-on-rest/lib/mui';
export PostIcon from 'material-ui/svg-icons/action/book';
const axios = require('axios');
const _ = require('lodash');


/**
 * Builds a client resource for this schema
 * @param schema
 * @returns {XML}
 */
function buildResource( schema ) {

	console.log(schema);

	let modelListFields = _.map(schema.structure, ( v, k )=> {
		// console.log('k',k,'v',v);
		switch (v._type) {
			case 'string':
				return <TextField key={k} source={k}/>
				break;
			case 'number':
				return <TextField key={k} source={k}/>
				break;
			case 'date':
				return <DateField key={k} source={k}/>
				break;
			default:
				return <TextField key={k} source={k}/>
				break;

		}
	});


	//For create and Edit
	let modelUpdateFields = _.map(schema.structure, ( v, k )=> {
		// console.log('k',k,'v',v);
		switch (v._type) {
			case 'string':
				return <TextInput key={k} source={k}/>
				break;
			case 'number':
				return <TextInput key={k} source={k}/>
				break;
			case 'date':
				return <DateInput key={k} source={k}/>
				break;
			default:
				return <TextField key={k} source={k}/>
				break;
		}
	});

	// Views
	const modelList = ( props ) => (
		<List {...props}>
			<Datagrid key={schema.name}>
				<TextField source="id"/>
				{modelListFields}
				<EditButton basePath="/posts"/>
			</Datagrid>
		</List>
	);

	const modelEdit = ( props ) => (
		<Edit title={"Edit "+schema.name} {...props}>
			<DisabledInput source="id"/>
			{modelUpdateFields}
			<DisabledInput source="dateCreated"/>
			<DisabledInput source="lastUpdated"/>
		</Edit>
	);

	const modelCreate = ( props ) => (
		<Create title={"Create a "+schema.name} {...props}>
			{modelUpdateFields}
		</Create>
	);

	return <Resource key={schema.name} name={schema.name} list={modelList} edit={modelEdit} create={modelCreate}/>
}

let modelResources = [];
axios.get('/api/admin/models')
	.then(function ( response ) {

		_.each(response.data, ( schema )=> {
			modelResources.push(buildResource(schema));
		});

		render(
			<Admin dashboard={Dashboard} title="Jollof Admin" restClient={jsonServerRestClient(apiRoot+'/api/admin/v1')}>
				{modelResources}
			</Admin>
			, document.getElementById('root')
		)

	})
	.catch(function ( error ) {
		console.log(error);
	});

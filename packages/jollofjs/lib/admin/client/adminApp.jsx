/**
 * Created by iyobo on 2016-11-08.
 */
import React from 'react';
import {render} from 'react-dom';
import {simpleRestClient, Admin, Resource} from 'admin-on-rest';
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

	let modelListFields = _.map(schema.structure,(v,k)=>{
		// console.log('k',k,'v',v);
		switch (v._type){
			case 'string':
				return <TextField source={k}/>
				break;
			case 'number':
				return <TextField source={k}/>
				break;
			case 'date':
				return <DateField source={k}/>
				break;
			default:
				return <TextField source={k}/>
				break;

		}
	});

	const modelTitle = ( {record} ) => {
		return <span>Post {record ? `"${record.title}"` : ''}</span>;
	};


	let modelUpdateFields = _.map(schema.structure,(v,k)=>{
		// console.log('k',k,'v',v);
		switch (v._type){
			case 'string':
				return <TextInput source={k}/>
				break;
			case 'number':
				return <TextInput source={k}/>
				break;
			case 'date':
				return <DateInput source={k}/>
				break;
			default:
				return <TextInput source={k}/>
				break;
		}
	});

	// Views

	const modelList = ( props ) => (
		<List {...props}>
			<Datagrid>
				<TextField source="id"/>
				{modelListFields}
				<EditButton basePath="/posts"/>
			</Datagrid>
		</List>
	);

	const modelEdit = ( props ) => (
		<Edit title={modelTitle} {...props}>
			<DisabledInput source="id"/>
			{modelUpdateFields}
			<DisabledInput source="dateCreated"/>
			<DisabledInput source="lastUpdated"/>
		</Edit>
	);

	const modelCreate = ( props ) => (
		<Create title="Create a Post" {...props}>
			{modelUpdateFields}
		</Create>
	);

	return <Resource key={schema.name} name={schema.name} list={modelList} edit={modelEdit} create={modelCreate}/>
}

let modelResources = [];
axios.get('/admin/models')
	.then(function ( response ) {

		_.each(response.data, ( schema )=> {
			modelResources.push(buildResource(schema));
		})

		render(
			<Admin title="Jollof Admin" restClient={simpleRestClient('http://localhost:3333/api')}>
				{modelResources}
			</Admin>
			, document.getElementById('root')
		)

	})
	.catch(function ( error ) {
		console.log(error);
	});

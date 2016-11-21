/**
 * Created by iyobo on 2016-11-08.
 */
import React from 'react';
import {render} from 'react-dom';
import {simpleRestClient, jsonServerRestClient, Admin, Resource} from 'admin-on-rest';
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
export PostIcon from 'material-ui/svg-icons/action/book';
const _ = require('lodash');


/**
 * Builds a client resource for this schema
 * @param schema
 * @returns {XML}
 */
export function buildResource( schema ) {

	console.log(schema);

	//for each schema field, create array of elements
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

	let modelViewFields = _.map(schema.structure, ( v, k )=> {
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
				return <TextInput key={k} source={k}/>
				break;
		}
	});

	// Views
	const PostFilter = ( props ) => (
		<Filter {...props}>
			<TextInput label="Search" source="q" alwaysOn/>
			{/*<ReferenceInput label="User" source="userId" reference="users" allowEmpty>*/}
			{/*<SelectInput optionText="name" />*/}
			{/*</ReferenceInput>*/}
		</Filter>
	);
	const modelList = ( props ) => (
		<List {...props} filter={PostFilter}>
			<Datagrid>
				<TextField source="id"/>
				{modelListFields}
				<EditButton basePath="/"/>
			</Datagrid>
		</List>
	);

	const modelShow = ( props ) => (
		<Show title={"Viewing " + schema.name} {...props}>
			{modelViewFields}
		</Show>
	);

	//Edit View
	const modelEdit = ( props ) => (
		<Edit title={"Edit " + schema.name} {...props}>
			<DisabledInput source="id"/>
			{modelUpdateFields}
			<DisabledInput source="dateCreated"/>
			<DisabledInput source="lastUpdated"/>
		</Edit>
	);

	//Create view
	const modelCreate = ( props ) => (
		<Create title={"Create a " + schema.name} {...props}>
			{modelUpdateFields}
		</Create>
	);

	return <Resource key={schema.name} name={schema.name} list={modelList} edit={modelEdit} create={modelCreate}
					 show={modelShow} remove={Delete}/>
}

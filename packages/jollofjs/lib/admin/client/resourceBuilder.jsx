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
	ShowButton,
	DeleteButton,
	DisabledInput,
	TextInput,
	LongTextInput,
	DateInput,
	SelectInput,
	Filter,
	ReferenceInput,
	Delete
} from 'admin-on-rest/lib/mui';
import PostIcon from 'material-ui/svg-icons/action/book';
const _ = require('lodash');
import {FileField} from './fields/file/FileField'
import {FileInput} from './fields/file/FileInput'

function buildViewFields(structure){
	return _.map(structure, ( v, k )=> {
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
				return <div></div>
				return;
				break;

		}
	});
}

function buildUpdateFields(structure){
	return _.map(structure, ( v, k )=> {
		// console.log('k', k, 'v', v);
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
			case 'object':
				//This could either be a nested object, array, or custom type.
				if (v._meta.length > 0) {
					//This requires a special field type
					if (v._meta[ 0 ].widget) {
						switch (v._meta[ 0 ].widget) {
							case 'file':
								return <FileInput key={k} source={k}/>
							default:
								return <TextInput key={k} source={k}/>
						}
					}
					else {
						return <TextInput key={k} source={k}/>
					}
				}
				else {
					return <TextInput key={k} source={k}/>
				}

				break;
			default:
				return <TextInput key={k} source={k}/>
				break;
		}
	});
}

/**
 * Builds a client resource for this schema
 * @param schema
 * @returns {XML}
 */
export function buildResource( schema ) {

	// console.log(schema);

	//for each schema field, create array of elements
	let modelViewFields = buildViewFields(schema.structure);
	
	//For create and Edit
	let modelUpdateFields = buildUpdateFields(schema.structure);

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
				{modelViewFields}
				<EditButton/>
				<ShowButton />
				<DeleteButton />
			</Datagrid>
		</List>
	);

	const modelShow = ( props ) => (
		<Show title={"Viewing " + schema.name} {...props}>
			<TextField source="id"/>
			{modelViewFields}
			<TextField source="dateCreated"/>
			<TextField source="lastUpdated"/>
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
					 show={modelShow} remove={Delete} icon={PostIcon}/>
}

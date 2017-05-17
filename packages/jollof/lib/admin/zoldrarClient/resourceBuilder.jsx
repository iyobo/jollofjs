/**
 * Created by iyobo on 2016-11-08.
 */
import React from "react";
import {render} from "react-dom";
import {simpleRestClient, jsonServerRestClient, Resource} from "admin-on-rest";
import {
	List,
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
	RichTextInput,
	Delete
} from "admin-on-rest/lib/mui";
import PostIcon from "material-ui/svg-icons/action/book";
import Edit from "./forms/Edit";
import Create from "./forms/Create";
import {MapInput} from "./fields/map/MapInput";
import {MapField} from "./fields/map/MapField";
import {ArrayField} from "./fields/array/ArrayField";
import {ArrayInput} from "./fields/array/ArrayInput";
import {FormFactor} from "./forms/FormFactor";
import {FileField} from "./fields/file/FileField";
import {FileInput} from "./fields/file/FileInput";
import BooleanField from "./fields/boolean/BooleanField";
import BooleanInput from "./fields/boolean/BooleanInput";
const _ = require('lodash');
//---SHOW/VIEW
/**
 * @param k
 * @param v
 * @param formFactor
 * @returns {XML}
 */
function determineSpecialViewField( k, v, formFactor ) {
	if (v._meta.length > 0) {
		// console.log('resource builder is processing special field', k, v);
		//This requires a special field type
		if (v._meta[ 0 ].widget) {
			switch (v._meta[ 0 ].widget) {
				case 'file':
					return <FileField key={k} source={k} formFactor={formFactor}/>
				case 'map':
					return <MapField key={k} source={k} formFactor={formFactor}/>
				default:
					return <TextField key={k} source={k}/>
			}
		}
		else {
			return <TextField key={k} source={k}/>
		}
	}
	else {
		return <TextField key={k} source={k}/>
	}
}

function determineViewField( k, v, formFactor ) {
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
		case 'boolean':
			return <BooleanField key={k} source={k}/>
			break;
		case 'object':
			//This could be a nested object, array, or custom type.
			return determineSpecialViewField(k, v, formFactor)

			break;
		case 'alternatives':
			//This could be anything
			return determineSpecialViewField(k, v, formFactor)
			break;
		case 'array':
			//This could be an array of anything
			return <ArrayField key={k} source={k} formFactor={formFactor}/>

			break;
		default:
			return <TextField key={k} source={k}/>
			break;
	}
}

function buildViewFields( structure, formFactor = FormFactor.LIST, count ) {
	let fieldCount = 0;
	const displayFields = [];

	for (let k in structure) {
		if (count && fieldCount >= count)
			break;

		// console.log('k',k,'v',v);
		displayFields.push(determineViewField(k, structure[ k ], formFactor));
		fieldCount++;
	}

	return displayFields;
}


//---INPUT

function determineInputField( k, v, componentOnly = false ) {

	//First Metas
	if (v._meta && v._meta.length > 0) {

		//check for widget specs
		if (v._meta[ 0 ].widget) {
			switch (v._meta[ 0 ].widget) {
				case 'file':
					return componentOnly ? FileInput : <FileInput key={k} source={k}/>

				case 'map':
					return componentOnly ? MapInput : <MapInput key={k} source={k}/>

				case 'textarea':
					return componentOnly ? LongTextInput :
						<LongTextInput key={k} source={k} options={{multiLine: true}}/>

				case 'richtext':
					return componentOnly ? RichTextInput : <RichTextInput key={k} source={k}/>

				case 'disabled':
					return componentOnly ? DisabledInput : <DisabledInput key={k} source={k}/>
				case 'password':
					return componentOnly ? DisabledInput : <TextInput key={k} source={k} type="password"/>

			}
		}

		//Check for ref
		if (v._meta[ 0 ].ref) {
			let ref = v._meta[ 0 ].ref;
			let name = ref.name || 'name';
			return (
				<ReferenceInput key={k} label={k} source={k} reference={ref.model}>
					<SelectInput optionText={name} />
				</ReferenceInput>
			)
		}
	}



	// //Then consider tests
	// if(v._tests && v._tests.length>0){
	// 	switch (v._tests[0].name) {
	// 		// case 'url':
	// 		// 	return componentOnly ? UrlInput : <UrlInput key={k} source={k}/>
	// 		// case 'email':
	// 		// 	return componentOnly ? UrlInput : <UrlInput key={k} source={k}/>
	// 	}
	// }

	//Check if this is Then consider valids
	if (v._valids && v._valids._set && v._valids._set.length>0) {
		let choices = v._valids._set.map((it)=>{
			return {id: it, name: it};
		})
		return componentOnly ? TextInput : <SelectInput source={k} choices={choices} />
	}


	//Finally, go by type
	switch (v._type) {
		case 'string':
			return componentOnly ? TextInput : <TextInput key={k} source={k}/>
		case 'number':
			return componentOnly ? TextInput : <TextInput key={k} source={k} type="number"/>
			break;
		case 'date':
			return componentOnly ? DateInput : <DateInput key={k} source={k}/>
		case 'boolean':
			return componentOnly ? BooleanInput : <BooleanInput key={k} source={k}/>
		case 'object':
			//TODO: This is a nested object.
			// console.log('rendering object input', k);
			const fieldGroup = []
			for (let innerK in v._inner.children) {
				let innerV = v._inner.children[ innerK ];
				fieldGroup.push(determineInputField(k + '.' + innerV.key, innerV.schema, componentOnly));
			}
			return fieldGroup;

		case 'array':
			//This could be an array of anything
			let component = determineInputField(k, v._inner.items[ 0 ], true);
			console.log('arraying...')

			//If an array of objects
			//if(component.length){
			//	component = <div>{component}</div> //wrap it
			//}

			// console.log('array component', k, component);
			return <ArrayInput key={k} source={k} itemComponent={component}/>
		default:
			return componentOnly ? TextInput : <TextInput key={k} source={k}/>
	}
}

function buildUpdateFields( structure ) {
	return _.map(structure, ( v, k )=> {
		// console.log('k', k, 'v', v);
		return determineInputField(k, v);
	});
}

/**
 * Builds a client resource for this schema
 * @param schema
 * @returns {XML}
 */
export function buildResource( schema ) {

	console.log('Building',schema.name, schema);

	//for each schema field, create array of elements
	let modelListFields = buildViewFields(schema.structure, FormFactor.LIST, 5);
	let modelSingleShowFields = buildViewFields(schema.structure, FormFactor.SINGLE);

	//For create and Edit
	let modelUpdateFields = buildUpdateFields(schema.structure);

	// Views
	const PostFilter = ( props ) => (
		<Filter {...props}>
			{/*<TextInput label="Search" source="q" alwaysOn/>*/}
			{/*<ReferenceInput label="User" source="userId" reference="users" allowEmpty>*/}
			{/*<SelectInput optionText="name" />*/}
			{/*</ReferenceInput>*/}
		</Filter>
	);
	const modelList = ( props ) => (
		<List {...props} filter={PostFilter} className="modelList">
			<Datagrid className="modelGrid">
				<EditButton/>
				<TextField source="id"/>
				{modelListFields}
				<DeleteButton />
			</Datagrid>
		</List>
	);

	const modelShow = ( props ) => (
		<Show title={"Viewing " + schema.name} {...props}>
			<TextField source="id"/>
			{modelSingleShowFields}
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
					  remove={Delete} icon={PostIcon}/>

	//Removed show={modelShow} because no point
}

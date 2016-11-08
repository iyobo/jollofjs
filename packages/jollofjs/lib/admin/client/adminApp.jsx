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
// import {PostList, PostEdit, PostCreate, PostIcon} from './posts';
const axios = require('axios');

function loadResources() {


	 const PostList = ( props ) => (
		<List {...props}>
			<Datagrid>
				<TextField source="id"/>
				<TextField source="title"/>
				<DateField source="published_at"/>
				<TextField source="average_note"/>
				<TextField source="views"/>
				<EditButton basePath="/posts"/>
			</Datagrid>
		</List>
	);

	const PostTitle = ( {record} ) => {
		return <span>Post {record ? `"${record.title}"` : ''}</span>;
	};

	const PostEdit = ( props ) => (
		<Edit title={PostTitle} {...props}>
			<DisabledInput source="id"/>
			<TextInput source="title"/>
			<TextInput source="teaser" options={{multiLine: true}}/>
			<LongTextInput source="body"/>
			<DateInput label="Publication date" source="published_at"/>
			<TextInput source="average_note"/>
			<DisabledInput label="Nb views" source="views"/>
		</Edit>
	);

	const PostCreate = ( props ) => (
		<Create title="Create a Post" {...props}>
			<TextInput source="title"/>
			<TextInput source="teaser" options={{multiLine: true}}/>
			<LongTextInput source="body"/>
			<TextInput label="Publication date" source="published_at"/>
			<TextInput source="average_note"/>
		</Create>
	);
}

let modelResources = [];
axios.get('/admin/models')
	.then(function ( response ) {
		console.log(response);
		// modelResources = loadResources();
	})
	.catch(function ( error ) {
		console.log(error);
	});


render(
	<Admin restClient={simpleRestClient('http://localhost:3333/api')}>
		{/*<Resource name="posts" list={PostList} edit={PostEdit} create={PostCreate} icon={PostIcon}/>*/}
		modelResources
	</Admin>,
	document.getElementById('root')
);
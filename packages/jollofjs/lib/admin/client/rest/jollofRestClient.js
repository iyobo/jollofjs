import {queryParameters, fetchJson} from './fetch';
import {
	GET_LIST,
	GET_MATCHING,
	GET_ONE,
	GET_MANY,
	GET_MANY_REFERENCE,
	CREATE,
	UPDATE,
	DELETE,
} from "admin-on-rest/lib/rest/types";

let jollofApiUrl = '';

/**
 * Checks if payload has any files
 * @param collection
 * @param hasFileResponse
 */
function checkForFiles( collection ) {
	let result = false;
	for (let k in collection) {
		const val = collection[ k ];

		if (!val) continue;

		// console.log('checking for file', k, val);
		if (val instanceof File) {
			console.log('isFile');
			return true;
		}
		else if (Array.isArray(val)) {
			// console.log('isArray')
			if(checkForFiles(val)) return true;

		}
		else if (typeof val === 'object') {
			// console.log('isObject')
			if(checkForFiles(val)) return true;
		}
	}
	return result;
}


var objectToFormData = function(obj, form, namespace) {

	var fd = form || new FormData();
	var formKey;

	for(var property in obj) {
		if(obj.hasOwnProperty(property)) {

			if(namespace) {
				formKey = namespace + '[' + property + ']';
			} else {
				formKey = property;
			}

			// if the property is an object, but not a File,
			// use recursivity.
			if(typeof obj[property] === 'object' && !(obj[property] instanceof File)) {

				objectToFormData(obj[formKey], fd, property);

			} else {

				// if it's a string or a File object
				fd.append(formKey, obj[property]);
			}

		}
	}

	return fd;

};

function appendRecursively( formData, collection, parentkey , parentIsArray) {
	for (let k in collection) {
		const val = collection[ k ];

		if(!val) continue;

		if (val instanceof File) {
			let mkey = (parentkey ? parentkey + '.' : '') + k;

			// if(parentIsArray)
			// 	mkey = parentkey
			// else
			// 	mkey = k


			val.foo ='bar'

			formData.append(mkey, val)
		}
		else if (Array.isArray(val)) {

			let mkey = '';
			if(parentIsArray) {
				mkey =parentkey ; //parentKey can/should never be empty if parentISarray
			}else{
				mkey = (parentkey ? parentkey + '.'+k : k);
			}

			appendRecursively(formData, val, mkey, true);
		}
		else if(typeof val === 'object'){
			let mkey = (parentkey ? parentkey + '.' : '') + k;
			appendRecursively(formData, val, mkey, false);
		}
		else {
			let mkey = (parentkey ? parentkey + '.' : '') + k;
			formData.append(mkey, val)
		}

	}
}


/**
 * Process the entiti's data and return appropriate AJAx body.
 * Wether formdata or json string.
 * @param data
 */
function processOutBody( options, data ) {

	/**
	 * Recursively check all field values to see if a file is present
	 * @param collection
	 */
	const hasFile = checkForFiles(data);

	//
	if (!hasFile) {
		// console.log('no file', data);
		options.body = JSON.stringify(data);
	} else {
		console.log('file present', data);
		let formData = new FormData();
		appendRecursively(formData, data);
		// let formData = objectToFormData(data);

		options.body = formData;
	}

}


/**
 * Maps admin-on-rest queries to a simple REST API
 *
 * The REST dialect is similar to the one of FakeRest
 * @see https://github.com/marmelab/FakeRest
 * @example
 * GET_LIST     => GET http://my.api.url/posts?sort=['title','ASC']&range=[0, 24]
 * GET_MATCHING => GET http://my.api.url/posts?filter={title:'bar'}
 * GET_ONE      => GET http://my.api.url/posts/123
 * GET_MANY     => GET http://my.api.url/posts?filter={ids:[123,456,789]}
 * UPDATE       => PUT http://my.api.url/posts/123
 * CREATE       => POST http://my.api.url/posts/123
 * DELETE       => DELETE http://my.api.url/posts/123
 */
export default ( apiUrl, httpClient = fetchJson ) => {
	jollofApiUrl = apiUrl;
	/**
	 * Upstream to Server
	 * @param {String} type One of the constants appearing at the top if this file, e.g. 'UPDATE'
	 * @param {String} resource Name of the resource to fetch, e.g. 'posts'
	 * @param {Object} params The REST request params, depending on the type
	 * @returns {Object} { url, options } The HTTP request parameters
	 */
	const convertRESTRequestToHTTP = ( type, resource, params ) => {

		// console.log(type, resource, params)
		let url = '';
		const options = {};
		switch (type) {
			case GET_LIST: {
				const {page, perPage} = params.pagination;
				const {field, order} = params.sort;
				const query = {
					sort: JSON.stringify([ field, order ]),
					range: JSON.stringify([ (page - 1) * perPage, (page * perPage) - 1 ]),
					filter: JSON.stringify(params.filter),
				};
				url = `${apiUrl}/${resource}?${queryParameters(query)}`;
				break;
			}
			case GET_MATCHING: {
				const query = {
					filter: JSON.stringify(params.filter),
				};
				url = `${apiUrl}/${resource}?${queryParameters(query)}`;
				break;
			}
			case GET_ONE:
				url = `${apiUrl}/${resource}/${params.id}`;
				break;
			case GET_MANY: {
				const query = {
					filter: JSON.stringify({id: params.ids}),
				};
				url = `${apiUrl}/${resource}?${queryParameters(query)}`;
				break;
			}
			case GET_MANY_REFERENCE: {
				const query = {
					filter: JSON.stringify({[params.target]: params.id}),
				};
				url = `${apiUrl}/${resource}?${queryParameters(query)}`;
				break;
			}
			case UPDATE:
				url = `${apiUrl}/${resource}/${params.id}`;
				options.method = 'PUT';
				processOutBody(options, params.data);
				break;
			case CREATE:
				url = `${apiUrl}/${resource}`;
				options.method = 'POST';
				processOutBody(options, params.data);
				break;
			case DELETE:
				url = `${apiUrl}/${resource}/${params.id}`;
				options.method = 'DELETE';
				break;
			default:
				throw new Error(`Unsupported fetch action type ${type}`);
		}
		return {url, options};
	};

	/**
	 * Downstream from server
	 * @param {Object} response HTTP response from fetch()
	 * @param {String} type One of the constants appearing at the top if this file, e.g. 'UPDATE'
	 * @param {String} resource Name of the resource to fetch, e.g. 'posts'
	 * @param {Object} params The REST request params, depending on the type
	 * @returns {Object} REST response
	 */
	const convertHTTPResponseToREST = ( response, type, resource, params ) => {
		const {headers, json} = response;
		// console.log({response, type, resource, params});
		switch (type) {
			case GET_LIST:
				return {
					data: json.map(x => x),
					total: parseInt(headers.get('content-range').split('/').pop(), 10),
				};
			default:
				return json;
		}
	};

	/**
	 * @param {string} type Request type, e.g GET_LIST
	 * @param {string} resource Resource name, e.g. "posts"
	 * @param {Object} payload Request parameters. Depends on the request type
	 * @returns {Promise} the Promise for a REST response
	 */
	return ( type, resource, params ) => {
		const {url, options} = convertRESTRequestToHTTP(type, resource, params);

		return httpClient(url, options)
			.then(response => convertHTTPResponseToREST(response, type, resource, params));
	};
};
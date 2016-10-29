/**
 * Created by iyobo on 2016-10-27.
 */
const validate = require('validate.js');
const _ = require('lodash');
require("./plugins/validate-plugin-array").register(validate);

var constraints = {
	winners: {
		length: {is: 1},
		presence: true,
		array: {
			firstName: {presence: true},
			lastName: {},
		}
	}
};

var result = validate({winners: [ {firstName: "qq"},{firstName: "oi"} ]}, constraints);
console.log(result);
result = validate({foo: [ {bar: "www"}, {invalid: "eee"} ]}, constraints);
console.log(result);

/**
 * Takes a schema. Returns a model
 * @param schema
 * @returns {*}
 */
module.exports.modelize = function ( schema ) {

	const modelRules = {};
	const parseLevel = [];

	function parseAttributes(fieldDef, fieldName, currentRules){
		for (let attributeName in fieldDef) {
			switch(attributeName){
				case 'required':
					currentRules['presence'] = true;
					break;
				case 'type':
					// currentRules['presence'] = true;


					break;




			}
		}
	}

	let processingArray = false;
	function parseObject( fieldDef, fieldName, currentRules ) {
		let typeOf = typeof fieldDef;

		// if (fieldDef === undefined) {
		// 	throw new Error('Invalid Schema: ' + schema.name + ', Field: ' + fieldName);
		// }
		// else
		if (typeOf === 'function') {
			//This means attr is a native data type e.g. Boolean, String, etc.
			//switch based on fieldDef.name for numerical rules

		}
		else if (typeOf === 'boolean') {
			//This means it's a boolean value
			return typeOf;
		}
		else if (typeOf === 'string') {
			//This means it's a string value
			return typeOf;
		}
		else if (typeOf === 'number') {
			//This means it's a number value
			return typeOf;
		}
		else if (fieldDef === null) {
			//This means it's a boolean value
			return 'null';
		}
		else if (Array.isArray(fieldDef)) {
			//An Array
			processingArray = true;
			parseObject(fieldDef[ 0 ], processingArray, fieldName + '[]', currentRules);
			processingArray = false;
		}
		else if (typeOf === 'object' && fieldDef.name && fieldDef.structure) {
			//a custom type. pass in it's structure
			parseStructure(fieldDef.structure, currentRules);
		}
		else if (typeOf === 'object' && (fieldDef.type || Object.keys(fieldDef).length > 0)) {
			//A detailed field def object with rules
			if(!fieldDef.type){
				//This is a nested map
				 parseStructure(fieldDef, currentRules);
			}
			else if(fieldDef.type){
				//This is a nested map
				 parseAttributes(fieldDef, fieldName, currentRules);
			}
			else if(fieldDef.type.structure){
				//This is a typed field
				 parseStructure(fieldDef.type.structure, currentRules);
			}
			else{
				//normal typed field with validation attributes
				 parseAttributes(fieldDef, fieldName, currentRules);
			}

		}
		else {
			throw new Error('Invalid Schema: ' + schema.name + ', Field: ' + fieldName);
		}
	}

	/**
	 * For each field defined in structure
	 */
	function parseStructure( structure, parentRules ) {

		for (let fieldName in structure) {
			const rules = {}
			const fieldDef = structure[ fieldName ];

			// //craft validation rules from fieldDef
			// let typeOf = typeof fieldDef;
			// // let fieldType = "";
			// let isArray = false;

			parseLevel.push(fieldName);

			if(Array.isArray(fieldDef)){
				rules['array'] = rules['array']||{};
				parseObject(fieldDef, fieldName, rules['array']);
			}
			else{
				parseObject(fieldDef, fieldName, rules);
			}


			const fullPath = parseLevel.join('.');

			//TODO: Populate rules here with validateJS stuff

			//Add crafted field constraints to model validation rules for tree bsed. but validate.js is flat
			// if(parentRules)
			// 	parentRules[ fullPath ] = rules;
			// else
			modelRules[fullPath] = rules;

			parseLevel.pop();
		}
	}

	console.log('<<< ' + schema.name + ' Model >>>');
	//Parse the schema's structure
	parseStructure(schema.structure);

	console.log(modelRules);


	/**
	 * This is a dynamically crafted class with tons of accessor magic. E.g userInstance.firstName will return userInstance.data.firstName
	 * @type {{updateAll: ((id)), update: ((id)), list: ((id)), get: ((id)), delete: ((id)), new(data)=>{validate: (()), save: (()), type}}}
	 */
	const Model = class {
		constructor( data ) {
			this.data = data;

			this.rules = modelRules;
		}

		get type() {
			return schema.name;
		}

		static * get( id ) {
			return 'Got ' + schema.name;
		}

		static * list( id ) {
			return 'List ' + schema.name;
		}

		static * update( id ) {
			return "Hohoho";
		}

		static * updateAll( id ) {
			return "Hohoho";
		}

		static * delete( id ) {
			return "Hohoho";
		}

		validate() {
			// validate it according to structure


			return true;
		}

		* save() {
			if (this.validate()) {
				return this;
			}
			else {
				return null;
			}
		}


	};

	// This way we can new jollof.models.user({firstName:'Joe'})
	return Model;
}
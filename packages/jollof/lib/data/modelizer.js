/**
 * Created by iyobo on 2016-10-27.
 */
const valix = require('validate');
const _ = require('lodash');


/**
 * Takes a schema. Returns a model
 * @param schema
 * @returns {*}
 */
module.exports.modelize = function ( schema ) {

	const modelRules = {};
	const parseLevel = [];

	function parseObject( fieldDef, isArray, fieldName, parentRules ) {
		let typeOf = typeof fieldDef;

		// if (fieldDef === undefined) {
		// 	throw new Error('Invalid Schema: ' + schema.name + ', Field: ' + fieldName);
		// }
		// else
		if (typeOf === 'function') {
			//This means attr is a class e.g. Boolean, String, etc.
			return fieldDef.name;
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
			isArray = true;
			return parseObject(fieldDef[ 0 ], isArray, fieldName + '[]',parentRules);
		}
		else if (typeOf === 'object' && fieldDef.name && fieldDef.structure) {
			//a custom type. pass in it's structure
			return parseDef(fieldDef.structure, parentRules);
		}
		else if (typeOf === 'object' && (fieldDef.type || Object.keys(fieldDef).length > 0)) {
			//A detailed field def object with rules
			return parseDef(fieldDef, parentRules);
		}
		else {
			throw new Error('Invalid Schema: ' + schema.name + ', Field: ' + fieldName);
		}
	}

	/**
	 * For each field defined in structure
	 */
	function parseDef( structure, parentRules ) {

		for (let fieldName in structure) {
			const rules = {}
			const fieldDef = structure[ fieldName ];

			//craft validation rules from fieldDef
			let typeOf = typeof fieldDef;
			let fieldType = "";
			let isArray = false;

			parseLevel.push(fieldName);

			fieldType = parseObject(fieldDef, isArray, fieldName, rules);

			// console.log(parentName, fieldName, fieldType, '(typeOf:' + typeOf + ')');
			const fullPath = parseLevel.join('.');
			// console.log(fullPath, fieldType, '(typeOf:' + typeOf + ')');

			//TODO: Populate rules here with validateJS stuff

			//Add crafted field constraints to model validation rules
			parentRules[ fullPath ] = rules;

			parseLevel.pop();
		}
	}

	console.log('<<< ' + schema.name + ' Model >>>');
	//Parse the schema's structure
	parseDef(schema.structure, modelRules);

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
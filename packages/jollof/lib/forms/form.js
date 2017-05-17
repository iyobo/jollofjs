'use strict'
/**
 * Created by iyobo on 2016-04-25.
 */
// var customValidators = require('./validators')
const _ = require('lodash');

class Form{

	constructor(ctx){
		this.fields={}
		this.isValid=true
		this.error=null
		this.validators=[{},{},{}]
	}

	/**
	 * validate all fields
	 * @param ctx
	 */
	* validate(ctx){
		var valid = true;

		yield ctx.validateBody(
			this.validators[0],
			this.validators[1],
			this.validators[2]
		);

		if (ctx.validationErrors) {
			valid=false;
			ctx.status = 422;
			ctx.body = ctx.validationErrors;

			//Attach errors to fields
			console.log(ctx.validationErrors);

		} else {
			ctx.status = 200;
		}

		return valid;
	}

	/**
	 * Checks if a field is required
	 * @param fieldName
	 */
	isRequired(fieldName){
		let result = false;
		const rule = this.validators[0][fieldName];

		if(rule){
			if(rule.indexOf('required')> -1){
				result = true;
			}
		}

		return result;
	}

	/**
	 * Returns a packaged object of the form, with values placed in their groups.
	 */
	groupedValues(){
		var obj={}
		for (var name in this.fields){
			var f = this.fields[name];
			if(f.group)
			{
				if (!obj[f.group]) obj[f.group] = {};
				obj[f.group][name] = f.value;
			}
			else{
				obj[name] = f.value;
			}
		}
		return obj;
	}

}

module.exports = Form
'use strict'
/**
 * Created by iyobo on 2016-04-25.
 */
var customValidators = require('./validators')

class Form{

	constructor(ctx){
		this.fields={}
		this.isValid=true
		this.error=null
	}

	/**
	 * validate all fields
	 * @param ctx
	 */
	validate(ctx){
		var valid = true

		//run validations
		for (var name in this.fields){
			var validation = ctx.checkBody(name)

			var rules = this.fields[name].rules
			for (var rule in rules){

				//arg must be an array or object
				var args = rules[rule]
				if(!Array.isArray(args))
					args = [args]

				//interop with our own validators
				if (rule in validation)
					validation = validation[rule].apply(validation, args)
				else if(rule in customValidators){
					customValidators[rule](ctx,this,validation,name,args)
				}
				else
				{
					throw new Error("Unknown validation rule: "+rule)
				}
			}
		}

		//if there are errors....
		if(ctx.errors){
			valid = false

			// assign each error message to associated field
			for (var i=0;i <ctx.errors.length; i++){
				var e = ctx.errors[i]
				var name = Object.keys(e)[0]
				console.log(name)
				this.fields[name].error = e[name]

			}
			// log.debug(this.fields)
		}

		return valid
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
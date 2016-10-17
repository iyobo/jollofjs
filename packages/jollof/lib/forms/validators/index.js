/**
 * Created by iyobo on 2016-04-26.
 */
/**
 * Contains custom Field Validators, if you can't find a validator here https://www.npmjs.com/package/koa-validate
 */

module.exports = {
	"equalsField": function(ctx,form, validation, currentFieldName, args){
		if(form.fields[currentFieldName].value !== form.fields[args[0]].value)
		{
			validation.addError(args[1])
		}
	},
}
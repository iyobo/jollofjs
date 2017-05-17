'use strict'
const stringUtil = require('../../util/stringUtil');
/**
 * Created by iyobo on 2016-04-25.
 */

/**
 * Default render is a Text Field.
 */
class Field {

	constructor( form, params ) {
		this.name = params.name;
		this.label = params.label || stringUtil.labelize(params.name);
		this.placeholder = params.placeholder || ""
		this.group = params.group

		this.value = (params.context.request.fields && params.context.request.fields[ this.name ]) ? params.context.request.fields[ this.name ] : ""

		this.error = null;
		this.type = params.type || "text";

		this.form = form;
	}

	isRequired(){
		return this.form.isRequired(this.name);
	}

}

module.exports = Field
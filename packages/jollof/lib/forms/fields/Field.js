'use strict'
const stringUtil = require('../../util/stringUtil');
/**
 * Created by iyobo on 2016-04-25.
 */

/**
 * Default render is a Text Field.
 */
class Field{

	constructor(params){
		this.name = params.name;
		this.label = params.label || stringUtil.labelize(params.name);
		this.rules = params.rules || {}
		this.placeholder= params.placeholder || ""
		this.group = params.group

		this.value = params.context.request.body[this.name]?params.context.request.body[this.name] : ""

		this.error = null;
		this.type= params.type || "text"
	}

}

module.exports = Field
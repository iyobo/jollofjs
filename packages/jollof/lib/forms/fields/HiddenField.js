'use strict'
/**
 * Created by iyobo on 2016-04-25.
 */


class HiddenField extends require('./Field'){

	constructor(form, params){
		super(form, params)
		this.options = params.options|| []; //must be an array
		this.label="";
		this.type="hidden"
	}

}

module.exports = HiddenField
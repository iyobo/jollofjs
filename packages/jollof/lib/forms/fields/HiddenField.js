'use strict'
/**
 * Created by iyobo on 2016-04-25.
 */


class HiddenField extends require('./Field'){

	constructor(params){
		super(params)
		this.options = params.options|| []; //must be an array
		this.label="";
		this.type="hidden"
	}

}

module.exports = HiddenField
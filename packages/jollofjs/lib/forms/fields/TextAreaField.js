'use strict'
/**
 * Created by iyobo on 2016-04-25.
 */


class TextAreaField extends require('./Field'){

	constructor(params){
		super(params)
		this.options = params.options|| []; //must be an array

		this.type="textarea"
	}

}

module.exports = TextAreaField
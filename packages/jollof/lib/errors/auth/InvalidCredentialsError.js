'use strict'
module.exports= class extends Error{
	constructor(){
		this.message = "Invalid Credentials"
	}
}
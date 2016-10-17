'use strict'
module.exports= class extends Error{
	constructor(email){
		//TODO: i18n
		super("User with email "+email+" already exists")
	}
}
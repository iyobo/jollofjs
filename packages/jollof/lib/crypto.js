'use strict'
var bcrypt = require('bcrypt-as-promised');
const settings = require('./configurator').settings;

class Crypto{
	* hash(password) {
		if (!password || password==="") return null; //don't waste time hashing nothing

		return yield bcrypt.hash(password, settings.crypto.saltrounds)
	}

	* compare(password,hash){
		var valid = false
		try{
			yield bcrypt.compare(password,hash)
			return true
		}catch(e){
			return false
		}
	}
}

module.exports = new Crypto()
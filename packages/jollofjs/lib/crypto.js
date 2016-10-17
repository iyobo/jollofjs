'use strict'
var bcrypt = require('bcrypt-as-promised');

class Crypto{
	* hash(password) {
		if (!password || password==="") return null; //don't waste time hashing nothing

		return yield bcrypt.hash(password, EL.config.crypto.saltrounds)
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
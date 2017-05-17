'use strict'
var bcrypt = require('bcrypt-nodejs');
const settings = require('./configurator').settings;

class Crypto{
	* hash(password) {
		if (!password || password==="") return null; //don't waste time hashing nothing

		return bcrypt.hashSync(password, settings.crypto.saltrounds)
	}

	* compare(password,hash){
        return bcrypt.compareSync(password,hash)
	}
}

module.exports = new Crypto()
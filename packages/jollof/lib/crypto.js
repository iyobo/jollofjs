'use strict'
var bcrypt = require('bcryptjs');
const settings = require('./configurator').settings;

class Crypto{
	async hash(password) {
		if (!password || password==="") return null; //don't waste time hashing nothing

        var salt = await bcrypt.genSaltSync(settings.crypto.saltrounds);
        return await bcrypt.hash(password, salt);
	}

	async compare(password,hash){
        return await bcrypt.compare(password,hash)
	}
}

module.exports = new Crypto()
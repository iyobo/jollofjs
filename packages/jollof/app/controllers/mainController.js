'use strict'
const jollof = require('../../');
const log = jollof.log;

class MainController {

	* index() {
		yield this.render('index');
	}

}

module.exports = new MainController()

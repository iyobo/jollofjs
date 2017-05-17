'use strict'
const jollof = require('../../');
const log = jollof.log;

class MainController {

	async index(ctx) {
		await ctx.render('index');
	}

}

module.exports = new MainController()

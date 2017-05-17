'use strict'

const bootstrap = require('./bootstrap');
const appPaths = require('../../appPaths');
const path = require('path');

bootstrap.boot(function*(params) {

    /*
     This runs the specified content of the scripts folder
     expecting params to be script, action, optional param
     */
    //find script
    var scriptName = params[0]
    var actionName = params[1]
    var paramName = params[2]
    if (!scriptName || !actionName) {
        log.error(`
		Incomplete Entry. Jollof commands needs to be executed as such:
		. jollof <script> <action> [optional_parameter]
		
		e.g. ./jollof data migrate
		`)
        process.exit(1)
    }


    try {
        var script = require('../../../../commands' + path.sep + scriptName)
    } catch (err) {
        var script = require('../commands' + path.sep + scriptName)
    }
    yield script[actionName](paramName)

})

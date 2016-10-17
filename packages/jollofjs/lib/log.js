'use strict'
var logger;
if(!process.env.NODE_ENV || process.env.NODE_ENV === 'development')
	logger = require('tracer').colorConsole({
		format : [
			"{{timestamp}} [{{file}}:{{line}}] {{message}} ",
			{error: "{{timestamp}} [{{file}}:{{line}} - ERROR] {{message}} "}
		],
	});
else
	logger = require('tracer').dailyfile({root:'../logs/', maxLogFiles: 10});

module.exports = logger

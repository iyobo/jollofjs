'use strict'
let log;
if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development')
    log = require('tracer').colorConsole({
        format: [
            "{{timestamp}} [{{file}}:{{line}}] {{message}} ",
            { error: "{{timestamp}} [{{file}}:{{line}} - ERROR] {{message}} " }
        ],
    });
else
    log = require('tracer').dailyfile({ root: '../logs/', maxLogFiles: 10 });

log.err = log.error;

module.exports = log;


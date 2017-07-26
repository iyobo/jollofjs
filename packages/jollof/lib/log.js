'use strict'
const Tracer = require('tracer');

let log;

log = Tracer.colorConsole({
    format: [
        "{{timestamp}} [{{file}}:{{line}}] {{message}} ",
        { error: "{{timestamp}} [{{file}}:{{line}} - ERROR] {{message}} " }
    ],
    transport: {
        function (data) {
            fs.appendFile('./logs/file.log', data.output + '\n', (err) => {
                if (err) throw err;
            });
        },
        function (data) {
            console.log(data.output);
        }
    }
});
//if (process.env.NODE_ENV !== 'development')
//    log = Tracer.dailyfile({ root: './logs/', maxLogFiles: 10 });


log.err = log.error;

module.exports = log;


'use strict';

exports = module.exports = require('./lib/validate.js');
exports.formalize = require('./lib/schema.js').formalize;
exports.validate = require('./lib/middleware.js');

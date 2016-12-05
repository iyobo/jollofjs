/**
 * Created by iyobo on 2016-12-05.
 */
const log = require('../log');
const _ = require('lodash');
const storage = require('../filestorage')


class HTTPUtil {

	/**
	 * If request is multi-part, Make multidimensional objects/arrays from one dimensional form data, and process any files.
	 * @param ctx
	 */
	* objectify( ctx ) {
		let fields = {}
		try {
			if (ctx.request.accept.headers[ 'content-type' ].indexOf('multipart') > -1) {

				//multi-dimensionalize ctx.fields
				for (let compoundKey in ctx.request.fields) {
					let v = ctx.request.fields[ compoundKey ];

					//If value is a file, then store it
					if (Array.isArray(v) && v.length > 0 && v[ 0 ]._writeStream) {

						/**
						 * Determine whether single or multi file field upload
						 */
						if (v.length == 1) {
							v = yield storage.store(v[ 0 ])
						} else {
							v = v.map(function*( file ) {
								const val = yield storage.store(file);
								return val;
							});
						}
					}

					//split by dot
					const keypath = compoundKey.split('.');

					//Thank God for lodash...
					_.set(fields, keypath, v)
				}

				//Update
				// ctx.request.jollofFields = fields;
				ctx.request.fields = fields;
			}
		}
		catch (ex) {
			log.error('Error while objectifying form data', ex.stack)
		}
	}
}


module.exports = new HTTPUtil();
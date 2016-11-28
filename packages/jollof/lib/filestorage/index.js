/**
 * Created by iyobo on 2016-08-24.
 */
const config = require('../configurator').settings;
const log = require('../log')
const path = require('path');
/**
 * Handles uploaded file storage and persistence within eluvianJS
 */
class FileStorage {

	* store( file, opts = {} ) {
		try {
			let engineName = opts.engine || config.fileStorage.defaultEngine;
			let engine = require(path.join(__dirname, 'engines', engineName));
			if (!engine) {
				log.warn(`No such engine name: ${engineName}. Defaulting to local`)
				engine = require('./engines/local')
			}

			return yield engine.store(file, opts)
		} catch (err) {
			log.error(`There was an error storing the file`, err.stack);
			throw err;
		}
	}

	* retrieve( path, opts = {} ) {

	}

	* delete( path, opts = {} ) {

	}

}

module.exports = new FileStorage();
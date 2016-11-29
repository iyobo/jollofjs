/**
 * Created by iyobo on 2016-11-27.
 */
const config = require('../../configurator').settings;
const path = require('path');
const fs = require('fs-promise');
const uuid = require('uuid');
const log = require('../../log');

module.exports = new class LocalFileStorage {

	/**
	 * move the file and return file metadata
	 * @param file
	 * @param metaData
	 * @param opts
	 */
	* store( file, opts ) {

		//Determine indexing prefix
		let prefix = '';
		const lo = file.name.toLowerCase();
		for (let i = 0; (i < lo.length && i < 2); i++) {
			prefix += lo[ i ] + path.sep;
		}

		//Determine path
		let newPath = path.join(config.fileStorage.engines.local.publicRoot, prefix, file.name + '__' + uuid());
		log.debug('Saving file '+file.name+' as '+newPath);
		yield fs.move(file.path, newPath);

		const resp= {
			name: file.name,
			size: file.size,
			type: file.type,

			engine: 'local',
			path: newPath,
		};



		return resp;

	}


}();
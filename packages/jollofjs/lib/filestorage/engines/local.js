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
		for (let i = 0; (i < file.name.length && i < 3); i++) {
			prefix = file.name[ i ] + path.sep;
		}

		//Determine path
		let newPath = path.join(config.fileStorage.engines.local.rootPath, prefix, file.name + '__' + uuid());
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
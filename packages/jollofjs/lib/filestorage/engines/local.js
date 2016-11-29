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
	* store( file, opts={} ) {

		//Determine indexing prefix
		const hash = uuid();

		//Determine path
		const rootPath = opts.private? config.fileStorage.engines.local.privateRoot: config.fileStorage.engines.local.publicRoot;
		let newPath = path.join(rootPath, hash[0], hash[1], hash+'__'+file.name);
		log.debug('Saving file '+file.name+' as '+newPath);
		yield fs.move(file.path, newPath);

		const resp= {
			name: file.name,
			size: file.size,
			type: file.type,

			engine: 'local',
			path: newPath,
		};

		if(!opts.private){
			resp.url = config.fileStorage.engines.local.basePublicUrl+'/'+ [hash[0], hash[1], hash+'__'+file.name].join('/');
		}


		return resp;

	}


}();
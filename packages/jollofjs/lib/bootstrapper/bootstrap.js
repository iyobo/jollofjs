/**
 * Created by iyobo on 4/22/16.
 */
const appPaths = require("../../appPaths");
const co = require('co');
const log = require('../log')


module.exports = function (fn) {
	return co(function*() {
		try {
			//Initialize Bootstrap globals. Access these anywhere in the app e.g env.settings.appname
			log.info("[Jollof] Starting Jollof app... \n APPROOT: "+appPaths.appRoot);

			//Run the application
			return yield fn(process.argv.slice(2));
		}catch(err){
			log.error(err.stack)
			
		}

	}).catch(function (err) {
		log.error("[bootstrapper] Gracefully handled exception...")
		log.error(err.stack)
		process.exit(1)
	})
}

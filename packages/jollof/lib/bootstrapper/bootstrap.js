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
			log.info("[bootstrapper] Starting Jollof app... \n APPROOT: "+appPaths.appRoot);
			log.info(`
	      ____.      .__  .__          _____       ____. _________
    |    | ____ |  | |  |   _____/ ____\     |    |/   _____/
    |    |/  _ \|  | |  |  /  _ \   __\      |    |\_____  \ 
/\__|    (  <_> )  |_|  |_(  <_> )  |    /\__|    |/        \
\________|\____/|____/____/\____/|__|    \________/_______  /
                                                          \/ 
                                        By Iyobo Eki
`);

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

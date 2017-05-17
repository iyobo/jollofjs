'use strict'
const JollofCommand = require('../util/JollofCommand');
const jollof = require('jollof');
const log = jollof.log;
const appPaths = require('../../appPaths')


class DataCommand extends JollofCommand {

	/**
	 * @description this is the description of your script
	 * @method description
	 * @return {String}
	 * @public
	 */
	* help() {
		log.info(`
		
		Contains actions for handling batch databases actions.
		Actions:
		help: Shows this message
		migrate: runs all pending data migrations.
		`)
		console.log(m)
		process.exit()
	}

	/**
	 * @description Migrate
	 * @method handle
	 * @param  {Object} options
	 * @param  {Object} flags
	 * @return {void}
	 * @public
	 */
	* migrate() {
		log.info("Running DATA migrations (order : name) ...");
		try {
			var migrations = require(appPaths.appRoot+'/migrations');
			var embassy = jollof.services.migration;
			var ignored = 0
			var ran = 0

			var nothingnew = true;
			for (var i in migrations) {
				var m = migrations[i];


				if (yield embassy.exists(m.path) ) {
					//already ran
				} else {
					//set the insertion order regardless of exclusions
					m.order = i;

					//Should we exclude this from current environment?
					var exclude = false
					if (m.excludeFrom) {
						if (Array.isArray(m.excludeFrom)) {
							if (m.excludeFrom.indexOf(jollof.config.env) > -1)
								exclude = true
						} else {
							if (m.excludeFrom === jollof.config.env)
								exclude = true
						}
					}

					//if not exluding, run this migration
					if (!exclude) {
						log.debug("Running "+m.path+"...")
						var content = require(appPaths.appRoot+'/migrations/' + m.path)
						m.reason = content.reason;
						yield content.migrate_up();
						yield embassy.create(m);
						ran++
					}
					else {
						log.trace("[Migration] " + m.path + ": ignored. Excluded from " + jollof.config.env + " environment.");
						ignored++
					}
				}


			}

			if (ran == 0)
				log.info(`No migrations ran. Database already up-to-date. Ignored ${ignored}`);
			else
				log.info(`Databases updated. Ran: ${ran} , Ignored:${ignored}`)
		} catch (e) {
			log.error(e.stack)
		}
		process.exit()
	}

}

module.exports = new DataCommand()

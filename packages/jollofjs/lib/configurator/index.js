'use strict'

/**
 * Builds the Eluvian config object.
 * Copyright(c) 2015-2016 Harminder Virk
 * MIT Licensed
 */

const appPaths = require('../../appPaths');
const path = require('path');
class Env {

	constructor( Helpers ) {

		this.currentEnv = process.env.NODE_ENV || 'development';
		this.settings = {};

		//load base
		try {
			this.settings = require(appPaths.baseConfig);

			//load environment
			var envSettings = require(path.join(appPaths.config,this.currentEnv));
			this.overwriteSettings(envSettings, this.settings);
			console.log('[Environment]', this.currentEnv, 'settings loaded.');

		} catch (err) {
			console.error(err);
		}
	}

	/**
	 * overwrites settings in baseMap with EnvMap
	 * @param envMap
	 * @param baseMap
	 */
	overwriteSettings( envMap, baseMap ) {
		for (let k in envMap) {
			var current = envMap[ k ];

			if (typeof current === 'object')
				this.overwriteSettings(current, baseMap[ k ])
			else
				baseMap[ k ] = current;


		}
	}


	/**
	 * @description get value of an existing key from
	 * env file
	 * @method get
	 * @param  {String} key
	 * @param  {Mixed} defaultValue
	 * @return {Mixed}
	 */
	get( key, defaultValue ) {
		return this.settings[ key ] || defaultValue;
	}

	/**
	 * @description set value of an existing .env variable
	 * @method set
	 * @param  {String} key
	 * @param  {Mixed} value
	 * @public
	 */
	set( key, value ) {
		this.settings[ key ] = value;
	}


}

module.exports = new Env();

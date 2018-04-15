'use strict'

/**
 * Builds the Eluvian config object.
 * Copyright(c) 2015-2016 Harminder Virk
 * MIT Licensed
 */

const appPaths = require('../../appPaths');
const log = require('../log');
const path = require('path');
const _ = require('lodash');

class Env {

    constructor(Helpers) {

        this.currentEnv = process.env.NODE_ENV || 'development';
        this.settings = {};

        //load base
        try {
            this.settings = require('./base');

            if (this.currentEnv !== 'test') {

                const appBase = require(appPaths.baseConfig);

                _.merge(this.settings, appBase)

                //load environment config file and merge if exists
                try {
                    var envSettings = require(path.join(appPaths.config, this.currentEnv));
                    _.merge(this.settings, envSettings);
                } catch (e) {
                    console.warn(`config/${this.currentEnv}.js not found. Using base alone`)
                }
            }

            console.log('[Environment]', this.currentEnv, 'settings loaded.');

        } catch (err) {
            log.error('Jollof config not loaded:', err);
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
    get(key, defaultValue) {
        return this.settings[key] || defaultValue;
    }

    /**
     * @description set value of an existing .env variable
     * @method set
     * @param  {String} key
     * @param  {Mixed} value
     * @public
     */
    set(key, value) {
        this.settings[key] = value;
    }


}

module.exports = new Env();

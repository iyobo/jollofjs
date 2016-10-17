/**
 * Created by iyobo on 2016-06-03.
 */
_ = require('lodash');
Promise = require('bluebird');
co = require('co');
EL={}
const config = require("../../../../config/index");
EL.env = config
EL.config = config.settings
EL.currentEnv= config.currentEnv;
EL.log = require("../log")
log = EL.log

EL.approot = process.cwd() + '/'
EL.crypto = require("../crypto")

//Models
const modelObj = require('../loadModels')
EL.getModel = modelObj.model
EL.models = modelObj.models
EL.model = modelObj.models
EL.mongoose = modelObj.mongoose;

//Services
EL.services = require("../../../../app/services");

module.exports = EL;

/**
 * Created by iyobo on 2017-01-11.
 */
const co = require('co');
const jollof = require('../');
const del = require('del')



before(function(){
	if(process.env.NODE_ENV !== 'test') {
		throw new Error('NODE_ENV should be "test". It is "'+process.env.NODE_ENV+'". Aborting!')
	}
});

before('bootstrapping Jollof for testing', function () {

	//Before each test, wipe
	return co(function*() {

		//If this is the test environment, wipe out memory DB
		if(process.env.NODE_ENV === 'test'){
			del.sync([ jollof.config.db.memory.filename +'/*.db' ],{force: true});
		}

		//Start Jollof
		yield jollof.bootstrap.bootStandAloneServer();

	});

});
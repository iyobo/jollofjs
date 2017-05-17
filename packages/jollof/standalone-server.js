/**
 * Created by iyobo on 2016-12-27.
 */
const jollof = require('./index');

jollof.bootstrap.bootStandAloneServer(function(){
	jollof.log.info('Jollof started in standalone-mode')
});

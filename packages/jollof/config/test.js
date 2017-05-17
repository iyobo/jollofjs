/**
 * Created by iyobo on 2016-11-07.
 */

module.exports = {

	env: 'test',

	server: {
		port: 3001, //Port main app runs on
		host: '0.0.0.0',
		hostname: 'localhost'
	},

	db:{
		memory:{
			filename: '/tmp/jolloftestdb'
		}
	}

}


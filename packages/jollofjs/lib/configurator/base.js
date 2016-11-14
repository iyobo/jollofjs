/**
 * Created by iyobo on 2016-11-07.
 */
/**
 * These are your base app configs.
 * Every one of your environment config files inherit the values here.
 * Created by iyobo on 2016-03-22.
 */
module.exports = {
	appName: "Jollof App",

	server: {
		port: 3333, //Port main app runs on
		host: '0.0.0.0',
	},

	admin:{
		enabled: true,
		port: 8009,
		auth:{
			adminFlag: 'isAdmin', //if session.user exists, check for this flag to signify user is admin
		}
	},

	domains:{
		default: 'http://localhost:3333',
	},

	env: 'development',

	db: {
		defaultAdapter: 'arangodb',
		redis: { //see https://www.npmjs.com/package/redis#options-is-an-object-with-the-following-possible-properties
			host: "127.0.0.1",
			port: 6379,
			db: 0
		},
		arangodb: {
			url: 'http://jollofuser:jollofpassword@localhost:8529',
			databaseName: 'jollofdb',
		},
		rethinkdb:{
			host: 'localhost',
			port: '28015',
			user: 'jollofuser',
			password: 'jollofpassword',
			dbname: 'jollofdb'
		},
		mongodb:{
			url:'mongodb://localhost:27017/jollofdb'
		}
	},

	/**
	 * Be sure to generate a fresh secret for each app.
	 * You can have multiple rotating keys
	 */
	crypto: {
		saltrounds: 8,
	},

	cookies: {
		expiry: 120,
		names: {
			app: 'APP',
		},
	},

	nunjucks: {
		ext: 'nunj',
		path: ['app/views','node_modules/jollof/lib/admin/views'], //from project root
		nunjucksConfig: {
			//see https://mozilla.github.io/nunjucks/api.html#configure
			noCache: false,
			autoescape: false
		},
	},


}


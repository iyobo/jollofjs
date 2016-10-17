/**
 * Created by iyobo on 2016-05-15.
 */


module.exports = {

	generateAPI: function (routes, version, name, constraints) {
		if (!constraints)
			constraints = {};

		routes[`get /api/${version}/${name}`] = {
			to: `api/${version}/${name}Controller list`,
			constraint: constraints.read
		}; //list all
		routes[`get /api/${version}/${name}/:id`] = {
			to: `api/${version}/${name}Controller get`,
			constraint: constraints.read
		}; //get one
		routes[`post /api/${version}/${name}`] = {
			to: `api/${version}/${name}Controller post`,
			constraint: constraints.create
		}; // create
		routes[`patch /api/${version}/${name}/:id`] = {
			to: `api/${version}/${name}Controller patch`,
			constraint: constraints.update
		}; // update
		routes[`delete /api/${version}/${name}/:id`] = {
			to: `api/${version}/${name}Controller delete`,
			constraint: constraints.delete
		}; //delete or disable

	},

	generateAdminAPI: function (routes) {

		routes[`get /api/admin/:modelName`] = {
			to: `adminController list`,
			constraint: 'adminSecurity loggedIn'
		}; //list all
		routes[`get /api/admin/:modelName/:id`] = {
			to: `adminController get`,
			constraint: 'adminSecurity loggedIn'
		}; //get one
		routes[`post /api/admin/:modelName`] = {
			to: `adminController post`,
			constraint: 'adminSecurity loggedIn'
		}; // create
		routes[`patch /api/admin/:modelName/:id`] = {
			to: `adminController patch`,
			constraint: 'adminSecurity loggedIn'
		}; // update
		routes[`delete /api/admin/:modelName/:id`] = {
			to: `adminController delete`,
			constraint: 'adminSecurity loggedIn'
		}; //delete or disable

	},

	generateGenericAPI: function (routes) {

		routes[`get /api/generic/:modelName`] = {
			to: `api/generic/genericController list`,
			constraint: 'adminSecurity loggedIn'
		}; //list all
		routes[`get /api/generic/:modelName/:id`] = {
			to: `api/generic/genericController get`,
			constraint: 'adminSecurity loggedIn'
		}; //get one
		routes[`post /api/generic/:modelName`] = {
			to: `api/generic/genericController post`,
			constraint: 'adminSecurity loggedIn'
		}; // create
		routes[`patch /api/generic/:modelName/:id`] = {
			to: `api/generic/genericController patch`,
			constraint: 'adminSecurity loggedIn'
		}; // update
		routes[`delete /api/generic/:modelName/:id`] = {
			to: `api/generic/genericController delete`,
			constraint: 'adminSecurity loggedIn'
		}; //delete or disable

	},

}
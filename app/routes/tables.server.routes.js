'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var tables = require('../../app/controllers/tables.server.controller');

	// Tables Routes
	app.route('/tables')
		.get(tables.list)
		.post(users.requiresLogin, tables.create);

	app.route('/tables/:tableId')
		.get(tables.read)
		.put(users.requiresLogin, tables.hasAuthorization, tables.update)
		.delete(users.requiresLogin, tables.hasAuthorization, tables.delete);

	// Finish by binding the Table middleware
	app.param('tableId', tables.tableByID);
};

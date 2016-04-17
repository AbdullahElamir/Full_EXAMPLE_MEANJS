'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var colleges = require('../../app/controllers/colleges.server.controller');

	// Colleges Routes
	app.route('/colleges')
		.get(colleges.list)
		.post(users.requiresLogin, colleges.create);

	app.route('/colleges/:collegeId')
		.get(colleges.read)
		.put(users.requiresLogin, colleges.hasAuthorization, colleges.update)
		.delete(users.requiresLogin, colleges.hasAuthorization, colleges.delete);

	// Finish by binding the College middleware
	app.param('collegeId', colleges.collegeByID);
};

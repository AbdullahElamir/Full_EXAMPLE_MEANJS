'use strict';

/**
 * Module dependencies
 */
var collegesPolicy = require('../policies/colleges.server.policy'),
  colleges = require('../controllers/colleges.server.controller');

module.exports = function (app) {
  // Colleges collection routes
  app.route('/api/colleges').all(collegesPolicy.isAllowed)
    .get(colleges.list)
    .post(colleges.create);

  // Single college routes
  app.route('/api/colleges/:collegeId').all(collegesPolicy.isAllowed)
    .get(colleges.read)
    .put(colleges.update)
    .delete(colleges.delete);

  // Finish by binding the college middleware
  app.param('collegeId', colleges.collegeByID);
};

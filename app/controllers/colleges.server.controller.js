'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	College = mongoose.model('College'),
	_ = require('lodash');

/**
 * Create a College
 */
exports.create = function(req, res) {
	var college = new College(req.body);
	college.user = req.user;

	college.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(college);
		}
	});
};

/**
 * Show the current College
 */
exports.read = function(req, res) {
	res.jsonp(req.college);
};

/**
 * Update a College
 */
exports.update = function(req, res) {
	var college = req.college ;

	college = _.extend(college , req.body);

	college.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(college);
		}
	});
};

/**
 * Delete an College
 */
exports.delete = function(req, res) {
	var college = req.college ;

	college.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(college);
		}
	});
};

/**
 * List of Colleges
 */
exports.list = function(req, res) {

	var sort;
	var sortObject = {};
	var count = req.query.count || 5;
	var page = req.query.page || 1;


	var filter = {
		filters : {
			mandatory : {
				contains: req.query.filter
			}
		}
	};

	var pagination = {
		start: (page - 1) * count,
		count: count
	};

	if (req.query.sorting) {
		var sortKey = Object.keys(req.query.sorting)[0];
		var sortValue = req.query.sorting[sortKey];
		sortObject[sortValue] = sortKey;
	}
	else {
		sortObject.desc = '_id';
	}

	sort = {
		sort: sortObject
	};


	College
		.find()
		.filter(filter)
		.order(sort)
		.page(pagination, function(err, colleges){
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else {
				res.jsonp(colleges);
			}
		});

};

/**
 * College middleware
 */
exports.collegeByID = function(req, res, next, id) {
	College.findById(id).populate('user', 'displayName').exec(function(err, college) {
		if (err) return next(err);
		if (! college) return next(new Error('Failed to load College ' + id));
		req.college = college ;
		next();
	});
};

/**
 * College authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.college.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};

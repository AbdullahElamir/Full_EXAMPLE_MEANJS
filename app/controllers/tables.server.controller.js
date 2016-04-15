'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Table = mongoose.model('Table'),
	_ = require('lodash');

/**
 * Create a Table
 */
exports.create = function(req, res) {
	var table = new Table(req.body);
	table.user = req.user;

	table.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(table);
		}
	});
};

/**
 * Show the current Table
 */
exports.read = function(req, res) {
	res.jsonp(req.table);
};

/**
 * Update a Table
 */
exports.update = function(req, res) {
	var table = req.table ;

	table = _.extend(table , req.body);

	table.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(table);
		}
	});
};

/**
 * Delete an Table
 */
exports.delete = function(req, res) {
	var table = req.table ;

	table.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(table);
		}
	});
};

/**
 * List of Tables
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


	Table
		.find()
		.filter(filter)
		.order(sort)
		.page(pagination, function(err, tables){
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else {
				res.jsonp(tables);
			}
		});

};

/**
 * Table middleware
 */
exports.tableByID = function(req, res, next, id) {
	Table.findById(id).populate('user', 'displayName').exec(function(err, table) {
		if (err) return next(err);
		if (! table) return next(new Error('Failed to load Table ' + id));
		req.table = table ;
		next();
	});
};

/**
 * Table authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.table.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};

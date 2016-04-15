'use strict';
/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  College = mongoose.model('College'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));
/**
 * Create an college
 */
exports.create = function (req, res) {
  console.log(req.body);
  var college = new College(req.body);
  college.user = req.user;
  college.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(college);
    }
  });
};

/**
 * Show the current college
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var college = req.college ? req.college.toJSON() : {};

  // Add a custom field to the College, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the College model.
  college.isCurrentUserOwner = !!(req.user && college.user && college.user._id.toString() === req.user._id.toString());

  res.json(college);
};

/**
 * Update an college
 */
exports.update = function (req, res) {
  var college = req.college;

  college.title = req.body.title;
  college.content = req.body.content;

  college.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(college);
    }
  });
};

/**
 * Delete an college
 */
exports.delete = function (req, res) {
  var college = req.college;

  college.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(college);
    }
  });
};

/**
 * List of Colleges
 */
exports.list = function (req, res) {
  College.find().sort('-created').populate('user', 'displayName').exec(function (err, colleges) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(colleges);
    }
  });
};

/**
 * College middleware
 */
exports.collegeByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'College is invalid'
    });
  }

  College.findById(id).populate('user', 'displayName').exec(function (err, college) {
    if (err) {
      return next(err);
    } else if (!college) {
      return res.status(404).send({
        message: 'No college with that identifier has been found'
      });
    }
    req.college = college;
    next();
  });
};

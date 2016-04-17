'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * College Schema
 */
var CollegeSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  name: {
    type: String,
    default: '',
    trim: true,
    required: 'name cannot be blank'
  },
  history: {
    type: String,
    default: '',
    trim: true,
    required: 'history cannot be blank'
  },
  student_union: {
    url_page: {
      type: String,
      default: '',
      trim: true,
      required: 'url_page cannot be blank'
    },
    phone: {
      type: String,
      default: '',
      trim: true,
      required: 'phone cannot be blank'
    }
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('College', CollegeSchema);

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
  Age: {
    type: Number,
    default: '',
    trim: true,
    required: 'name cannot be blank'
  },
  numberOfDepartment: {
    type: Number,
    default: '',
    trim: true,
    required: 'name cannot be blank'
  },
  studentsUnion: {
    name: {
      type: Number,
      default: '',
      trim: true,
      required: 'name cannot be blank'
    },
    phone: {
      type: [{ body: String }],
      default: '',
      trim: true,
      required: 'name cannot be blank'
    },
    url: {
      type: Number,
      default: '',
      trim: true,
      required: 'name cannot be blank'
    }
  },
  discription: {
    type: String,
    default: '',
    required: 'discription cannot be blank',
    trim: true
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('College', CollegeSchema);

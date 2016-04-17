'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Table = mongoose.model('Table'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, table;

/**
 * Table routes tests
 */
describe('Table CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Table
		user.save(function() {
			table = {
				name: 'Table Name'
			};

			done();
		});
	});

	it('should be able to save Table instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Table
				agent.post('/tables')
					.send(table)
					.expect(200)
					.end(function(tableSaveErr, tableSaveRes) {
						// Handle Table save error
						if (tableSaveErr) done(tableSaveErr);

						// Get a list of Tables
						agent.get('/tables')
							.end(function(tablesGetErr, tablesGetRes) {
								// Handle Table save error
								if (tablesGetErr) done(tablesGetErr);

								// Get Tables list
								var tables = tablesGetRes.body;

								// Set assertions
								(tables[0].user._id).should.equal(userId);
								(tables[0].name).should.match('Table Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Table instance if not logged in', function(done) {
		agent.post('/tables')
			.send(table)
			.expect(401)
			.end(function(tableSaveErr, tableSaveRes) {
				// Call the assertion callback
				done(tableSaveErr);
			});
	});

	it('should not be able to save Table instance if no name is provided', function(done) {
		// Invalidate name field
		table.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Table
				agent.post('/tables')
					.send(table)
					.expect(400)
					.end(function(tableSaveErr, tableSaveRes) {
						// Set message assertion
						(tableSaveRes.body.message).should.match('Please fill Table name');
						
						// Handle Table save error
						done(tableSaveErr);
					});
			});
	});

	it('should be able to update Table instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Table
				agent.post('/tables')
					.send(table)
					.expect(200)
					.end(function(tableSaveErr, tableSaveRes) {
						// Handle Table save error
						if (tableSaveErr) done(tableSaveErr);

						// Update Table name
						table.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Table
						agent.put('/tables/' + tableSaveRes.body._id)
							.send(table)
							.expect(200)
							.end(function(tableUpdateErr, tableUpdateRes) {
								// Handle Table update error
								if (tableUpdateErr) done(tableUpdateErr);

								// Set assertions
								(tableUpdateRes.body._id).should.equal(tableSaveRes.body._id);
								(tableUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Tables if not signed in', function(done) {
		// Create new Table model instance
		var tableObj = new Table(table);

		// Save the Table
		tableObj.save(function() {
			// Request Tables
			request(app).get('/tables')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Table if not signed in', function(done) {
		// Create new Table model instance
		var tableObj = new Table(table);

		// Save the Table
		tableObj.save(function() {
			request(app).get('/tables/' + tableObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', table.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Table instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Table
				agent.post('/tables')
					.send(table)
					.expect(200)
					.end(function(tableSaveErr, tableSaveRes) {
						// Handle Table save error
						if (tableSaveErr) done(tableSaveErr);

						// Delete existing Table
						agent.delete('/tables/' + tableSaveRes.body._id)
							.send(table)
							.expect(200)
							.end(function(tableDeleteErr, tableDeleteRes) {
								// Handle Table error error
								if (tableDeleteErr) done(tableDeleteErr);

								// Set assertions
								(tableDeleteRes.body._id).should.equal(tableSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Table instance if not signed in', function(done) {
		// Set Table user 
		table.user = user;

		// Create new Table model instance
		var tableObj = new Table(table);

		// Save the Table
		tableObj.save(function() {
			// Try deleting Table
			request(app).delete('/tables/' + tableObj._id)
			.expect(401)
			.end(function(tableDeleteErr, tableDeleteRes) {
				// Set message assertion
				(tableDeleteRes.body.message).should.match('User is not logged in');

				// Handle Table error error
				done(tableDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec(function(){
			Table.remove().exec(function(){
				done();
			});	
		});
	});
});

'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	College = mongoose.model('College'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, college;

/**
 * College routes tests
 */
describe('College CRUD tests', function() {
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

		// Save a user to the test db and create new College
		user.save(function() {
			college = {
				name: 'College Name'
			};

			done();
		});
	});

	it('should be able to save College instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new College
				agent.post('/colleges')
					.send(college)
					.expect(200)
					.end(function(collegeSaveErr, collegeSaveRes) {
						// Handle College save error
						if (collegeSaveErr) done(collegeSaveErr);

						// Get a list of Colleges
						agent.get('/colleges')
							.end(function(collegesGetErr, collegesGetRes) {
								// Handle College save error
								if (collegesGetErr) done(collegesGetErr);

								// Get Colleges list
								var colleges = collegesGetRes.body;

								// Set assertions
								(colleges[0].user._id).should.equal(userId);
								(colleges[0].name).should.match('College Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save College instance if not logged in', function(done) {
		agent.post('/colleges')
			.send(college)
			.expect(401)
			.end(function(collegeSaveErr, collegeSaveRes) {
				// Call the assertion callback
				done(collegeSaveErr);
			});
	});

	it('should not be able to save College instance if no name is provided', function(done) {
		// Invalidate name field
		college.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new College
				agent.post('/colleges')
					.send(college)
					.expect(400)
					.end(function(collegeSaveErr, collegeSaveRes) {
						// Set message assertion
						(collegeSaveRes.body.message).should.match('Please fill College name');
						
						// Handle College save error
						done(collegeSaveErr);
					});
			});
	});

	it('should be able to update College instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new College
				agent.post('/colleges')
					.send(college)
					.expect(200)
					.end(function(collegeSaveErr, collegeSaveRes) {
						// Handle College save error
						if (collegeSaveErr) done(collegeSaveErr);

						// Update College name
						college.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing College
						agent.put('/colleges/' + collegeSaveRes.body._id)
							.send(college)
							.expect(200)
							.end(function(collegeUpdateErr, collegeUpdateRes) {
								// Handle College update error
								if (collegeUpdateErr) done(collegeUpdateErr);

								// Set assertions
								(collegeUpdateRes.body._id).should.equal(collegeSaveRes.body._id);
								(collegeUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Colleges if not signed in', function(done) {
		// Create new College model instance
		var collegeObj = new College(college);

		// Save the College
		collegeObj.save(function() {
			// Request Colleges
			request(app).get('/colleges')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single College if not signed in', function(done) {
		// Create new College model instance
		var collegeObj = new College(college);

		// Save the College
		collegeObj.save(function() {
			request(app).get('/colleges/' + collegeObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', college.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete College instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new College
				agent.post('/colleges')
					.send(college)
					.expect(200)
					.end(function(collegeSaveErr, collegeSaveRes) {
						// Handle College save error
						if (collegeSaveErr) done(collegeSaveErr);

						// Delete existing College
						agent.delete('/colleges/' + collegeSaveRes.body._id)
							.send(college)
							.expect(200)
							.end(function(collegeDeleteErr, collegeDeleteRes) {
								// Handle College error error
								if (collegeDeleteErr) done(collegeDeleteErr);

								// Set assertions
								(collegeDeleteRes.body._id).should.equal(collegeSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete College instance if not signed in', function(done) {
		// Set College user 
		college.user = user;

		// Create new College model instance
		var collegeObj = new College(college);

		// Save the College
		collegeObj.save(function() {
			// Try deleting College
			request(app).delete('/colleges/' + collegeObj._id)
			.expect(401)
			.end(function(collegeDeleteErr, collegeDeleteRes) {
				// Set message assertion
				(collegeDeleteRes.body.message).should.match('User is not logged in');

				// Handle College error error
				done(collegeDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec(function(){
			College.remove().exec(function(){
				done();
			});	
		});
	});
});

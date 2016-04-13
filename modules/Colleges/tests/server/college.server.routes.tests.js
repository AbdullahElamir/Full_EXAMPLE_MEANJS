'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  College = mongoose.model('College'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  college;

/**
 * College routes tests
 */
describe('College CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
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

    // Save a user to the test db and create new college
    user.save(function () {
      college = {
        title: 'College Title',
        content: 'College Content'
      };

      done();
    });
  });

  it('should be able to save an college if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new college
        agent.post('/api/colleges')
          .send(college)
          .expect(200)
          .end(function (collegeSaveErr, collegeSaveRes) {
            // Handle college save error
            if (collegeSaveErr) {
              return done(collegeSaveErr);
            }

            // Get a list of colleges
            agent.get('/api/colleges')
              .end(function (collegesGetErr, collegesGetRes) {
                // Handle college save error
                if (collegesGetErr) {
                  return done(collegesGetErr);
                }

                // Get colleges list
                var colleges = collegesGetRes.body;

                // Set assertions
                (colleges[0].user._id).should.equal(userId);
                (colleges[0].title).should.match('College Title');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an college if not logged in', function (done) {
    agent.post('/api/colleges')
      .send(college)
      .expect(403)
      .end(function (collegeSaveErr, collegeSaveRes) {
        // Call the assertion callback
        done(collegeSaveErr);
      });
  });

  it('should not be able to save an college if no title is provided', function (done) {
    // Invalidate title field
    college.title = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new college
        agent.post('/api/colleges')
          .send(college)
          .expect(400)
          .end(function (collegeSaveErr, collegeSaveRes) {
            // Set message assertion
            (collegeSaveRes.body.message).should.match('Title cannot be blank');

            // Handle college save error
            done(collegeSaveErr);
          });
      });
  });

  it('should be able to update an college if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new college
        agent.post('/api/colleges')
          .send(college)
          .expect(200)
          .end(function (collegeSaveErr, collegeSaveRes) {
            // Handle college save error
            if (collegeSaveErr) {
              return done(collegeSaveErr);
            }

            // Update college title
            college.title = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing college
            agent.put('/api/colleges/' + collegeSaveRes.body._id)
              .send(college)
              .expect(200)
              .end(function (collegeUpdateErr, collegeUpdateRes) {
                // Handle college update error
                if (collegeUpdateErr) {
                  return done(collegeUpdateErr);
                }

                // Set assertions
                (collegeUpdateRes.body._id).should.equal(collegeSaveRes.body._id);
                (collegeUpdateRes.body.title).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of colleges if not signed in', function (done) {
    // Create new college model instance
    var collegeObj = new College(college);

    // Save the college
    collegeObj.save(function () {
      // Request colleges
      request(app).get('/api/colleges')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single college if not signed in', function (done) {
    // Create new college model instance
    var collegeObj = new College(college);

    // Save the college
    collegeObj.save(function () {
      request(app).get('/api/colleges/' + collegeObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', college.title);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single college with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/colleges/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'College is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single college which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent college
    request(app).get('/api/colleges/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No college with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an college if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new college
        agent.post('/api/colleges')
          .send(college)
          .expect(200)
          .end(function (collegeSaveErr, collegeSaveRes) {
            // Handle college save error
            if (collegeSaveErr) {
              return done(collegeSaveErr);
            }

            // Delete an existing college
            agent.delete('/api/colleges/' + collegeSaveRes.body._id)
              .send(college)
              .expect(200)
              .end(function (collegeDeleteErr, collegeDeleteRes) {
                // Handle college error error
                if (collegeDeleteErr) {
                  return done(collegeDeleteErr);
                }

                // Set assertions
                (collegeDeleteRes.body._id).should.equal(collegeSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an college if not signed in', function (done) {
    // Set college user
    college.user = user;

    // Create new college model instance
    var collegeObj = new College(college);

    // Save the college
    collegeObj.save(function () {
      // Try deleting college
      request(app).delete('/api/colleges/' + collegeObj._id)
        .expect(403)
        .end(function (collegeDeleteErr, collegeDeleteRes) {
          // Set message assertion
          (collegeDeleteRes.body.message).should.match('User is not authorized');

          // Handle college error error
          done(collegeDeleteErr);
        });

    });
  });

  it('should be able to get a single college that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new college
          agent.post('/api/colleges')
            .send(college)
            .expect(200)
            .end(function (collegeSaveErr, collegeSaveRes) {
              // Handle college save error
              if (collegeSaveErr) {
                return done(collegeSaveErr);
              }

              // Set assertions on new college
              (collegeSaveRes.body.title).should.equal(college.title);
              should.exist(collegeSaveRes.body.user);
              should.equal(collegeSaveRes.body.user._id, orphanId);

              // force the college to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the college
                    agent.get('/api/colleges/' + collegeSaveRes.body._id)
                      .expect(200)
                      .end(function (collegeInfoErr, collegeInfoRes) {
                        // Handle college error
                        if (collegeInfoErr) {
                          return done(collegeInfoErr);
                        }

                        // Set assertions
                        (collegeInfoRes.body._id).should.equal(collegeSaveRes.body._id);
                        (collegeInfoRes.body.title).should.equal(college.title);
                        should.equal(collegeInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  it('should be able to get a single college if signed in and verify the custom "isCurrentUserOwner" field is set to "true"', function (done) {
    // Create new college model instance
    college.user = user;
    var collegeObj = new College(college);

    // Save the college
    collegeObj.save(function () {
      agent.post('/api/auth/signin')
        .send(credentials)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var userId = user.id;

          // Save a new college
          agent.post('/api/colleges')
            .send(college)
            .expect(200)
            .end(function (collegeSaveErr, collegeSaveRes) {
              // Handle college save error
              if (collegeSaveErr) {
                return done(collegeSaveErr);
              }

              // Get the college
              agent.get('/api/colleges/' + collegeSaveRes.body._id)
                .expect(200)
                .end(function (collegeInfoErr, collegeInfoRes) {
                  // Handle college error
                  if (collegeInfoErr) {
                    return done(collegeInfoErr);
                  }

                  // Set assertions
                  (collegeInfoRes.body._id).should.equal(collegeSaveRes.body._id);
                  (collegeInfoRes.body.title).should.equal(college.title);

                  // Assert that the "isCurrentUserOwner" field is set to true since the current User created it
                  (collegeInfoRes.body.isCurrentUserOwner).should.equal(true);

                  // Call the assertion callback
                  done();
                });
            });
        });
    });
  });

  it('should be able to get a single college if not signed in and verify the custom "isCurrentUserOwner" field is set to "false"', function (done) {
    // Create new college model instance
    var collegeObj = new College(college);

    // Save the college
    collegeObj.save(function () {
      request(app).get('/api/colleges/' + collegeObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', college.title);
          // Assert the custom field "isCurrentUserOwner" is set to false for the un-authenticated User
          res.body.should.be.instanceof(Object).and.have.property('isCurrentUserOwner', false);
          // Call the assertion callback
          done();
        });
    });
  });

  it('should be able to get single college, that a different user created, if logged in & verify the "isCurrentUserOwner" field is set to "false"', function (done) {
    // Create temporary user creds
    var _creds = {
      username: 'temp',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create temporary user
    var _user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'temp@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _user.save(function (err, _user) {
      // Handle save error
      if (err) {
        return done(err);
      }

      // Sign in with the user that will create the College
      agent.post('/api/auth/signin')
        .send(credentials)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var userId = user._id;

          // Save a new college
          agent.post('/api/colleges')
            .send(college)
            .expect(200)
            .end(function (collegeSaveErr, collegeSaveRes) {
              // Handle college save error
              if (collegeSaveErr) {
                return done(collegeSaveErr);
              }

              // Set assertions on new college
              (collegeSaveRes.body.title).should.equal(college.title);
              should.exist(collegeSaveRes.body.user);
              should.equal(collegeSaveRes.body.user._id, userId);

              // now signin with the temporary user
              agent.post('/api/auth/signin')
                .send(_creds)
                .expect(200)
                .end(function (err, res) {
                  // Handle signin error
                  if (err) {
                    return done(err);
                  }

                  // Get the college
                  agent.get('/api/colleges/' + collegeSaveRes.body._id)
                    .expect(200)
                    .end(function (collegeInfoErr, collegeInfoRes) {
                      // Handle college error
                      if (collegeInfoErr) {
                        return done(collegeInfoErr);
                      }

                      // Set assertions
                      (collegeInfoRes.body._id).should.equal(collegeSaveRes.body._id);
                      (collegeInfoRes.body.title).should.equal(college.title);
                      // Assert that the custom field "isCurrentUserOwner" is set to false since the current User didn't create it
                      (collegeInfoRes.body.isCurrentUserOwner).should.equal(false);

                      // Call the assertion callback
                      done();
                    });
                });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      College.remove().exec(done);
    });
  });
});

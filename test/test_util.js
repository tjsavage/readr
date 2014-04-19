var mongoose = require("mongoose");
var User = require("../models/user");
var should = require("should");

var TEST_EMAIL = "test@test.com";
var TEST_PASS = "abc";



var loginUser = function loginUser(agent, done) {
    agent
        .post('/accounts/login')
        .send({
            email: TEST_EMAIL,
            password: TEST_PASS
        })
        .expect(302)
        .end(function(err, res) {
            if (err) return done(err);
            return done();
        });
}

var createTestUser = function createTestUser(done) {
    var testUser = new User({
        local: {
            email: TEST_EMAIL,
            password:  TEST_PASS
        }
    });

    testUser.save(function(err) {
        if (err) throw err;
        done();
    });
}

var deleteAllUsers = function deleteAllUsers(done) {
    User.remove({}, function(err) {
        if (err) throw err;
        done();
    });
}

var connectDb = function(done) {
    mongoose.connect('mongodb://localhost/readr_test', done);
}

var disconnectDb = function(done) {
    mongoose.disconnect(done);
}

var setupTestAgent = function setupTestAgent(agent, done) {
    connectDb(function() {
        createTestUser(function() {
            loginUser(agent, done);
        });
    });
}

var teardownTestAgent = function(agent, done) {
    deleteAllUsers(function() {
        disconnectDb(done);
    });
}

exports.loginUser = loginUser;
exports.createTestUser = createTestUser;
exports.deleteAllUsers = deleteAllUsers;
exports.connectDb = connectDb;
exports.disconnectDb = disconnectDb;
exports.setupTestAgent = setupTestAgent;
exports.teardownTestAgent = teardownTestAgent;

exports.TEST_EMAIL = TEST_EMAIL;
exports.TEST_PASS = TEST_PASS;
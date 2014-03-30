var mongoose = require("mongoose");
var should = require("should");
var User = require("../../models/user");
var app = require("../../server").app;
var request = require("supertest");

var TEST_EMAIL = "test@test.com";
var TEST_PASS = "abc";
var accounts = require("../../routes/accounts");

describe("Accounts.js", function() {
    var response;

    before(function(done) {
        mongoose.connect('mongodb://localhost/readr_test', done);
    });

    after(function(done) {
        mongoose.disconnect();
        done();
    });

    beforeEach(function(done) {
        done();
    });

    afterEach(function(done) {
        done();
    });

    describe("logging in", function() {
        beforeEach(function(done) {
            createTestUser(done);
            
        });

        afterEach(function(done) {
            deleteAllUsers(done);
        });

        it("should let the user log in with the right password", function(done) {
            request(app)
                .post('/accounts/login')
                .send({email: TEST_EMAIL, password: TEST_PASS})
                .expect(function(res) {
                    res.headers.location.should.not.equal("/accounts/login");
                })
                .end(done);
        });

        it("should not let the user log in with the wrong password", function(done) {
            request(app)
                .post('/accounts/login')
                .send({email: TEST_EMAIL, password: 'wrong'})
                .expect('location', '/accounts/login')
                .end(done)
        });
    });

    describe("signing up", function() {
        beforeEach(function(done) {
            createTestUser(done);
        });

        afterEach(function(done) {
            deleteAllUsers(done);
        });

        it("should let the user create an account if email is unique", function(done) {
            request(app)
                .post('/accounts/register')
                .send({email: "unique@email.com", password: TEST_PASS})
                .expect(function(res) {
                    res.headers.location.should.not.equal("/accounts/register")
                })
                .end(done);
        });

        it("should not let the user create an account if duplicate email", function(done) {
            request(app)
                .post('/accounts/register')
                .send({email: TEST_EMAIL, password: TEST_PASS})
                .expect('location', '/accounts/register')
                .end(done);
        });

    });
});

function createTestUser(done) {
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

function deleteAllUsers(done) {
    User.remove({}, function(err) {
        if (err) throw err;
        done();
    });
}
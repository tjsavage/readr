var mongoose = require("mongoose");
var should = require("should");
var User = require("../../models/user");
var app = require("../../server").app;
var request = require("supertest");
var util = require("../test_util");

var accounts = require("../../routes/accounts");

process.env.NODE_ENV = "test";

describe("Accounts.js", function() {
    var response;

    before(function(done) {
        util.connectDb(done);
    });

    after(function(done) {
        util.disconnectDb(done);
    });

    describe("logging in", function() {
        beforeEach(function(done) {
            util.createTestUser(done);
            
        });

        afterEach(function(done) {
            util.deleteAllUsers(done);
        });

        it("should let the user log in with the right password", function(done) {
            request(app)
                .post('/accounts/login')
                .send({email: util.TEST_EMAIL, password: util.TEST_PASS})
                .expect(function(res) {
                    res.headers.location.should.not.equal("/accounts/login");
                })
                .end(done);
        });

        it("should not let the user log in with the wrong password", function(done) {
            request(app)
                .post('/accounts/login')
                .send({email: util.TEST_EMAIL, password: 'wrong'})
                .expect('location', '/accounts/login')
                .end(done);
        });

        it("should set the correct next url if they are forced to log in", function(done) {
            request(app)
                .get('/essays/submit')
                .expect('location', '/accounts/login/?next=/essays/submit')
                .end(done);
        });

        it("should redirect correctly if logging in with a next url", function(done) {
            request(app)
                .post('/accounts/login')
                .send({email: util.TEST_EMAIL, password: util.TEST_PASS, next: '/essays/submit'})
                .expect('location', '/essays/submit')
                .end(done);
        });
    });

    describe("signing up", function() {
        beforeEach(function(done) {
            util.createTestUser(done);
        });

        afterEach(function(done) {
            util.deleteAllUsers(done);
        });

        it("should let the user create an account if email is unique", function(done) {
            request(app)
                .post('/accounts/register')
                .send({email: "unique@email.com", password: util.TEST_PASS})
                .expect(function(res) {
                    res.headers.location.should.not.equal("/accounts/register");
                })
                .end(done);
        });

        it("should not let the user create an account if duplicate email", function(done) {
            request(app)
                .post('/accounts/register')
                .send({email: util.TEST_EMAIL, password: util.TEST_PASS})
                .expect('location', '/accounts/register')
                .end(done);
        });

    });

    describe("resetting password", function() {
        beforeEach(function(done) {
            util.createTestUser(done);
        });

        afterEach(function(done) {
            util.deleteAllUsers(done);
        });

        it("should not let the users send an email if the email doesn't exist", function(done) {
            request(app)
                .post('/accounts/forgot')
                .send({email: "wrong@email.com"})
                .expect(302)
                .end(done);
        });

        it("should let the user send a forgot email", function(done) {
            request(app)
                .post('/accounts/forgot')
                .send({email: "test@test.com"})
                .expect(200)
                .end(done);
        });

        it("should let the user reset their password", function(done) {
            request(app)
                .post('/accounts/forgot')
                .send({email: util.TEST_EMAIL})
                .expect(200)
                .end(function() {
                    User.findOne({"local.email": util.TEST_EMAIL}, function(err, user) {
                        if (err) throw err;
                        user.should.be.ok;

                        var token = user.local.reset.token;
                        token.should.be.ok;

                        request(app)
                            .get('/accounts/reset?resetToken=' + token)
                            .expect(200)
                            .end(done);
                    });
                });
        });
    });
});


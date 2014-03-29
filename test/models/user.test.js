var mongoose = require("mongoose");
var should = require("should");
var User = require("../../models/user");

var TEST_EMAIL = "test@test.com";
var TEST_PASS = "abc";

describe("User", function() {
    var currentEssay = null;
    before(function(done) {
        mongoose.connect('mongodb://localhost/readr_test', done);
    });

    after(function(done) {
        mongoose.disconnect();
        done();
    });

    describe("local auth", function() {
        var testUser;

        beforeEach(function(done) {
            testUser = new User({
                local: {
                    email: TEST_EMAIL,
                    password:  TEST_PASS
                }
            });

            testUser.save(function(err) {
                if (err) throw err;
                done();
            });
        });

        afterEach(function(done) {
            User.remove({}, function(err) {
                if (err) throw err;
                done();
            });
        });

        it("should successfully find a user by email", function(done) {
            User.findOne({'local.email': TEST_EMAIL}, function(err, user) {
                user.should.equal(testUser);
            })
        })

        it("should validate the user's password if correct", function(done) {

            User.findOne({'local.email': TEST_EMAIL}, function(err, user) {
                if (err) throw err;

                user.validatePassword(TEST_PASS).should.be.true;
                done();
            });
        });

        it("should invalidate the user's password if incorrect", function(done) {

            User.findOne({'local.email': TEST_EMAIL}, function(err, user) {
                if (err) throw err;

                user.validatePassword('wrong').should.not.be.true;
                done();
            });
        });
    });
});
    
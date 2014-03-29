var mongoose = require("mongoose");

var accounts = require("../../routes/accounts");

describe("Accounts.js", function() {
    before(function(done) {
        mongoose.connect('mongodb://localhost/readr_test', done);
    });

    after(function(done) {
        mongoose.disconnect();
        done();
    });

    describe("logging in", function() {
        beforeEach(function(done) {
            done();
        })
    });
});
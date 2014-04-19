var mongoose = require("mongoose");
var should = require("should");
var User = require("../../models/user");
var app = require("../../server").app;
var request = require("supertest");
var util = require("../test_util");
var agent = request.agent(app);

var TEST_EMAIL = "test@test.com";
var TEST_PASS = "abc";
var accounts = require("../../routes/accounts");

process.env.NODE_ENV = "test";

describe("submitting an essay", function() {
    before(function(done) {
        util.setupTestAgent(agent, done);
    });

    after(function(done) {
        util.teardownTestAgent(agent, done);
    });

    it("should let you get to the submit essay page", function(done) {
        agent.get('/essays/submit')
            .expect(200)
            .end(done);
    });
})
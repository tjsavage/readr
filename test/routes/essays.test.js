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

describe("#essays submitting an essay", function() {
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

    it("should submit the essay and upload it to drive", function(done) {
        agent.post('/essays/submit')
            .field("schoolId", 1)
            .field("promptId", 1)
            .attach('essayFile', __dirname + '/fixtures/essay.txt')
            .expect(200)
            .end(function(err) {
                if (err) throw(err);
                done();
            });
    });
})
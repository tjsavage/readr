var mongoose = require("mongoose");
var update_surge = require('../../tasks/update_surge');

describe("update_surge", function() {
	before(function(done) {
		mongoose.connect('mongodb://localhost/readr_test');
		done();
	});

	beforeEach(function(done) {
		// Set up set of essays to determine surge pricing on
		done();
	});

	afterEach(function(done) {
		// Remove all the essays
		done();
	});

	after(function(done) {
		mongoose.disconnect();
		done();
	});

	it("should set surge pricing on essays with less than one day left", function(done) {
		// TODO: Obviously more to add here.
		update_surge();
		done();
	});
});
var mongoose = require("mongoose");
/*
var Essay = require("../../models/essay");

describe("Essay", function() {
	var currentEssay = null;
	before(function(done) {
		mongoose.connect('mongodb://localhost/readr_test');
	});

	beforeEach(function(done) {
		currentEssay = new Essay({});
		currentEssay.save(function(err) {
			if (err) throw err;
			done();
		});
	});

	afterEach(function(done) {
		Essay.remove({}, function() {
			done();
		});
	});

	after(function(done) {
		mongoose.disconnect();
	});

	describe("#save()", function() {
		it("should save when asked without error", function(done) {
			var newEssay = new Essay({});
			newEssay.save(function(err) {
				if (err) throw err;
				done();
			});
		});

		it("should throw an error if saved without a submitter", function(done) {
			var newEssay = new Essay({});
			newEssay.save(function(err) {
				if (err) {
					done();
				}
			});
		});
	});

});
*/
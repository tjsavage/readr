var mongoose = require("mongoose");
var Essay = require("../../models/essay");

mongoose.connect('mongodb://localhost/readr_test');
describe("Essay", function() {
	var currentEssay = null;

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
var mongoose = require("mongoose");
var should = require("should");
var Essay = require("../../models/essay");

var SCHOOL = "Stanford"


describe("Essay", function() {

	before(function(done) {
		mongoose.connect('mongodb://localhost/readr_test',done);
	});

	after(function(done) {
		mongoose.disconnect();
		done();
	});

	describe("basic essay", function(){
		var testEssay;

		beforeEach(function(done){
			testEssay = new Essay({
				school: SCHOOL
			});

			testEssay.save(function(err){
				if (err) throw err;
				done();
			});
		});

		afterEach(function(done){
			Essay.remove({}, function(err){
				if (err) throw err;
				done();
			});
		});

		it("should throw an error if the status option is invalid", function(done){
			
			Essay.findOne({'school': SCHOOL}, function(err, essay){
				if (err) throw err;
		
				essay.setStatus('esthena').should.throw();
				done();
			});
		});


	});
});


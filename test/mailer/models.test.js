var should = require("should");
var mailer = require("../../mailer/models");

process.env.NODE_ENV = 'test';

describe('mailer models', function() {
	describe("#sendOne()", function(done) {
		it("should render the password reset templates correctly", function(done) {
			var locals = {
				email: 'test@test.com',
				subject: 'password reset',
				name: "Stupid User",
				resetUrl: "http://localhost:3000/accounts/reset?resetHash=12345abcde"
			};

			mailer.sendOne('password-reset', locals, function(err, responseStatus, html, text) {
				should.not.exist(err);
				responseStatus.should.include("OK");
				text.should.include(locals.resetUrl);
				html.should.include(locals.resetUrl);
				done();
			});
		});
	});
});
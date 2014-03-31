var path = require('path');
var templatesDir = path.resolve(__dirname, '..', 'templates');
var emailTemplates = require('email-templates');
var nodemailer = require('nodemailer');

var config = require('../config/mailer');

var EmailAddressRequiredError = new Error('email address required');

var defaultTransport = nodemailer.createTransport("SMTP", config);

exports.sendOne = function(templateName, locals, done) {
	if(!locals.email) {
		done(EmailAddressRequiredError);
	}

	emailTemplates(templatesDir, function(err, template) {
		if (err) {
			console.log(err);
		} else {
			var transport = defaultTransport;

			template(templateName, locals, function(err, html, text) {
				if (err) {
					console.log(err);
					return done(err);
				}

				if (process.env.NODE_ENV === 'test') {
					return done(null, '250 2.0.0 OK 1350452502 s5sm19782310obo.10', html, text);
				}

				transport.sendMail({
					from: config.defaultFromAddress,
					to: locals.email,
					subject: locals.subject,
					html: html,
					text: text
				}, function(err, responseStatus) {
					if (err) {
						console.log(err);
						return done(err);
					} else {
						return done(null, responseStatus.message, html, text);
					}
				});
			});
		}
	});

};

	
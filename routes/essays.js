// routes/essays.js
var formidable = require('formidable');
var util = require('util');
var googleapis = require("googleapis");
var GOOGLE_AUTH = require("../config/googleapis");
var fs = require("fs");
var moment = require("moment");

var auth = new googleapis.OAuth2Client(GOOGLE_AUTH.CLIENT_ID, GOOGLE_AUTH.CLIENT_SECRET, GOOGLE_AUTH.REDIRECT_URL);
auth.setCredentials(GOOGLE_AUTH.CREDENTIALS);

exports.get_submit = function(req, res) {
	res.render("essays/submit.html")
};

exports.post_submit = function(req, res) {
    var form = new formidable.IncomingForm();

    if (process.env.NODE_ENV == 'test') {
        var driveFilename = "test"
    } else {
        var dateString = moment().format();
        var driveFilename = dateString + "_" + req.user.email;
    }
    

    form.parse(req, function(err, fields, files) {
        var essayFile = files.essayFile;
        fs.readFile(essayFile.path, function(err, data) {
            auth.refreshAccessToken(function(err) {
                if (err) throw err;
                googleapis.discover('drive', 'v2').execute(function(err, client) {
                    client.drive.files
                        .insert({ 
                            convert: true
                        })
                        .withMedia(essayFile.type, data)
                        .withAuthClient(auth)
                        .execute(function(err, result) {
                            if (err) throw err;
                            
                            
                    });
                });
            });
        })
    });

    return;

};
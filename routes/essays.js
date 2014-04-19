// routes/essays.js
var formidable = require('formidable');
var util = require('util');
var googleapis = require("googleapis");
var GOOGLE_AUTH = require("../config/googleapis");
var fs = require("fs");

var auth = new googleapis.OAuth2Client(GOOGLE_AUTH.CLIENT_ID, GOOGLE_AUTH.CLIENT_SECRET, GOOGLE_AUTH.REDIRECT_URL);
auth.setCredentials(GOOGLE_AUTH.CREDENTIALS);

exports.get_submit = function(req, res) {
	res.render("essays/submit.html")
};

exports.post_submit = function(req, res) {
    console.log(req);
    var form = new formidable.IncomingForm();

    form.parse(req, function(err, fields, files) {
        var essayFile = files.essayFile;
        
        var fileStatus = fs.statSync(essayFile.path);
        fs.open(essayFile.path, function(err, fd) {
            if (err) throw err;
            var buffer = new Buffer(fileStatus.size);
            fs.read(fd, buffer, 0, fileStatus.size, 0, function(err, num) {
                if (err) throw err;
                auth.refreshAccessToken(function(err) {
                    if (err) throw err;
                    googleapis.discover('drive', 'v2').execute(function(err, client) {
                        client.drive.files
                            .insert({ 
                                title: "Test", 
                            })
                            .withMedia(essayFile.type, fd)
                            .withAuthClient(auth)
                            .execute(function(err, result) {
                            if (err) throw err;
                            res.writeHead(200, {'content-type': 'text/plain'});
                            res.end(util.inspect(result));
                        });
                    });
                });
            })
        });             
    });

    return;

};
// routes/googleapis.js

// tasks/generate_google_auth.js
var googleapis = require('googleapis');
var GOOGLE_AUTH = require('../config/googleapis');

var auth = new googleapis.OAuth2Client(GOOGLE_AUTH.CLIENT_ID, GOOGLE_AUTH.CLIENT_SECRET, GOOGLE_AUTH.REDIRECT_URL)

exports.oauth2configure = function(req, res) {
    googleapis.discover('drive', 'v2').execute(function(err, client) {
        var url = auth.generateAuthUrl({ 
            scope: GOOGLE_AUTH.SCOPE,
            access_type: "offline"
        });

        res.redirect(url);
    });
}

exports.oauth2callback = function(req, res) {
    var authCode = req.query.code;
    console.log(authCode);

    auth.getToken(authCode, function(err, tokens) {
        if (err) {
            console.log("Error while trying to retrieve access token", err);
            return;
        }
        auth.credentials = tokens

        res.send(tokens);
    });
}

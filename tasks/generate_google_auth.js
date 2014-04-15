// tasks/generate_google_auth.js
var googleapis = require('googleapis');
var GOOGLE_AUTH = require('../config/googleapis');

var auth = new googleapis.OAuth2Client(GOOGLE_AUTH.CLIENT_ID, GOOGLE_AUTH.CLIENT_SECRET, GOOGLE_AUTH.REDIRECT_URL)

googleapis.discover('drive', 'v2').execute(function(err, client) {
    var url = auth.generateAuthUrl({ scope: GOOGLE_AUTH.SCOPE});
    var getAccessToken = function(code) {
        auth.getToken(code, function(err, tokens) {
            if (err) {
                console.log("Error while trying to retrieve access token", err);
                return;
            }
            auth.credentials = tokens
        });
    }

    console.log('Visit the url: ', url);
});

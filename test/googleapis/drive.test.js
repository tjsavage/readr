var should = require("should");
var googleapis = require("googleapis");
var GOOGLE_AUTH = require("../../config/googleapis");

process.env.NODE_ENV = 'test';

var auth = new googleapis.OAuth2Client(GOOGLE_AUTH.CLIENT_ID, GOOGLE_AUTH.CLIENT_SECRET, GOOGLE_AUTH.REDIRECT_URL);
auth.credentials = GOOGLE_AUTH.CREDENTIALS;

describe('googleapis drive', function() {
    this.timeout(5000);
    var resultFileResource;

    before(function(done) {
        googleapis.discover('drive', 'v2').execute(function(err, client) {
            client.drive.files.insert({ title: "Test Document", mimeType: "text/plain"}).withMedia("text/plain", "Hello test!").withAuthClient(auth).execute(function(err, result) {
                if (err) throw err;
                resultFileResource = result;
                done();
            });
        });
    });

    after(function(done) {
        googleapis.discover('drive', 'v2').execute(function(err, client) {
            if (err) throw err;
            client.drive.files.delete({fileId: resultFileResource.id}).withAuthClient(auth).execute(function(err, result) {
                if (err) throw err;
                done();
            });
        });   
    });

    it('should let you list the files', function(done) {
        googleapis.discover('drive', 'v2').execute(function(err, client) {
            if (err) throw err;
            client.drive.files.list().withAuthClient(auth).execute(function(err, result) {
                if (err) throw err;
                result.should.not.be.empty;
                done()
            });
        });
    });
});
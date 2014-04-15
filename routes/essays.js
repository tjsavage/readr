// routes/essays.js
var formidable = require('formidable');
var util = require('util');

exports.get_submit = function(req, res) {
	res.render("essays/submit.html")
};

exports.post_submit = function(req, res) {
    var form = new formidable.IncomingForm();

    form.parse(req, function(err, fields, files) {
        res.writeHead(200, {'content-type': 'text/plain'});
        res.write('received upload:\n\n');
        res.end(util.inspect({fields: fields, files: files}));
    });

    return;

};
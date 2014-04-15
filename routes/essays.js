// routes/essays.js

exports.get_submit = function(req, res) {
	res.render("essays/submit.html")
};

exports.post_submit = function(req, res) {
    console.log(req.body);
    res.send(200);
};
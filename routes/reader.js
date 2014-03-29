// routes/reader.js

exports.dashboard = function(req, res) {
    res.send("Yes!");
}

exports.apply = function(req, res) {
    res.render('reader/apply.html');
}
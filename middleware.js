module.exports = {
	globalLocals: function(req, res, next) {
		res.locals.siteTitle = 'Readr';
		next();
	}
}
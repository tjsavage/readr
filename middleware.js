module.exports = {
	globalLocals: function(req, res, next) {
		res.locals.siteTitle = 'Readr';
		next();
	},

    isLoggedIn: function(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }

        res.redirect('/accounts/login/?next=' + req.originalUrl);
    }
}


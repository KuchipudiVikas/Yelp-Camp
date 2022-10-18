module.exports.isLoggedIn = (req, res, next) => {
    console.log("req.user....", req.user)
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        console.log(req.session)
        req.flash('error', 'you must be logged in')
        return res.redirect('/login')
    }
    next();
}
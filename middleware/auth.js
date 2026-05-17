// Middleware: blocks access to protected routes if user is not logged in
// Add this to any route that requires a login

function requireLogin(req, res, next) {
    if (req.session && req.session.userId) {
        next(); // user is logged in, continue to the route
    } else {
        res.redirect('/login');
    }
}

module.exports = { requireLogin };


// Note: If the user is not authenticated, redirect to login page
const ensureAuth = (req, res, next) => {
    if (req.isAuthenticated()) {
        next()
    } else {
        res.redirect('/')
    }
}

// Note: If user is authenticated, redirect to dashboard
const ensureGuest = (req, res, next) => {
    if(req.isAuthenticated()) {
        res.redirect('/dashboard')
    } else {
        next()
    }
}

module.exports = {
    ensureAuth,
    ensureGuest
}
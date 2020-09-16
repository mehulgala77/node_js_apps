
const auth = (req, res, next) => {

    // Note: This method is given by passport
    if (req.isAuthenticated()) {
        return next()
    }

    req.flash('error_msg', 'Please login to view this resource')
    res.redirect('/users/login')
}

module.exports = auth
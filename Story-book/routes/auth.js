
const express = require('express')
const passport = require('passport')

const router = express.Router()

// @desc    Login with Google
// @route   GET /auth/google
router.get('/google', passport.authenticate('google', {
    scope: ['profile']
}))

// @desc    Callback for Google Auth
// @route   GET /auth/google/callback
router.get('/google/callback', passport.authenticate('google', {
    failureRedirect: '/',
    successRedirect: '/dashboard'
}))

// @desc    Logout
// @route   GET /auth/logout
router.get('/logout', (req, res) => {
    req.logOut()
    res.redirect('/')
})
 
module.exports = router
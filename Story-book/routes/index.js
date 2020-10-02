
const express = require('express')
const { ensureAuth, ensureGuest } = require('../middleware/auth')
const Story = require('../models/Story')

const router = express.Router()

// @desc    Login/Landing page
// @route   GET /
router.get('/', ensureGuest, (req, res) => {
    // Note: This is how we explicitly specify layputs
    // Note: First param is "login" view and second param is "login" layput.
    res.render('login', {
        layout: 'login'
    })
})

// @desc    Dashboard
// @route   GET /dashboard
router.get('/dashboard', ensureAuth, async (req, res) => {

    try {
        
        // Note: Lean is used to convert mongoose documents to JS objects
        const stories = await Story.find({ user: req.user.id }).lean()
        res.render('dashboard', {
            name: req.user.firstName,
            stories
        })

    } catch (err) {
        console.error(err);
        // Note: Error views
        res.render('error/500')
    }

})

module.exports = router
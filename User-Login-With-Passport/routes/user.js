
const express = require('express')
const bcrypt = require('bcryptjs')
const passport = require('passport')

const router = express.Router()

// Model
const User = require('../models/user')

router.get('/login', (req, res) => {
    res.render('login')
})

router.get('/register', (req, res) => {
    res.render('register')
})

router.post('/register', async (req, res) => {
    const {name, email, password, password2} = req.body

    const errors = []

    if (!name || !email || !password || !password2) {
        errors.push({
            msg: 'Please fill all fields'
        })
    }

    if (password) {
        
        if (password !== password2) {
            errors.push({
                msg: 'Passwords do not match'
            })
        }

        if (password.length < 6) {
            errors.push({
                msg: 'Password is too small'
            })
        }

    }

    if (errors.length > 0) {
        return res.render('register', {
            errors,
            name,
            email,
            password,
            password2
        })
    } 

    try {

        const user = await User.findOne({ email })

        if (user) {

            errors.push({
                msg: 'Email already registered!'
            })

            return res.render('register', {
                errors,
                name,
                email,
                password,
                password2
            })  
        }

        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(password, salt)

        const newUser = new User({
            name, 
            email,
            password: hash
        })

        await newUser.save()
        req.flash('success_msg', 'You are now registered and can log in.')
        res.redirect('/users/login')

    } catch (err) {
        console.error(err)
        res.send('Oops, something went wrong!')
    }
    
})

// Login Handler
router.post('/login', (req, res, next) => {

    // Note: Invoke passport's local strategy
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next)

})

// Logout handler 
router.get('/logout', (req, res) => {

    // Note: This method is given by passport
    req.logout()

    req.flash('success_msg', 'You are logged out.')
    res.redirect('/users/login')
})

module.exports = router
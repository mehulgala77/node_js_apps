
const express = require('express')
const auth = require('../config/auth')

const router = express.Router()

router.get('/', (req, res) => {
    res.render('welcome')
})

router.get('/dashboard', auth, (req, res) => {
    res.render('dashboard', {
        name: req.user.name
    })
})

module.exports = router
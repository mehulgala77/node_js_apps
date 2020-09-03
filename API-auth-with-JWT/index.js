
const express = require('express')
const jwt = require('jsonwebtoken')

const app = express()

// @route   GET /api
// @desc    API home page
app.get('/api', (req, res) => {
    res.json({
        message: "Welcome to APIs"
    })
})

// @route   GET /api/login
// @desc    API login page
app.get('/api/login', (req, res) => {

    // Create a user
    const user = {
        id: 1,
        name: 'mehul',
        email: 'mehul@gmail.com'
    }

    // Create JWT token 
    // user is the payload.
    // 'secretkey' is the shared secret.
    jwt.sign(user, 'secretkey', (err, token) => {
        if (err) {
            res.sendStatus(500)
        } else {
            res.json({ token })
        }
    })

    // Create JWT token 
    // user is the payload.
    // 'secretkey' is the shared secret.
    // 'expiresIn' is the option to set the expiry. 
    // jwt.sign(user, 'secretkey', { expiresIn: '50s' }, (err, token) => {
    //     if (err) {
    //         res.sendStatus(500)
    //     } else {
    //         res.json({ token })
    //     }
    // })

})

// Auth Middleware
const verifyToken = (req, res, next) => {

    // Extract authorization token         
    const authHeader = req.headers['authorization'];
    
    if(!authHeader) {
        return res.sendStatus(403)
    }

    const bearer = authHeader.split(' ')
    const bearerToken = bearer[1]

    // Verify the token 
    jwt.verify(bearerToken, 'secretkey', (err, authData) => {
        if (err) {
            return res.sendStatus(403)
        }

        // Extract user from token and set it in req object.
        req.user = authData
        next()
    })
}

// @route   GET /api/post
// @desc    (Protected) API Post Creation page
app.post('/api/post', verifyToken, (req, res) => {

    // If user is present, allow the request, else block it.
    if (!req.user) {
        return res.sendStatus(403)
    }

    res.json({
        message: 'Post Created...',
        authData: req.user
    })
})

app.listen(3000, () => {
    console.log('Server running on port 3000');
})

const express = require('express')
const request = require('request')
const bodyParser = require('body-parser')

const app = express()

// Body parser middleware to parse url-encoded and json response
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

// Home route to give index html
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})

// Subscribe route to subscribe new user
app.post('/subscribe', (req, res) => {

    // Captcha response is mandatory
    if (req.body.captcha === undefined || 
        req.body.captcha === '' ||
        req.body.captcha === null) 
    {
        return res.status(400).json({
            "success": false,
            "msg": "Invalid Captcha from Client."
        })
    }

    // Form verification URL
    const secretKey = process.env.GOOGLE_RECAPTCHA_SECRET_KEY
    const verifyURL = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${req.body.captcha}&remoteip${req.connection.remoteAddress}`

    // Send verification request to Google
    request.post(verifyURL, (error, response, body) => {
        body = JSON.parse(body)

        // If unsuccessful
        if (!body.success || body.success === false) {
            return res.status(401).json({
                "success": false,
                "msg": "Google Verification failed."
            })
        }

        // If successful
        res.json({
            "success": true,
            "msg": "Verification successful."
        })
    })

})

const port = process.env.PORT

app.listen(port, () => {
    console.log(`Server started on port ${port}.`);
})
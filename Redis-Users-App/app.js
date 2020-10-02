
const express = require('express')
const exphbs = require('express-handlebars')
const path = require('path')
const methodOverride = require('method-override')
const redis = require('redis')

// Create Redis Client
let redisClient = redis.createClient()

redisClient.on('connect', () => {
    console.log('Connected to Redis.');
})

const app = express()

// Static Folder
app.use(express.static('public'))

// View Engine
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}))
app.set('view engine', 'handlebars')

// URL Encoded Body Parse
app.use(express.json())
app.use(express.urlencoded({extended: false}))

// Method Override
app.use(methodOverride('_method'))

// Search Page
app.get('/', (req, res) => {
    res.render('searchusers')
})

// Search Processing
app.post('/users/search', (req, res) => {

    const id = req.body.id

    redisClient.hgetall(id, (err, user) => {

        if (err || !user) {
            return res.render('searchusers', {
                error: 'User does not exist!'
            })
        }

        user.id = id
        return res.render('details', {
            user
        })
    })

})

// Add User Page
app.get('/user/add', (req, res) => {
    res.render('adduser')
})

// Add User Processing
app.post('/user/add', (req, res) => {

    const { id, first_name, last_name, email, phone } = req.body

    redisClient.hmset(id, [
        'first_name', first_name,
        'last_name', last_name,
        'email', email,
        'phone', phone
    ], (err, reply) => {
        if (err) {
            console.log(err);
        }
        console.log(reply);
        res.redirect('/')
    })

})

// Delete User Page
app.delete('/user/delete/:id', (req, res) => {
    const id = req.params.id

    redisClient.del(id)
    res.redirect('/')

})

const port = 3001

app.listen(port, () => {
    console.log(`App running on port ${port}`);
})

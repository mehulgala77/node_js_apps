
const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const mongoose = require('mongoose')
const flash = require('connect-flash')
const session = require('express-session')
const passport = require('passport')

const app = express()

// Passport Config
const localPassportConfig = require('./config/passport')
localPassportConfig(passport)

// DB URL
const db = require('./config/keys').mongoURI

// Connect to DB
mongoose.connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connected to DB successfully'))
.catch((err) => console.error(err))

// Static Folder
app.use(express.static('./public'))

// EJS
app.use(expressLayouts)
app.set('view engine', 'ejs')

// Note: Body Parser is now part of Express
app.use(express.urlencoded({extended: true}))

// Express Session
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}))

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Flash
app.use(flash())

// Global Variables
app.use((req, res, next) => {

    res.locals.success_msg = req.flash('success_msg')
    res.locals.error_msg = req.flash('error_msg')
    res.locals.error = req.flash('error')

    next()
})

// Routers
app.use('/', require('./routes/index'))
app.use('/users', require('./routes/user'))

const port = process.env.PORT | 3001

app.listen(port, () => {
    console.log(`App running on port: ${port}`);
})
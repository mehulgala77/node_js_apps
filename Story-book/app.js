
const path = require('path')
const express = require('express')
const dotenv = require('dotenv')
const morgan = require('morgan')
const exphbs = require('express-handlebars')
const methodOverride = require('method-override')
const passport = require('passport')
const session = require('express-session')
const mongoose = require('mongoose')

// Note: Sessions are stored in memory of the web server, 
// As soon as you restart the web server, all the sessions are gone.
// To achieve this task we need this package.
const MongoStore = require('connect-mongo')(session)

const connectMongoDB = require('./db/mongoose')

// Note: It is easier way to set up enviornment variables
dotenv.config({path: './config/config.env'})

// Passport Config
require('./auth/passport')(passport)

// Connect to DB
connectMongoDB()

// Express app
const app = express()

// Parse body
app.use(express.urlencoded({extended: false}))
app.use(express.json())

// Static Assets Folder
app.use(express.static(path.join(__dirname, 'public')))

// Note: It is needed for logging purpose.
// When a request comes, it will be logged on the console.
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

// Note: Sessions
app.use(session({
    // Note: To encrypt session data
    secret: 'mySecret',
    // Note: Don't want to save the session if nothing is modified
    resave: false,
    // Note: Don't create session until something is stored
    saveUninitialized: false,
    // Note: Set the Mongo Store here.
    // Pass the mongoose connection.
    store: new MongoStore({
        mongooseConnection: mongoose.connection
    })
}))
 
// Note: Passport Middleware
app.use(passport.initialize())
app.use(passport.session())

// Note: Global Variables
app.use((req, res, next) => {
    res.locals.user = req.user
    next()
})

// Method Override
// Note: This middleware will override the method to PUT and DELETE when submitting a form.
app.use(methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
      // look in urlencoded POST bodies and delete it
      let method = req.body._method
      delete req.body._method
      return method
    }  
}))

// Routes
app.use('/', require('./routes/index'))
app.use('/auth', require('./routes/auth'))
app.use('/stories', require('./routes/stories'))

// Handlebars Helpers
const { 
    formatDate, 
    truncate, 
    stripTags,
    editIcon,
    select
} = require('./helpers/hbs')

// Note: Express Handlebar change extension and default layout
app.engine('.hbs', exphbs({
    // Note: How to set up HBS helpers
    helpers: {
        formatDate,
        truncate,
        stripTags,
        editIcon,
        select
    },
    extname: '.hbs',
    defaultLayout: 'main'
}))
app.set('view engine', '.hbs')

// Keep server in listening mode
const port = process.env.PORT | 3001
app.listen(port, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${process.env.PORT}`)
})
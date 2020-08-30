
const express = require('express')
const connectDB = require('./config/db')

const homeRouter = require('./routes/index')
const apiRouter = require('./routes/url')

const app = express()

// Connect to DB
connectDB();

// Middleware to process all requests and response data as JSON
app.use(express.json( {
    extended: false
}))

// Add Routers
app.use('/', homeRouter)
app.use('/api/url', apiRouter)

// App Listener
app.listen(3001, () => {
    console.log("Server started on port 3001");
})

// Env Variable File Path
const path = require('path')
const devEnvPath = path.join(__dirname, '..', 'config', 'dev.env')

// Load Env Variables
const dotenv = require('dotenv')
dotenv.config({
    path: devEnvPath
})

// Connect to Mongo DB
const connectMongoDB = require('../db/mongoose')
connectMongoDB()

// Create an Express App
const express = require('express')
const app = express()

// JSON Body Parser Middleware
app.use(express.json())

// Routes
app.use('/userviews', require('../routes/userView'))

// Start Express HTTP Server
const port = process.env.PORT
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
})
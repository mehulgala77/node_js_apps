
const mongoose = require('mongoose')

// Create a URL Schema
const urlSchema = new mongoose.Schema({
    urlCode: String,
    longUrl: String,
    shortUrl: String,
    date: { type: String, default: Date.now }
})

// Create a URL Model
const Url = new mongoose.model('Url', urlSchema)

module.exports = Url
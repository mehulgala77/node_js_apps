
const express = require('express')
const router = express.Router()

const validURL = require('valid-url')
const shortId = require('shortid')
const config = require('config')

const Url = require('../models/url')

// @route   POST /api/url/shorten
// @desc    Shortens a URL
router.post('/shorten', async (req, res) => {

    const { longUrl } = req.body

    // Validate Input URL
    if (!validURL.isUri(longUrl)) {
        return res.status(400).json("Input URL is invalid")
    }

    try {
        // Check if this URL already exists
        let urlDocument = await Url.findOne({ longUrl })
        if (urlDocument) {
            return res.send(urlDocument)
        }

        const baseURL = config.get('baseURL')

        // Validate Base URL
        if (!validURL.isUri(baseURL)) {
            return res.status(400).send("Base URL is invalid")
        }

        // Generate a Short Id
        const urlCode = shortId.generate().toLowerCase()

        // Construct a Short URL
        const shortUrl = `${baseURL}/${urlCode}`

        // Create a new Mongo Document
        urlDocument = new Url({
            urlCode,
            longUrl,
            shortUrl,
            date: new Date()        
        })

        // Save it to the database
        await urlDocument.save()

        // Send it back to the user
        res.send(urlDocument)

    } catch (err) {
        console.error(err);
        res.status(500).json('Server Error')
    }
})

module.exports = router
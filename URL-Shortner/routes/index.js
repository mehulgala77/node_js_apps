
const express = require('express')
const router = express.Router()

const validURL = require('valid-url')

const Url = require('../models/url')

// @Route   GET /:code
// @Desc    Redirect to Long / Original URL
router.get('/:code', async (req, res) => {
    
    // Fetch the code from the URL
    const urlCode = req.params.code.toLowerCase()

    try {

        // Check if there is any document against that code
        const urlDocument = await Url.findOne({ urlCode })
        if (!urlDocument) {
            return res.status(404).json('Short URL does not exist')
        }

        // Redirect to the long URL
        res.redirect(urlDocument.longUrl)

    } catch (err) {
        console.error(err);
        res.status(500).json('Server Error')
    }

})

module.exports = router
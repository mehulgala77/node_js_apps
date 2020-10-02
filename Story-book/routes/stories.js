
const express = require('express')
const { ensureAuth } = require('../middleware/auth')

const Story = require('../models/Story')

const router = express.Router()

// @desc    Add Story page
// @route   GET /stories/add
router.get('/add', ensureAuth, (req, res) => {
    res.render('stories/add')
})

// @desc    Process add stories
// @route   POST /stories
router.post('/', ensureAuth, async (req, res) => {
    
    try {
        
        req.body.user = req.user.id
        // Note: Another way to create a new document
        await Story.create(req.body)
        res.redirect('/dashboard')

    } catch (err) {
        console.error(err);
        res.render('errors/500')
    }

})

// @desc    Fetch all public stories
// @route   GET /stories
router.get('/', ensureAuth, async (req, res) => {
    
    try {
        
        // Note: To fetch all public stories and populate user field in it.
        const stories = await 
            Story.find({ status: 'public' })
                .populate('user')
                .sort({createdAt: 'desc'})
                .lean()
        
        res.render('stories/index', {
            stories
        })

    } catch (err) {
        console.error(err);
        res.render('errors/500')
    }

})

// @desc   Single Story page
// @route   GET /stories/:id
router.get('/:id', ensureAuth, async (req, res) => {

    try {
        
        const story = await 
            Story.findById(req.params.id)
                .populate('user')
                .lean()
        if (!story) {
            return res.render('errors/404')
        }

        if (story.user._id != req.user.id) {
            return res.redirect('/dashboard')
        }

        res.render('stories/show', {
            story
        })

    } catch (err) {
        console.error(err);
        res.render('errors/500')
    }
})

// @desc    Edit Story page
// @route   GET /stories/edit/:id
router.get('/edit/:id', ensureAuth, async (req, res) => {
    
    try {
        
        const story = await 
            Story.findById(req.params.id)
                .lean()

        if (!story) {
            return res.render('errors/404')
        }

        if (story.user != req.user.id) {
            return res.redirect('/stories')
        }

        res.render('stories/edit', {
            story
        })

    } catch (err) {
        console.error(err);
        res.render('errors/500')
    }

})

// @desc    Edit Story page
// @route   PUT /stories/:id
router.put('/:id', ensureAuth, async (req, res) => {

    try {
    
        let story = await Story.findById(req.params.id)
        if (!story) {
            return res.render('errors/404')
        }

        if (story.user != req.user.id) {
            return res.redirect(`/edit/${req.params.id}`)
        }

        // Note: This function is used to update the existing Mongo Document.
        story = await Story.findByIdAndUpdate(req.params.id, req.body, {
            // Note: This will create the story if it does not exist.
            new: true,
            // Note: This will run the validators
            runValidators: true
        })

        res.redirect('/dashboard')

    } catch (err) {
        console.error(err);
        res.render('errors/500')
    }

})

// @desc    Delete Story page
// @route   DELETE /stories/:id
router.delete('/:id', ensureAuth, async (req, res) => {
    
    try {
    
        const story = await Story.findById(req.params.id)
        if (!story) {
            return res.render('errors/404')
        }

        if (story.user != req.user.id) {
            return res.redirect('/dashboard')
        }

        await story.remove()
        res.redirect('/dashboard')

    } catch (err) {
        console.error(err);
        res.render('errors/500')
    }

})

// @desc    User Stories
// @route   GET /stories/user/:userId
router.get('/user/:userId', ensureAuth, async (req, res) => {
    
    try {

        const stories = await Story.find({
            user: req.params.userId,
            status: 'public'
        })
        .populate('user')
        .lean()

        res.render('stories/index', {
            stories
        })

    } catch (err) {
        console.error(err);
        res.render('errors/500')
    }

})

module.exports = router
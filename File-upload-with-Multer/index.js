
const express = require('express')
const ejs = require('ejs')
const multer = require('multer')
const path = require('path')

const app = express()

// Set Storage Engine
const storage = multer.diskStorage({
    destination: './public/uploads',
    filename: (req, file, cb) => {

        const fieldName = file.fieldname
        const timestamp = Date.now()
        const fileExt = path.extname(file.originalname)

        const fileName = `${fieldName}-${timestamp}${fileExt}`

        cb(null, fileName)
    }
})

// Set Upload Variable
const upload = multer({
    storage,
    limits: {
        fileSize: 1000000
    },
    fileFilter: (req, file, cb) => {
        checkFile(file, cb)
    }
}).single('myImage')

// File Filter Function
const checkFile = (file, cb) => {
    
    const fileTypes = /jpeg|jpg|png|gif/
    const fileExt = path.extname(file.originalname).toLowerCase()

    const isValidExt = fileTypes.test(fileExt)
    const isValidMime = fileTypes.test(file.mimetype)

    if (isValidExt && isValidMime) {
        cb(null, true)
    } else {
        cb('Error: Image Only')
    }
}

// EJS View Engine Setup
app.set('view engine', 'ejs')

// Public Folder
app.use(express.static('./public'))

app.get('/', (req, res) => {
    res.render('index')
})

app.post('/upload', (req, res) => {

    upload(req, res, (err) => {

        if (err) {
            return res.render('index', {
                msg: err
            })
        } 

        if (!req.file) {
            return res.render('index', {
                msg: 'Error: No file selected !!!'
            })
        }

        res.render('index', {
            msg: 'Success: File uploaded !!!',
            file: `uploads/${req.file.filename}`
        })

    })

})

app.listen(3001, () => {
    console.log('App started on port 3001');
})
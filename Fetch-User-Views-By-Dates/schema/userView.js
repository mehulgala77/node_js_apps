
const mongoose = require('mongoose')

const userViewSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    viewDate: {
        type: Date,
        required: true
    }, 
    productId: {
        type: String,
        required: true
    }
})

const UserView = mongoose.model('userView', userViewSchema)

module.exports = UserView
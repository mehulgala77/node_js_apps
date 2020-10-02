
const moment = require('moment')

// To format the MongoDB ISO date to custom format.
const formatDate = (date, format) => {
    return moment(date).format(format)
}

const truncate = (str, len) => {
    if (str.length > len && str.length > 0) {
        let new_str = str + ' '
        new_str = str.substr(0, len)
        new_str = str.substr(0, new_str.lastIndexOf(' '))
        new_str = new_str.length > 0 ? new_str : str.substr(0, len)
        return new_str + '...'
    }
    return str
}

const stripTags = (input) => {
    return input.replace(/<(?:.|\n)*?>/gm, '')
}

const editIcon = (storyUser, loggedUser, storyId, floating = true) => {
    if (storyUser._id.toString() == loggedUser._id.toString()) {
        if (floating) {
            return `<a href="/stories/edit/${storyId}" class="btn-floating halfway-fab blue"><i class="fas fa-edit fa-small"></i></a>`
        } else {
            return `<a href="/stories/edit/${storyId}"><i class="fas fa-edit"></i></a>`
        }
    } else {
        return ''
    }
}

// Note: I don't know this code. It is coiped from stack overflow.
// Note: All I know is, it can select the right option in the "select" field.
const select = (selected, options) => {
    return options
        .fn(this)
        .replace(
            new RegExp(' value="' + selected + '"'),
            '$& selected="selected"'
        )
        .replace(
            new RegExp('>' + selected + '</option>'),
            ' selected="selected"$&'
        )
}

module.exports = { 
    formatDate,
    truncate,
    stripTags,
    editIcon,
    select
}

const express = require('express')
const UserView = require('../schema/userView')
const router = express.Router()

// @route POST /userviews
// @desc Creates a new product
router.post('/', async (req, res) => {

    try {
        
        // If the body is empty, then throw error.
        if (! req.body ) {
            return res.status(400).json({
                errMsg: 'No product data in the request'
            })
        }

        // Create a new User View (with product id, user id and view date)
        const userview = new UserView(req.body)
        await userview.save()
        
        res.send(userview)

    } catch (err) {
        console.error(err);
        res.status(500).json({
            errMsg: 'Could not create the new User View'
        })
    }
})

// @route GET /userviews
// @desc Fetches the list of users based on the queries
// @params
//      searchDate (daily, weekly, monthly, <custom-date>)
//      unique (true, false)
//      productId (String)
router.get('/', async (req, res) => {

    // If query param is empty, throw error.
    if (!req.query) {
        return res.status(400).json({
            errMsg: 'No search date Specified'
        })
    }

    // Extract Query Param values
    const {searchDate, productId, unique} = req.query

    // Search Date and Product Id are mandatory.
    if (!searchDate || !productId) {
        return res.status(400).json({
            errMsg: 'Search date or product id not specified'
        })
    }

    // If the unique query param is present, 
    // search for unique users.
    let uniqueUsers = false
    if (unique === 'true') {
        uniqueUsers = true
    }

    let searchStartDate = undefined
    // Fetch the current date.
    let today = new Date().toISOString().slice(0, 10)
    
    // The search date term can have 4 values,
    // 'daily': fetch users who viewed the product today.
    // 'weekly': fetch users who viewed the product in the last week
    // 'monthly': fetch users who viewed the product in the last month
    // 'custom date' fetch users who viewed the product from the custom date to today.
    switch(searchDate) {
        case 'daily':             
            searchStartDate = today
            break

        case 'weekly': 
            const lastWeek = new Date(today)
            lastWeek.setDate(lastWeek.getDate() - 7)
            searchStartDate = lastWeek.toISOString().slice(0, 10)
            break

        case 'monthly': 
            const lastMonth = new Date(today)
            lastMonth.setDate(lastMonth.getDate() - 28)
            searchStartDate = lastMonth.toISOString().slice(0, 10)
            break

        default:
            searchStartDate = searchDate
            break
    }

    try {
       
        let msg = ''
        
        // If the unique users are required, 
        if (!uniqueUsers) {

            const users = await UserView
                .where('viewDate').gte(searchStartDate)
                .where('productId').equals(productId)
                .select({ userId: 1 })            
                .countDocuments()
                .exec()
    
            msg = `User count: ${users}`

        }
        // If the unique users are not required, 
        else {

            const users = await UserView
                .where('viewDate').gte(searchStartDate)
                .where('productId').equals(productId)
                .select({ userId: 1 })            
                .distinct('userId')
                .exec()
    
            msg = `User count: ${users.length}`
        }

        // Return the count to the caller
        res.send(msg)

    } catch (err) {
        console.error(err);
        res.status(500).json({
            errMsg: 'Could not find the products'
        })
    }

})

module.exports = router
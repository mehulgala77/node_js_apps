
const dotenv = require('dotenv')
dotenv.config({path: './config/dev.env'})

const express = require('express')
const stripe = require('stripe')(process.env.STRIPE_SECRET)
const exphbs = require('express-handlebars')

const app = express()

// Handlebars Middleware
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}))
app.set('view engine', 'handlebars')

// Body Parsing
app.use(express.json())
app.use(express.urlencoded({extended: false}))

// Static Folder
app.use(express.static('public'))

// Index Route
app.get('/', (req, res) => {
    res.render('index', {
        stripePublishableKey: process.env.STRIPE_PUBLISHABLE_KEY
    })
})

// Charge the Customer
app.post('/charge', async (req, res) => {

    // Note: This is what gets returned from the Stripe Form.
    // {
    //     stripeToken: 'tok_1HZ8dfAm53VvSC8Kvr8ta7hx',
    //     stripeTokenType: 'card',
    //     stripeEmail: 'mehul@gmail.com'
    // }
    // console.log(req.body);

    const amount = 1000

    try {

        const customer = await stripe.customers.create({
            email: req.body.stripeEmail,
            source: req.body.stripeToken
        })

        const charge = await stripe.charges.create({
            amount,
            description: 'Python Crash Course E-book',
            currency: 'usd',
            customer: customer.id
        })

        res.render('success')
        
    } catch (err) {
        console.error(err);
        res.send('Oops, Something went wrong !!')
    }

})

const port = process.env.PORT || 3000

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
})
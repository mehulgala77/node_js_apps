
const cors = require('cors')
const express = require('express')

const path = require('path')
const dotenv = require('dotenv')

// Load Env File
const envPath = path.join(__dirname, 'config/dev.env')
dotenv.config({ path: envPath })

// Config Stripe
const stripe = require('stripe')(process.env.STRIPE_SECRET)

// Note: Load UUID version 4
const uuid = require('uuid').v4

// App
const app = express()

// Middleware
app.use(express.json())
app.use(cors())

// Routes
app.get('/', (req, res) => {
    res.send('hi')
})

app.post('/payment', async (req, res) => {

    const { product, token } = req.body

    // Note: This will ensure that user is not charged twice for same product.
    const idempotencyKey = uuid()

    try {
        
        const customer = await stripe.customers.create({
            email: token.email,
            source: token.id
        })

        const charge = await stripe.charges.create({
            // Note: We need to multiply it by 100 because it takes price in cents
            amount: product.price * 100,
            currency: 'usd',
            customer: customer.id,
            receipt_email: token.email,
            description: `Purchase of ${product.name}`
        }, {
            idempotencyKey
        })

        res.json(charge)

    } catch (err) {
        console.error(err);
    }

})

// Listen
const port = 8282

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
})
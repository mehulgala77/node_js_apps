
const express = require('express')
const fetch = require('node-fetch')
const redis = require('redis')

const PORT = process.env.PORT | 3001
const REDIS_PORT = 6379

const redisClient = redis.createClient(REDIS_PORT)

const app = express()

// Two benefits
// 1. Speeds up the execution time
// 2. Limits the number of APIs fired on the server 

const cachingMiddleware = (req, res, next) => {

    const { userName } = req.params

    redisClient.get(userName, (err, value) => {
        if (err) throw err

        if (value) {
            res.send(generateResponse(userName, value))
        } else {
            next()
        }
    })

}

const generateResponse = (userName, repos) => {
    return `<h2>User ${userName} has ${repos} public repos on Github.</h2>`
}

app.get('/repos/:userName', cachingMiddleware, async (req, res) => {

    const { userName } = req.params

    try {
        
        const url = `https://api.github.com/users/${userName}`
        const response = await fetch(url)
        const data = await response.json()

        const repos = data.public_repos

        redisClient.setex(userName.toLowerCase(), 3600, repos)
        console.log('fetching data from server');

        res.send(generateResponse(userName, repos))

    } catch (error) {
        console.error(error);
        res.sendStatus(500)
    }

})

app.listen(PORT, () => {
    console.log(`Server started listening on port ${PORT}`);
})
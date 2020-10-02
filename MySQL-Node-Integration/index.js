
const express = require('express')
const db = require('./db/mysql_db_connection')

const app = express()

app.get('/createdb', (req, res) => {

    const sql = 'CREATE DATABASE nodeJSIntegration;'

    db.query(sql, (err, result) => {

        if (err) {
            console.log(err);   
            return res.sendStatus(500);  
        } 

        console.log('Database created successfully');

        res.send('DB created successfully')
    })
    
})

app.get('/createtable', (req, res) => {

    const sql = `
        CREATE TABLE posts (
            id INT AUTO_INCREMENT,
            title VARCHAR(255),
            body VARCHAR(1000),
            PRIMARY KEY (id)
        );
    `

    db.query(sql, (err) => {

        if (err) {
            console.log(err);
            return res.sendStatus(500);  
        }

        res.send('Table created successfully.')
    })
})

app.get('/insertrow1', (req, res) => {

    const post = {
        title: 'post 1',
        body: 'content of post 1'
    }

    const sql = `INSERT INTO posts SET ?`

    db.query(sql, post, (err, result) => {

        if (err) {
            console.log(err);
            return res.sendStatus(500);  
        }

        res.send('Row 1 created successfully.')
    })

})

app.get('/insertrow2', (req, res) => {

    const post = {
        title: 'post 2',
        body: 'content of post 2'
    }

    const sql = `INSERT INTO posts SET ?`

    db.query(sql, post, (err, result) => {

        if (err) {
            console.log(err);
            return res.sendStatus(500);  
        }

        res.send('Row 2 created successfully.')
    })

})

app.get('/getrows', (req, res) => {

    const sql = `SELECT * FROM posts`

    db.query(sql, (err, results) => {

        if (err) {
            console.log(err);
            return res.sendStatus(500);  
        }

        console.log(results);
        res.send('Rows fetched successfully.')
    })

})

app.get('/getrows/:id', (req, res) => {

    const sql = `SELECT * FROM posts WHERE id = ${req.params.id}`

    db.query(sql, (err, result) => {

        if (err) {
            console.log(err);
            return res.sendStatus(500);  
        }

        console.log(result);
        res.send('Row fetched successfully.')
    })

})

app.get('/updaterow/:id', (req, res) => {

    const newTitle = 'New Post 1'

    const sql = `
        UPDATE posts
        SET title = '${newTitle}'
        WHERE id = ${req.params.id};
    `

    db.query(sql, (err, result) => {

        if (err) {
            console.log(err);
            return res.sendStatus(500);  
        }

        console.log(result);
        res.send('Row updated successfully.')
    })

})

app.get('/deleterow/:id', (req, res) => {

    const sql = `
        DELETE FROM posts
        where id = ${req.params.id}
    `

    db.query(sql, (err, result) => {

        if (err) {
            console.log(err);
            return res.sendStatus(500);  
        }

        console.log(result);
        res.send('Row deleted successfully.')

    })

})

const port = process.env.PORT | 3001

app.listen(port, () => {
    console.log(`App running on port ${port}`);
})
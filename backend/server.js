//Importerar
import {config} from 'dotenv'
import pkg from 'pg'
const {Client} = pkg;

import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser';

const app = express()
//Dotenv
config()

//Middlewares
app.use(bodyParser.json())
app.use(
    bodyParser.urlencoded({
        extended: true
    })
)

app.use(cors())
app.use(express.json())
app.use((request, response, next) => {
    response.header('Access-Control-Allow-Origin', '*')
    response.header('Access-Control-Allow-Headers', 'Content-Type')
    next()
})

//Implemterar Databasen

const client = new Client({
    database: process.env.DATABASE,
    host: process.env.HOST,
    password: process.env.PASWORD,
    port: process.env.PORT,
    user: process.env.USER
})

client.connect(function (err){
    if (err) throw err
    console.log('Database Connected')
})

//Rutterna
app.get('/', (req, res) => {
    res.json('Hejsan')
})

app.get('/persons', async (req, res) => {
    try{
        const result = await client.query('SELECT * FROM persons')
        res.json(result.rows)
    } catch(err){
        console.log(err)
        res.status(500)
    }
})

//Persons Post
app.post('/persons/submit-form', async (req, res) => {
    const {FirstName, LastName, Address, City} = req.body
    try {
        await client.query(
            'INSERT INTO persons (FirstName, LastName, Address, City) VALUES ($1, $2, $3, $4)',
            [FirstName, LastName, Address, City]
        );
        res.sendStatus(201)
    } catch (err) {
        console.log(err);
        res.sendStatus(500)
    }
})


app.listen(8800, () => {
    console.log('Server is running')
})

const express = require('express')
const app = express()
const cors = require('cors')
const { MongoClient, ObjectId } = require('mongodb')
require('dotenv').config()
const PORT = 2121

let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'sample_mflix',
    collection

MongoClient.connect(dbConnectionStr)
    .then(client => {
        console.log('connected to db')
        db = client.db(dbName)
        collection = db.collection('movies')
    })

app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(cors())

app.get('/search', async (request, response)=> {
    try {
        let result = await collection.aggregate([
            {
                "$search" : {
                    "autocomplete": {
                        "query": `${request.query.query}`,
                        "path": "title",
                        "fuzzy": {
                            "maxEdits": 2,
                            "prefixLength": 3
                        }
                    }
                }
            }
        ]).toArray()
        response.send(result)
    } 
    catch(error){
        response.status(500).send({message: error.message})
    }
})

app.get('/get/:id', async (request, response) => {
    try {
        let result = await collection.findOne({
            "_id" : ObjectId(request.params.id)
        })
        response.send(result)
    }
    catch(error){
        response.status(500).send({message: error.message})
    }
})

app.listen(process.env.PORT || PORT, ()=> {
    console.log(`server is running on PORT ${process.env.PORT || PORT}`)
})
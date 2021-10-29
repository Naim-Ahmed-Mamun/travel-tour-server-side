const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const { MongoClient } = require('mongodb');
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

// DATABASE
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.h3xh8.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run(){
    try{
        await client.connect()
        const database = client.db('Travels')
        const destinationCollection = database.collection('Destinations');

        // GET API
        app.get('/destinations',async(req,res) => {
            const cursor = destinationCollection.find({})
            const result = await cursor.toArray();
            // console.log(result);
            res.send(result)
        })

        // POST API
        app.post('/addDestination',async(req,res) => {
            const destination = req.body;
            const result = await destinationCollection.insertOne(destination);
            console.log('post hit',result);
            res.json(result)
        })
    }
    finally{
        // await client.close()
    }
}
run().catch(console.dir);

app.get('/',(req,res) => {
    res.send('Delivery server running')
})

app.listen(process.env.PORT || 5000,() => {
    console.log('server running',port);
})
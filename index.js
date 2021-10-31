const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

// DATABASE
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.h3xh8.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect()
        const database = client.db('Travels')
        const destinationCollection = database.collection('Destinations');
        const bookingCollection = database.collection('orderBooking')

        // GET API
        app.get('/destinations', async (req, res) => {
            const cursor = destinationCollection.find({});
            const result = await cursor.toArray();
            // console.log(result);
            res.send(result)
        })

        // GET SPECIFIC ONE ITEM
        app.get('/bookingOrder/:id', async(req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await destinationCollection.findOne(query);
            // console.log(result, id);
            res.json(result)
        })

        // POST API
        app.post('/addDestination', async (req, res) => {
            const destination = req.body;
            const result = await destinationCollection.insertOne(destination);
            console.log('post hit', result);
            res.json(result)
        });
         // GET ORDER BOOKING
         app.get('/userBooking/:email', async (req, res) => {
            const email = req.params.email;
            const query = {email:email}
            const cursor = bookingCollection.find(query)
            const result = await cursor.toArray();
            // console.log('post hitting add',result);
            res.json(result)
        })
        // GET MANGE ALL USERS
        app.get('/bookingAllUsers',async(req,res) => {
            const result = await bookingCollection.find({}).toArray();
            res.json(result)
        })
        // POST API
        app.post('/bookingOrder', async (req, res) => {
            const bookingOrder = req.body;
            const result = await bookingCollection.insertOne(bookingOrder);
            res.json(result)
        })
        // DELETE API
        app.delete('/deleteBooking/:id',async(req,res) => {
            const id = req.params.id;
            const query = {_id:ObjectId(id)}
            const result = bookingCollection.deleteOne(query)
            res.json(result)
        })
        // DELETE MANAGE USERS
        app.delete('/deleteManageUsers/:id',async(req,res) => {
            const id = req.params.id;
            const query = {_id:ObjectId(id)}
            const result = await bookingCollection.deleteOne(query)
            console.log(result);
            res.send(result)
        })
        // UPDATE STATUS
        app.put('/updateStatus/:id',async(req,res) => {
            const id = req.params.id;
            const filter = {_id:ObjectId(id)}
            const updateStatus = await bookingCollection.findOne(filter);
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                  status:updateStatus.status = 'Approved'
                }
              };
            const result = await bookingCollection.updateOne(filter,updateDoc,options)
            // console.log(result);
            res.send(result)
        })
       
    }
    finally {
        // await client.close()
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Delivery server running')
})

app.listen(process.env.PORT || 5000, () => {
    console.log('server running', port);
})
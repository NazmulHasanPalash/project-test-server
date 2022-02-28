const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());
const uri = "mongodb+srv://Nazmul_Hasan_Palash:JjM2NX9ly2JCozUa@cluster0.pfvsy.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db('FormData');
        const dataCollection = database.collection('data');




        // GET API
        app.get('/data', async (req, res) => {
            const cursor = dataCollection.find({});
            const data = await cursor.toArray();
            res.send(data);
        });



        // GET Single data
        app.get('/data/:id', async (req, res) => {
            const id = req.params.id;
            console.log('getting specific data', id);
            const query = { _id: ObjectId(id) };
            const data = await dataCollection.findOne(query);
            res.json(data);
        })



        // POST API
        app.post('/data', async (req, res) => {
            const data = req.body;
            console.log('hit the post api', data);

            const result = await dataCollection.insertOne(data);
            console.log(result);
            res.json(result)
        });


        //UPDATE API Manage  Orders
        app.put('/data/:id', async (req, res) => {
            const id = req.params.id;
            const updatedUser = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    pending: updatedUser.pending,
                },
            };
            const result = await dataCollection.updateOne(filter, updateDoc, options)
            console.log('updating', id)
            res.json(result)
        })
        app.post('/data', async (req, res) => {
            const newData = req.body;
            const result = await dataCollection.insertOne(newData);
            console.log('got new data', req.body);
            console.log('added data', result);
            res.json(result);
        });

        // DELETE API
        app.delete('/data/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await dataCollection.deleteOne(query);
            res.json(result);
        })

    }
    finally {
        await client.close;
    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Form');
});

app.listen(port, () => {
    console.log('Form port', port);
})
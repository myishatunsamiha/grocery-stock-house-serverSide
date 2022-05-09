const express = require('express');
const cors = require('cors');
// const jwt = require('jsonwebtoken');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');


const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hjsj3.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
    try {
        await client.connect();
        const inventoryCollection = client.db('groceryInventory').collection('inventories');

        console.log('database is connceted');

        app.get('/inventoryhome', async (req, res) => {
            const query = {};
            const cursor = inventoryCollection.find(query);
            const maxCount = 6;
            itemsToDisplay = await cursor.limit(maxCount).toArray();
            res.send(itemsToDisplay);
        })

    }
    finally {

    }
}

run().catch(console.dir);


// basic testing api
app.get('/', (req, res) => {
    res.send('grocery stock server is running');
})

app.listen(port, () => {
    console.log('grocery stock server is running on port-', port);
})

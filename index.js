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

        // home page: get api to display maximum 6 items
        app.get('/inventoryhome', async (req, res) => {
            const query = {};
            const cursor = inventoryCollection.find(query);
            const maxCount = 6;
            const itemsToDisplay = await cursor.limit(maxCount).toArray();
            res.send(itemsToDisplay);
        })


        // manage inventories page: get api to display all items
        app.get('/allinventory', async (req, res) => {
            const query = {};
            const cursor = inventoryCollection.find(query);
            const itemsToDisplay = await cursor.toArray();
            res.send(itemsToDisplay);
        })


        // one inventory item page: get api to display data of one particular item
        app.get('/inventory/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            console.log(id);
            const result = await inventoryCollection.findOne(query);
            res.send(result);
        })

        // my items page: get only items which i have added
        app.get('/myitems', async (req, res) => {
            const email = req.query.email;
            console.log(email);
            const query = { email };
            console.log(query);
            const cursor = inventoryCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);
        })


        // add item page: inserting a new item in the database
        app.post('/additem', async (req, res) => {
            const newItem = req.body;
            const result = await inventoryCollection.insertOne(newItem);
            res.send(result);
        })


        // update item quantity on specific inventory item page
        app.put('/inventory/:id', async (req, res) => {
            const id = req.params.id;
            const updatedItem = req.body;
            console.log(updatedItem);
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updatedDoc = {
                $set: {
                    email: updatedItem.email,
                    name: updatedItem.name,
                    img: updatedItem.img,
                    description: updatedItem.description,
                    price: updatedItem.price,
                    quantity: updatedItem.quantity,
                    supplierName: updatedItem.supplierName,
                    sold: updatedItem.sold,
                    category: updatedItem.category
                }
            };
            const result = await inventoryCollection.updateOne(filter, updatedDoc, options);
            res.send(result);
        })

        // delete specific item from server 
        app.delete('/inventory/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await inventoryCollection.deleteOne(query);
            res.send(result);
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

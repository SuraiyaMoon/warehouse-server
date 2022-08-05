require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');


//middleware
app.use(cors());
app.use(express.json());

//mongodb

const uri = `mongodb+srv://${process.env.SECRET_USER}:${process.env.SECRET_PASS}@cluster0.uz7ah.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    try {
        console.log('mongo')
        await client.connect();
        const bookCollection = client.db('bookWarehouse').collection('books');


        //all books api
        app.get('/inventory', async (req, res) => {
            const query = {};
            const cursor = bookCollection.find(query);
            const books = await cursor.toArray();
            res.send(books)
        })

        //get book by id
        app.get('/inventory/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: id };
            const result = await bookCollection.findOne(query);

            res.send(result);
        });
        //add item api
        app.post('/inventory', async (req, res) => {

            const newItem = req.body;
            const item = bookCollection.insertOne(newItem)
            res.send(item);
        });

        // app.get('/myItem')

        // update quantity api
        app.put('inventory/:id', async (req, res) => {
            const id = req.params.id;
            const updateItem = req.body;
            const filterItem = { _id: (id) };
            const option = { upsert: true };
            const updatedQuantity = {
                $set: {
                    quantity: updateItem.quantity,

                }

            };
            const result = await bookCollection.updateOne(filterItem, updatedQuantity, option)
            res.send(result)

        });
        ////delete inventory
        app.delete('/inventory/:id', async (req, res) => {
            const id = req.params.id;
            console.log({ id })
            const query = { _id: id }
            const result = await bookCollection.deleteOne(query);
            res.send(result);
        })


    } catch (err) {
        console.log(err);
    }
    finally {

    }
}
run().catch(console.dir)




app.get('/', (req, res) => {
    res.send('running')
})
app.listen(port, () => {
    console.log('listening')
})
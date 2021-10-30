const express = require('express')
const cors = require('cors')
require('dotenv').config()
const { MongoClient } = require('mongodb');
const ObjectId= require('mongodb').ObjectId

const app = express()
const port = process.env.PORT || 5000;

//middleware
app.use(cors())
app.use(express.json())

//connect with mongodb
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.3zhcn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


//create a function

async function run() {
    try
    {
      await client.connect();
      const database = client.db('TG_Tour_database')
      const feedbackCollection = database.collection('feedback')
      const packageCollection = database.collection('package')
      const placeOrderCollection = database.collection('placeOrder')


      //get api feedback data
      app.get('/feedback', async (req, res) => {
              
        const cursor = feedbackCollection.find({})
        const result = await cursor.toArray()
        console.log(result)
        res.send(result)
      })
      
      //get api package data
      app.get('/package', async (req, res) => {
        const cursor = packageCollection.find({})
        const result = await cursor.toArray()
        res.send(result)
        // console.log(result); 
      })

        //post api for placeOrder
        app.post('/placeOrder', async(req, res) => {
         const result = await placeOrderCollection.insertOne(req.body)
        res.send(result)
        
      })

      //post api for add package
      app.post('/addPackage', async (req, res) => {
        const result = await packageCollection.insertOne(req.body)
        res.send(result)
        // console.log(result);
      })

    //get for placeOrder
      app.get('/myOrder', async (req, res) => {
        const cursor = placeOrderCollection.find({})
        const result =await cursor.toArray();
        res.send(result)
      })

      //single order delete api
      app.delete('/myOrder/:id', async (req, res) => {
        const id = req.params.id
        const query = { _id: ObjectId(id) }
        const result = await placeOrderCollection.deleteOne(query)
        res.send(result)
      })

     //all orders api
      app.get('/allOrder', async (req, res) => {
        const cursor = placeOrderCollection.find({})
        const result = await cursor.toArray()
        res.send(result)
      });

    //approved status using api
      app.put('/approve/:id', async (req, res) => {
        const id = req.params.id

        res.send('update id')
        console.log(id);
      })

    }
    finally
    {
        // await client.close()
    }
}

run().catch(console.dir)


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`this is listening port`, port)
})
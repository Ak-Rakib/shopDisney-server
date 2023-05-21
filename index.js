const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());


// Database
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fvciqgr.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  const dollCollection = client.db("shopDisney").collection("dolls");
  const userDollCollection = client.db("shopDisney").collection("userCollection")
  const addDollCollection = client.db("shopDisney").collection("addCollection")
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // const dollCollection = client.db("shopDisney").collection("dolls");
    // const userDollCollection = client.db("shopDisney").collection("userCollection")


    // Get all Data
    app.get("/dolls", async (req, res) => {
      const getDollsData = await dollCollection.find().toArray();
      res.send(getDollsData);
    });



    // Get data using id
    app.get("/dolls/:id", async(req, res) => {
      const id = (req.params.id);
      console.log(id)
      const query = { _id: new ObjectId(id) }
      const result = await dollCollection.findOne(query);
      console.log(result)
      res.send(result);
    })


    // Filtering from database
    app.get("/dolls/:text", async (req, res) => {
      console.log(req.params.text);
      if (req.params.text == "fDoll" || req.params.text == "aDoll" || req.params.text == "dDoll") {
        const result = await dollCollection.find({
          text: req.params.text
        }).toArray();
        console.log(result);
        res.send(result);
      }
      const result = await dollCollection.find().toArray();
      res.send(result);
    });




    // User Doll Collection-------------------------------------
    app.get("/userCollection", async (req, res) => {
      const result = await userDollCollection.find().limit(20).toArray();
      res.send(result);
    });


    app.post("/userCollection", async (req, res) => {
      const body = req.body;
      const result = await userDollCollection.insertOne(body);
      console.log(result);
      res.send(result);

    })




    // Add Doll collection----------------------------------------
    app.get("/addCollection", async (req, res) => {
      const result = await addDollCollection.find().limit(20).toArray();
      res.send(result);
    });



    app.get("/addCollection/:email", async(req, res) => {
      const email = req.query.email;
      if(email){
        const result = await addDollCollection.find({
          email: req.query.email
        }).toArray()
        res.send(result);
      }
    });



    app.post("/addCollection", async (req, res) => {
      const body = req.body;
      const result = await addDollCollection.insertOne(body);
      console.log(result);
      res.send(result);

    })


    app.delete("/addCollection/:id", async(req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await addDollCollection.deleteOne(query);
      res.send(result)
    });


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



// Check it out the server site actually running or not
app.get("/", async (req, res) => {
  res.send('shopDisney site is running');
});


// sending port
app.listen(port, () => {
  console.log(`On port ${port}`);
});

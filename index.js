require("dotenv").config();

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const express = require("express");
const cors = require("cors");
const port = process.env.PORT || 5000;

const app = express();
app.use(cors());
app.use(express.json());

// Connecting to the database

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.k8wvow9.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();
    const coffeesCollection = client.db("coffeeHouseDB").collection("coffees");
    const usersCollection = client.db("coffeeHouseDB").collection("users");
    // post coffee data
    app.post("/coffee", async (req, res) => {
      const coffeDetails = req.body;
      const result = await coffeesCollection.insertOne(coffeDetails);
      res.send(result);
    });

    // get all coffees data from database
    app.get("/coffees", async (req, res) => {
      const cursor = coffeesCollection.find({});
      const coffees = await cursor.toArray();
      res.send(coffees);
    });

    // get single item
    app.get("/coffees/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const findOne = await coffeesCollection.findOne(query);
      res.send(findOne);
    });

    // delete single item
    app.delete("/coffees/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await coffeesCollection.deleteOne(query);
      console.log(id, result);
      res.send(result);
    });

    // update single item
    app.patch("/coffees/:id", async (req, res) => {
      const id = req.params.id;
      const updatedCoffee = req.body;
      const filter = { _id: new ObjectId(id) };
      const updatedDocument = {
        $set: {
          name: updatedCoffee.name,
          supllier: updatedCoffee.supllier,
          price: updatedCoffee.price,
          quantity: updatedCoffee.quantity,
          taste: updatedCoffee.taste,
          details: updatedCoffee.details,
          photo: updatedCoffee.photo,
        },
      };
      const result = await coffeesCollection.updateOne(filter, updatedDocument);
      res.send(result);
    });

    // user api
    // post user data to database
    app.post("/users", async (req, res) => {
      const userDetails = req.body;
      const result = await usersCollection.insertOne(userDetails);
      res.send(result);
      console.log(result);
    });
  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("hello bro!");
});

app.listen(port, () => {
  console.log(` Server running on port ${port}`);
});

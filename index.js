const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.4kezvwg.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);

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
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const brandCollection = client.db("productDB").collection('brands');
    const productCollection = client.db("productDB").collection('products');
    
    // brands related
    app.get("/brands", async(req, res) =>{
        const cursor = brandCollection.find();
        const result = await cursor.toArray();
        res.send(result);
    });

    app.post("/brands", async (req, res) => {
        const newProduct = req.body;
        console.log(newProduct);
        const result = await brandCollection.insertOne(newProduct);
        res.send(result);
      });
    // product add
    app.get("/products", async(req, res) =>{
        const cursor = productCollection.find();
        const result = await cursor.toArray();
        res.send(result);
    });

    // product post
    app.post("/products", async (req, res) => {
        const newProduct = req.body;
        console.log(newProduct);
        const result = await productCollection.insertOne(newProduct);
        res.send(result);
      });

    // show product of brands base
    app.get('/products/:brandName', async (req, res) => {
        const brandName = req.params.brandName;
        const query = { brand: brandName };
        const result = await productCollection.find(query).toArray();
        res.send(result);
    });

    // single product details
    app.get('/product/:_id', async (req, res) => {
        const productId = req.params._id;
        const query = { _id: new ObjectId(productId) };
        const result = await productCollection.findOne(query);
        res.send(result);
    });

    app.put('/product/:_id', async (req, res) => {
        const id = req.params._id;
        const filter = { _id: new ObjectId(id)  }
        const updatedProduct = req.body;
        const update = {
          $set: {
            name: updatedProduct.name, 
            brand: updatedProduct.brand, 
            type: updatedProduct.type, 
            price: updatedProduct.price, 
            description: updatedProduct.description, 
            image: updatedProduct.image, 
            rating: updatedProduct.rating
          }
        }
        const result = await productCollection.updateOne(filter,update)
        res.send(result)
      });
    

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("GadgetGrove server is running");
});

app.listen(port, () => {
  console.log(`GadgetGrove server is running on port: ${port}`);
});

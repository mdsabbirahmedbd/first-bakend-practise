const express = require('express');
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
require('dotenv').config()
const port = process.env.PORT || 5000;


app.use(cors())
app.use(express.json())




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.knd5cf7.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;



const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});


async function run() {
  try {

    await client.connect();

    const addcoffeeCallection = client.db('addCoffee').collection('coffes');
    const addUserCallection = client.db('addusers').collection('users')

   
  app.post('/users', async (req,res) => {
    const user = req.body;
    const result = await addUserCallection.insertOne(user);
    res.send(result)
  })

  app.patch('/user', async(req,res) => {
    const user = req.body;
    const filter ={email : user.email};
    const upDateUser = {
        $set:{
         creationAt:user.lastSingInTime
        }
    }
    const result = await addUserCallection.updateOne(filter,upDateUser)
    res.send(result)
  })


  app.get('/user', async(req,res) => {
    const cursor = addUserCallection.find();
    const result = await cursor.toArray();
    res.send(result)
  })

  app.delete('/user/:id', async (req,res) => {
    const id = req.params.id;
    const filter = {_id : new ObjectId(id)};
    const result = await addUserCallection.deleteOne(filter);
    res.send(result)
  })
   
    app.get('/allCoffee', async(req,res) => {
        const cursor = addcoffeeCallection.find();
        const result = await cursor.toArray();
        res.send(result)
    })

    app.post('/addcoffee', async (req,res) => {
        const updates = req.body
        const results = await addcoffeeCallection.insertOne(updates)
        console.log(results)
        res.send(results)
    })

    app.delete('/coffee/:id', async (req,res)=>{
        const id = req.params.id
        const qury = {_id : new ObjectId(id)};
        const result = await addcoffeeCallection.deleteOne(qury)
                res.send(result)
    })
   
    app.get('/updatecoffee/:id', async (req,res) => {
        const  id = req.params.id;
        const qury = {_id : new ObjectId(id)}
        const result = await addcoffeeCallection.findOne(qury)
        res.send(result)
    })

    app.put('/update/:id', async (req,res) => {
        const id = req.params.id;
        const filter = {_id : new ObjectId(id)}
        const options = { upsert: true };
        const currentUpdate = req.body;
          
        const updateCoffee = {
            $set:{
                name:currentUpdate.name,
                chef:currentUpdate.chef,
                supplier:currentUpdate.supplier,
                taste:currentUpdate.taste,
                category:currentUpdate.category,
                photo:currentUpdate.photo,
                details:currentUpdate.details
            }
        }

        const result = await addcoffeeCallection.updateOne(filter,updateCoffee,options)
        res.send(result)
    })



    
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {

  }
}
run().catch(console.dir);




app.get('/', (req,res)=>{
    res.send('Hallo i am sabbir ahmed and all right and reservall and this is my file')
})

app.listen(port,()=>{
    console.log(`PORT IS COMMING SOOO..........${port}`)
})
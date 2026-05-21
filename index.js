const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const uri = process.env.MONGODB_URI;
const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());

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

    const db = client.db("mediqueue");
    const tutorCollection = db.collection("tutors");
    const tutorBookingCollection = db.collection("tutorBookings");

    app.get("/tutors", async (req, res) => {
      const tutors = await tutorCollection.find().toArray();
      res.json(tutors);
    });

    app.get("/featured-tutors", async (req, res) => {
      const tutors = await tutorCollection.find().limit(6);
      const result = await tutors.toArray();
      res.send(result);
    });

    app.post("/tutor-bookings", async (req, res) => {
      const bookingData = req.body;
      const result = await tutorBookingCollection.insertOne(bookingData);
      res.send(result);
    });

    app.post("/tutors", async (req, res) => {
      const tutorData = req.body;
      console.log(tutorData);

      const result = await tutorCollection.insertOne(tutorData);

      res.json(result);
    });

    app.get("/tutors/:id", async (req, res) => {
      const { id } = req.params;
      const result = await tutorCollection.findOne({ _id: new ObjectId(id) });
      res.json(result);
    });

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!",
    );
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Server is running fine");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

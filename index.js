import express from "express";
import cors from "cors";
import { MongoClient } from "mongodb";
import * as dotenv from "dotenv";
dotenv.config();

const app = express();
const Port = 4000;

const MONGO_URL = process.env.MONGO_URL;
export const client = new MongoClient(MONGO_URL); // dial
// Top level await
await client.connect(); // call
console.log("Mongo is connected !!!  ");
app.use(cors());
app.use(express.json());
app.get("/", (req, res) => {
  res.send("welcome to E kart");
});
app.get("/products", async (req, res) => {
  try {
    const getdata = await client
      .db("b42wd2")
      .collection("Eproducts")
      .find({})
      .toArray();
    res.send(getdata);
  } catch (e) {
    res.send("internal server error");
  }
});
app.post("/add/data", async (req, res) => {
  const data = req.body;
  const addData = await client
    .db("b42wd2")
    .collection("Eproducts")
    .insertMany(data);
  res.send("inserted succcesfully");
});
app.listen(Port, () => console.log(`${Port} is running`));

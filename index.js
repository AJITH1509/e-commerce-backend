import express from "express";
import cors from "cors";
import { MongoClient } from "mongodb";
import { ObjectId } from "mongodb";
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

//get all products
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

//to add products to the website

// app.post("/add/data", async (req, res) => {
//   const data = req.body;
//   const addData = await client
//     .db("b42wd2")
//     .collection("Eproducts")
//     .insertMany(data);
//   res.send("inserted succcesfully");
// });

//temp login
app.post("/login", async (req, res) => {
  const { name, password } = req.body;
  const data = {
    name: name,
    password: password,
    cart: [],
  };
  const storeUser = client.db("b42wd2").collection("Eusers").insertOne(data);
  res.send("inserted succcesfully");
});

//to get cart items
app.get("/cart/:user", async (req, res) => {
  const { user } = req.params;
  const User = await client
    .db("b42wd2")
    .collection("Eusers")
    .findOne({ _id: new ObjectId(user) });
  res.status(200).send(User);
});

// add products to the cart
app.put("/addtocart/:id/:user", async (req, res) => {
  const { id, user } = req.params;
  try {
    const checkData = await client
      .db("b42wd2")
      .collection("Eproducts")
      .findOne({ _id: new ObjectId(id) });

    const checkUser = await client
      .db("b42wd2")
      .collection("Eusers")
      .findOne({ _id: new ObjectId(user) });
    const getCart = checkUser.cart;
    if (!getCart.some((item) => item._id.toString() === id)) {
      const addcart = {
        cart: [...getCart, checkData],
      };
      const addCart = await client
        .db("b42wd2")
        .collection("Eusers")
        .updateOne({ _id: new ObjectId(user) }, { $set: addcart });
      res.status(200).send({ message: "Added to Cart" });
    } else {
      res.status(200).send({ message: "Already added to cart" });
    }
  } catch (err) {
    console.log(err);
  }
});

//update quantity

app.put("/quantity/:id/:user", async (req, res) => {
  const newKey = "quantity";
  const { id, user } = req.params;
  const { number } = req.body;
  const checkData = await client
    .db("b42wd2")
    .collection("Eproducts")
    .findOne({ _id: new ObjectId(id) });
  const checkUser = await client
    .db("b42wd2")
    .collection("Eusers")
    .findOne({ _id: new ObjectId(user) });
  const getCart = checkUser.cart;
  const check = getCart.findIndex(
    (item) => item._id.toString() === checkData._id.toString()
  );
  checkData[newKey] = number;
  getCart[check] = checkData;
  console.log(getCart);
  const addcart = {
    cart: getCart,
  };
  const addCart = await client
    .db("b42wd2")
    .collection("Eusers")
    .updateOne({ _id: new ObjectId(user) }, { $set: addcart });
  res.status(200).send("Updated successfully");
});

//delete cart

app.delete("/delete/:id/:user", async (req, res) => {
  const { id, user } = req.params;
  const checkData = await client
    .db("b42wd2")
    .collection("Eproducts")
    .findOne({ _id: new ObjectId(id) });
  const checkUser = await client
    .db("b42wd2")
    .collection("Eusers")
    .findOne({ _id: new ObjectId(user) });
  const getCart = checkUser.cart;
  const deleteCart = getCart.filter((item) => item.name !== checkData.name);
  const updatedCart = {
    cart: deleteCart,
  };
  const addCart = await client
    .db("b42wd2")
    .collection("Eusers")
    .updateOne({ _id: new ObjectId(user) }, { $set: updatedCart });
  res.send(deleteCart);
});

//update quantity

app.listen(Port, () => console.log(`${Port} is running`));

import { ObjectId } from "mongodb";
import { client } from "../index.js";

export function searchProduct(key) {
  const sanitizedKey = escapeRegExp(key);
  return client
    .db("b42wd2")
    .collection("Eproducts")
    .find({ name: new RegExp(sanitizedKey, "i") })
    .toArray();
}

function escapeRegExp(string) {
  return string.replace(/[.*+\-?^${}()|[\]\\]/g, "\\$&");
}

export function updateCart(user, addcart) {
  return client
    .db("b42wd2")
    .collection("Eusers")
    .updateOne({ _id: new ObjectId(user) }, { $set: addcart });
}
export function getProductsWithId(id) {
  return client
    .db("b42wd2")
    .collection("Eproducts")
    .findOne({ _id: new ObjectId(id) });
}
export function getProducts() {
  return client.db("b42wd2").collection("Eproducts").find({}).toArray();
}
export function getUser(user) {
  return client
    .db("b42wd2")
    .collection("Eusers")
    .findOne({ _id: new ObjectId(user) });
}

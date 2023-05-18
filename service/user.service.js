import { client } from "../index.js";
import { ObjectId } from "mongodb";

export async function updatePassword(email, hashedPassword) {
  const updated = {
    password: hashedPassword,
  };
  return await client
    .db("b42wd2")
    .collection("Eusers")
    .updateOne({ email: email }, { $set: updated });
}
export async function getUserByName(email) {
  return await client
    .db("b42wd2")
    .collection("Eusers")
    .findOne({ email: email });
}
export async function getOtp(OTP) {
  return await client.db("b42wd2").collection("Eusers").findOne({ OTP: OTP });
}
export async function addUser(data) {
  return await client.db("b42wd2").collection("Eusers").insertOne(data);
}
export async function updateOtp(email, randomNumber) {
  const updated = {
    OTP: randomNumber,
  };
  return await client
    .db("b42wd2")
    .collection("Eusers")
    .updateOne({ email: email }, { $set: updated });
}
export async function deleteOtp(otp) {
  const data = {
    OTP: otp,
  };
  return await client
    .db("b42wd2")
    .collection("Eusers")
    .updateOne({ OTP: otp }, { $unset: data });
}
export async function updateName(id, Updated) {
  return await client
    .db("b42wd2")
    .collection("Eusers")
    .updateOne({ _id: new ObjectId(id) }, { $set: Updated });
}

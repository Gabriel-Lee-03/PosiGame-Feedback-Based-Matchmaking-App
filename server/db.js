const mongoose = require("mongoose");
const dotenv = require('dotenv');
const util = require('util');

dotenv.config();
const MONGO_API_KEY = process.env.MONGO_KEY;
const USER = process.env.USER;

const dbName = "players";

// DEVELOPMENT
// start mongod on seperate terminal
const uri = "mongodb://localhost:27017/players";

// DEPLOYMENT
// const uri = "mongodb+srv://"+USER+":"+MONGO_API_KEY+
//             "@cluster0.nyxdbux.mongodb.net/" + dbName +
//             "?retryWrites=true&w=majority";

// Set `strictQuery: false` to globally opt into filtering by properties that aren't in the schema
// Included because it removes preparatory warnings for Mongoose 7.
// See: https://mongoosejs.com/docs/migrating_to_6.html#strictquery-is-removed-and-replaced-by-strict
mongoose.set("strictQuery", false);

module.exports = async () => {
  try{
    await mongoose.connect(uri);
    console.log("Connected to database.");
  } catch (error) {
    console.log("Could not connect to database.", error);
  }
}
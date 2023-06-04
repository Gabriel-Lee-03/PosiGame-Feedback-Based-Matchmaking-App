const mongoose = require("mongoose");
const dotenv = require('dotenv');
const util = require('util');

dotenv.config();
const MONGO_API_KEY = process.env.MONGO_KEY;
const USER = process.env.USER;

const dbName = "players";
const uri = "mongodb+srv://"+USER+":"+MONGO_API_KEY+
            "@cluster0.nyxdbux.mongodb.net/" + dbName +
            "?retryWrites=true&w=majority";

// // Set `strictQuery: false` to globally opt into filtering by properties that aren't in the schema
// // Included because it removes preparatory warnings for Mongoose 7.
// // See: https://mongoosejs.com/docs/migrating_to_6.html#strictquery-is-removed-and-replaced-by-strict
// mongoose.set("strictQuery", false);
// // Define the database URL to connect to.
// // Wait for database to connect, logging an error if there is a problem

module.exports = async () => {
  try{
    await mongoose.connect(uri);
    console.log("Connected to database.");
  } catch (error) {
    console.log("Could not connect to database.", error);
  }
}

// const {MongoClient} = require('mongodb');

// module.exports = async () => {
//   const client = new MongoClient(uri);
//   try {
//     const database = client.db('sample_mflix');
//     const movies = database.collection('movies');
//     // Query for a movie that has the title 'Back to the Future'
//     const query = { title: 'Back to the Future' };
//     const movie = await movies.findOne(query);
//     console.log(movie);
//   } catch (error) {
//     console.log("Could not connect to database.", error);
//   }
// }

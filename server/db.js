const mongoose = require("mongoose");

const MONGO_API_KEY = process.env.MONGO_KEY;
const dbName = "players";

const uri = "mongodb+srv://drp22-admin:"+MONGO_API_KEY+
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
    console.log("func is called");
    await mongoose.connect(uri);
    console.log("Connected to database.");
  } catch (error) {
    console.log("Could not connect to database.", error);
  }
}


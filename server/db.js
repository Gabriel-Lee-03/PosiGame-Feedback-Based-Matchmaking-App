const mongoose = require("mongoose");

const MONGO_API_KEY = process.env.MONGO_KEY;
const dbName = "players";

// const uri = "mongodb+srv://drp22-admin:"+"Drp2213579"+
//             "@cluster0.nyxdbux.mongodb.net/" + dbName +
//             "?retryWrites=true&w=majority";

const uri = "mongodb://drp22-admin:"+"Drp2213579@"+
            "ac-7jak6sg-shard-00-00.nyxdbux.mongodb.net:27017,"+
            "ac-7jak6sg-shard-00-01.nyxdbux.mongodb.net:27017,"+
            "ac-7jak6sg-shard-00-02.nyxdbux.mongodb.net:27017/"+ dbName +
            "?retryWrites=true&w=majority";


// Import the mongoose module


// Set `strictQuery: false` to globally opt into filtering by properties that aren't in the schema
// Included because it removes preparatory warnings for Mongoose 7.
// See: https://mongoosejs.com/docs/migrating_to_6.html#strictquery-is-removed-and-replaced-by-strict
mongoose.set("strictQuery", false);

// Define the database URL to connect to.
const mongoDB = uri;

// Wait for database to connect, logging an error if there is a problem

main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(mongoDB);
}

module.exports = async () => {
  try{
    await mongoose.connect(mongoDB);
    console.log("Connected to database.");
  } catch (error) {
    console.log("Could not connect to database.", error);
  }
}


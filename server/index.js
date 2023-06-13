// server/index.js
const express = require("express");
const app = express();
const path = require('node:path');
const util = require('util');

const connectToMongoDB = require("./db");

const dotenv = require('dotenv');
dotenv.config();
const PORT = process.env.PORT || 3001;

//routes
const login = require("./routes/login");
const queue = require("./routes/queuing");


connectToMongoDB();

app.use(express.json());

// Have Node serve the files for our built React app
app.use(express.static(path.resolve(__dirname, '../client/build')));

//routes
app.use("/api/login", login);
app.use("/api/lobby", queue);

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

// All other GET requests not handled before will return our React app
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
});

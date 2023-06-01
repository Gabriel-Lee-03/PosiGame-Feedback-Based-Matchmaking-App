// server/index.js
const express = require("express");

const PORT = process.env.PORT || 3001;

const app = express();

const path = require('node:path');

const util = require('util');

const bodyParser = require('body-parser');

let storedName = [{name: `Amy Winehouse`, id: 0}, {name: `Bob Dylan`, id: 1}];
let id = 2;

// Have Node serve the files for our built React app
app.use(express.json());
app.use(bodyParser.urlencoded())
app.use(express.static(path.resolve(__dirname, '../client/build')));

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

// Handle GET requests to /api route
app.get("/api", (req, res) => {
  res.json( storedName );
});


// handle post request to /api route
app.post("/api", async (req, res) => {
  try {
    console.log(`post ok`);
    const name = req.body.name;
    console.log(`server req: ` + name);
    console.log(util.inspect(name));
    storedName = [...storedName, {name: name, id:id}];
    id +=1;
    res.send(storedName);
  } catch (error) {
    res.send(error);
  }
});



// All other GET requests not handled before will return our React app
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
});
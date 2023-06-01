// server/index.js
const express = require("express");

const PORT = process.env.PORT || 3001;

const app = express();

const path = require('node:path');

const storedName = [{name: `Amy Winehouse`, id: 0}, {name: `Bob Dylan`, id: 1}];

// Have Node serve the files for our built React app
app.use(express.json());

app.use(express.static(path.resolve(__dirname, '../client/build')));

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

// Handle GET requests to /api route
app.get("/api", (req, res) => {
  res.json( storedName );
});

// const requestData = req.body;
  
//   // Do something with the request data
//   console.log(requestData);

//   // Send a response back to the client
//   res.send('Request received successfully!');
// })

// handle post request to /api route
app.post("/api", async (req, res) => {
  try {
    console.log(`server req: ` + req.body);
    res.send([...storedName, {name: `James`, id:3}]);    
  } catch (error) {
    res.send(error);
  }
});

// All other GET requests not handled before will return our React app
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
});
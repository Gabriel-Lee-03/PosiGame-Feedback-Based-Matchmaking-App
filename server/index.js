// server/index.js

const express = require("express");

const PORT = process.env.PORT || 3001;

const app = express();

const path = require('node:path');

// Have Node serve the files for our built React app
app.use(express.static(path.resolve(__dirname, '../client/build')));

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

// Handle GET requests to /api route
app.get("/api", (req, res) => {
  const storedName = [{name: `Amy Winehouse`, id: 0}, {name: `Bob Dylan`, id: 1}];
  res.json( storedName );
});

// handle post request to /api route
router.post("/", async (req, res) => {
  try {
      const task = await new Task(req.body).save();
      res.send(task);
  } catch (error) {
      res.send(error);
  }
});

// All other GET requests not handled before will return our React app
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
});
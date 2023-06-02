// server/index.js
const express = require("express");
const PORT = process.env.PORT || 3001;
const app = express();
const path = require('node:path');
const util = require('util');
const bodyParser = require('body-parser');

let storedPlayers = [
  {gameId: `135`, name: `Amy Winehouse`, friendliness: 5, goodTeammate: true},
  {gameId: `246`, name: `Bob Dylan`, friendliness: 5, goodTeammate: true},
  {gameId: `131`, name: `Tom Jones`, friendliness: 6, goodTeammate: true},
  {gameId: `124`, name: `Mary Littlelamb`, friendliness: 3.5, goodTeammate: true}
];

// Have Node serve the files for our built React app
app.use(express.json());
app.use(bodyParser.urlencoded())
app.use(express.static(path.resolve(__dirname, '../client/build')));

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

// Handle GET requests to /api route
app.get("/api", (req, res) => {
  res.json( storedPlayers.sort(function(a, b){return b.friendliness - a.friendliness}));
});


// handle post request to /api route
app.post("/api", async (req, res) => {
  try {
    console.log(`post ok`);
    const player = req.body.player;
    console.log(util.inspect(player));
    storedPlayers = [...storedPlayers, player];
    res.send(storedName);
  } catch (error) {
    res.send(error);
  }
});

const SCORE_WEIGHT = 0.5;

app.put("/api/rate/id", async (req, res) => {
  try {
    const gameId = req.body.gameId;
    const weight = req.body.increase? SCORE_WEIGHT : (SCORE_WEIGHT * -1) ;
    const target = storedPlayers.find(player => player.gameId === gameId);
    const idx = storedPlayers.indexOf(target);
    const updatedTarget = {...target, friendliness: (target.friendliness + weight), goodTeammate: (target.friendliness + weight ) < 2};
    console.log(util.inspect(updatedTarget));
    storedPlayers.splice(idx, 1, updatedTarget);
    res.send(storedPlayers.sort(function(a, b){return b.friendliness - a.friendliness}));
  } catch (error) {
      res.send(error);
  }
});

// All other GET requests not handled before will return our React app
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
});
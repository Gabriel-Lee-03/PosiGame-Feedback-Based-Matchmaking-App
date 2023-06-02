// server/index.js
const express = require("express");
const PORT = process.env.PORT || 3001;
const app = express();
const path = require('node:path');
const util = require('util');
const bodyParser = require('body-parser');

let storedPlayers = [
  {gameId: `135`, name: `Amy_Winehouse`, friendliness: 147, goodTeammate: true},
  {gameId: `246`, name: `Bob_Dylan`, friendliness: 454, goodTeammate: true},
  {gameId: `2346`, name: `jhgvd`, friendliness: -412, goodTeammate: true},
  {gameId: `2466`, name: `gfd`, friendliness: 55, goodTeammate: true},
  {gameId: `092`, name: `kjhgf`, friendliness: 76, goodTeammate: true},
  {gameId: `223`, name: `jhgf`, friendliness: 44, goodTeammate: true},
  {gameId: `345`, name: `tyrret`, friendliness: 2, goodTeammate: true},
  {gameId: `15`, name: `uyt`, friendliness: 17, goodTeammate: true},
  {gameId: `6`, name: `iuyt`, friendliness: 23, goodTeammate: true},
  {gameId: `655`, name: `uyt`, friendliness: 236, goodTeammate: true},
  {gameId: `765`, name: `oiuyt`, friendliness: 21, goodTeammate: true},
  {gameId: `23`, name: `iuyt`, friendliness: -76, goodTeammate: true},
  {gameId: `54`, name: `iuytre`, friendliness: -44, goodTeammate: true},
  {gameId: `76565`, name: `erg`, friendliness: -2, goodTeammate: true},

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
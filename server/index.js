// server/index.js
const express = require("express");
const app = express();
const path = require('node:path');
const util = require('util');
const TestPlayer = require("./models/player");
const connectToMongoDB = require("./db");
const dotenv = require('dotenv');
dotenv.config();
const PORT = process.env.PORT || 3001;


connectToMongoDB();

// Have Node serve the files for our built React app
app.use(express.json());
app.use(express.static(path.resolve(__dirname, '../client/build')));

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

// Handle GET requests to /api route
app.get("/api", async(req, res) => {
  try {
    const all_players = await TestPlayer.find();
    res.send(all_players);
  }catch (error) {
    res.send(error);
  }
});

// handle post request to /api route
app.post("/api", async (req, res) => {
  try {
    const player = req.body.player;
    // insert into db
    await new TestPlayer(player).save();   
    res.send(player);
  } catch (error) {
    res.send(error);
  }
});

const SCORE_WEIGHT = 0.5;

app.put("/api/rate/id", async (req, res) => {
  try {
    console.log(`call put`);
    const player = req.body.player;
    const weight = req.body.increase? SCORE_WEIGHT : (SCORE_WEIGHT * -1);
    const newFriendliness = player.friendliness + weight;
    const newGoodness = newFriendliness < 2;
    await TestPlayer.findOneAndUpdate(
      { gameId: player.gameId },
      {...player, friendliness: newFriendliness,  goodTeammate: newGoodness}
    ); 
    const all_players = await TestPlayer.find();
    // console.log(util.inspect(all_players));
    res.send(all_players);
  } catch (error) {
      res.send(error);
  }
});

// All other GET requests not handled before will return our React app
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
});
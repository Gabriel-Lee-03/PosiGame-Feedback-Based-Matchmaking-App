// server/index.js
const express = require("express");
const app = express();
const path = require('node:path');
const util = require('util');

const Players = require("./models/player");
const connectToMongoDB = require("./db");
const {router, createLobby} = require("./lobbys");
const {addToSearchQueue} = require("./search");

const dotenv = require('dotenv');
dotenv.config();
const PORT = process.env.PORT || 3001;

// // requests sent to this url
// const lobbyUrl = "/api/lobby";

// constant variables
const defaultRating = 5;
const defaultRatingCount = 1;
const defaultTotalScore = 5;

connectToMongoDB();

// Have Node serve the files for our built React app
app.use(express.json());
// app.use(lobbyUrl, router);
app.use(express.static(path.resolve(__dirname, '../client/build')));

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

// Handle GET requests to /api/name route
app.get("/api/queue/:name", async(req, res) => {
  const name = req.params.name;
  // console.log(util.inspect(name));
  try {
    const playerList = await Players.find({name: name});
    // console.log("player list: " + util.inspect(playerList));
    // throws 403 forbidden error if user does not exist
    if (playerList.length === 0) {
      res.send(403,"You do not have rights to visit this page");
    }
    res.send(playerList);   
  }catch (error) {
    res.send(error);
  }
});

// handle post request to /api route
app.post("/api", async (req, res) => {
  try {
    const loginInfo = req.body.loginInfo;
    console.log("login info: " +  util.inspect(loginInfo));
    const playerList = await Players.find({name: loginInfo.name});
    let player = {};
    if (playerList.length == 0) {
      console.log("register new player");
      player = {gameId: loginInfo.gameId,
        name: loginInfo.name,
        friendliness: defaultRating,
        ratingCount: defaultRatingCount,
        totalScore: defaultTotalScore};
      await new Players(player).save();
    } else {
      console.log("get existing player");
      player = playerList[0];
    }
    console.log("post ok");
    res.send(player);
  } catch (error) {
    res.send(error);
  }
});

// Handle POST requests to lobbyUrl route
app.post("/api/lobby/search/:name", async(req, res) => {
  console.log("at search post");
  const name = req.params.name;
  const players = req.body.players;
  let updatedPlayers = [];
  for (i = 0; i < players.length; i++) {
    let updatedPlayer = await Players.find({name: players[i].name})
    console.log("player from db: " + util.inspect(updatedPlayer));
    updatedPlayers.push(updatedPlayer);
  }
  const thisLobby = createLobby(updatedPlayers);
  const newLobby = await addToSearchQueue(thisLobby);
  res.send(newLobby.players);
});

const SCORE_WEIGHT = 0.5;

//handles PUT request to route with confirmed rating 
app.put("/api/rate", async (req, res) => {
  try {
    console.log(`call put`);
    const player = req.body.player;
    console.log("ratedPlayer: " + util.inspect(player));
    const rating = req.body.rating;
    console.log("rating: " + util.inspect(rating));
    const playerDB = await Players.findOne({name: player.name});
    console.log("playerDB: " + util.inspect(playerDB));
    const totalScore = playerDB.totalScore;
    const ratingCount = playerDB.ratingCount;
    const newTotalScore = totalScore + rating;
    const newRatingCount = ratingCount + 1;
    console.log("newScore: " + newTotalScore);
    console.log("newCount: " + newRatingCount);
    await Players.findOneAndUpdate(
      { name: player.name },
      {...playerDB, friendliness: newTotalScore / newRatingCount, ratingCount: newRatingCount, totalScore: newTotalScore}
    );

    res.send("ok");
  } catch (error) {
      res.send(error);
  }
});

// All other GET requests not handled before will return our React app
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
});

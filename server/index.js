// server/index.js
const express = require("express");
const app = express();
const path = require('node:path');
const util = require('util');
const Players = require("./models/player");
const connectToMongoDB = require("./db");
const dotenv = require('dotenv');
dotenv.config();
const PORT = process.env.PORT || 3001;

const defaultRating = 5;
const defaultIsGood = true;
const maxLobbySize = 4;

connectToMongoDB();

// Have Node serve the files for our built React app
app.use(express.json());
app.use(express.static(path.resolve(__dirname, '../client/build')));

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

// // Handle GET requests to /api route
// app.get("/api", async(req, res) => {
//   try {
//     // const all_players = await Players.find();
//     // res.send(all_players);
//   }catch (error) {
//     res.send(error);
//   }
// });

function createLobby(players) {
  return {max: maxLobbySize, players: players};
}

function mergeLobbys(lobbyA, lobbyB) {
  const errMsg = "Merge lobby failed, size exceeds " + maxLobbySize;
  console.assert(lobbyA.players.length + lobbyB.players.length <= maxLobbySize, errMsg);
  return {max: maxLobbySize, players: lobbyA.players.concat(lobbyB.players)}
}

// Handle GET requests to /api/name route
app.get("/api/:name", async(req, res) => {
  const name = req.params.name;
  console.log(util.inspect(name));
  try {
    const playerList = await Players.find({name: name});
    console.log(util.inspect(playerList));
    // throws 403 forbidden error if user does not exist
    if (playerList.length === 0) {
      res.send(403,"You do not have rights to visit this page");
    }
    res.send(createLobby(playerList));   
  }catch (error) {
    res.send(error);
  }
});

// handle post request to /api route
app.post("/api", async (req, res) => {
  try {
    const loginInfo = req.body.loginInfo;
    console.log("login info" +  util.inspect(loginInfo));
    // TODO: check if Game ID is unique
    const playerList = await Players.find({name: loginInfo.name});
    let player = {};
    if (playerList.length == 0) {
      console.log("register new player");
      player = {gameId: loginInfo.gameId,
        name: loginInfo.name,
        friendliness: defaultRating,
        goodTeammate: defaultIsGood};
      await new Players(player).save();
    } else {
      console.log("get existing player");
      player = playerList.head();
    }
    console.log("post ok");
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
    await Players.findOneAndUpdate(
      { gameId: player.gameId },
      {...player, friendliness: newFriendliness,  goodTeammate: newGoodness}
    ); 
    const all_players = await Players.find();
    res.send(all_players);
  } catch (error) {
      res.send(error);
  }
});

// All other GET requests not handled before will return our React app
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
});
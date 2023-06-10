const express = require("express");
const router = express.Router();
const util = require('util');

const {createLobby} = require("../lobbys");
const {addToSearchQueue} = require("../search");

const Players = require("../models/player");

// Handle GET requests to /queue/name route
router.get("/queue/:name", async(req, res) => {
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

// Handle POST requests to lobbyUrl route
router.post("/search", async(req, res) => {
  console.log("at search post");
  const name = req.params.name;
  const players = req.body.players;
  let updatedPlayers = [];
  for (let i = 0; i < players.length; i++) {
    let updatedPlayer = await Players.findOne({name: players[i].name})
    console.log("player from db: " + util.inspect(updatedPlayer));
    updatedPlayers.push(updatedPlayer);
  }
  const thisLobby = createLobby(updatedPlayers);
  const newLobby = await addToSearchQueue(thisLobby);
  res.send(newLobby.players);
});

//handles PUT request to route with confirmed rating 
router.put("/rate", async (req, res) => {
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
    console.log("playerName: " + util.inspect(player.name));
    await Players.findOneAndUpdate(
      { name: player.name },
      { friendliness: (newTotalScore / newRatingCount), ratingCount: newRatingCount, totalScore: newTotalScore }
    );

    res.send("ok");
  } catch (error) {
      res.send(error);
  }
});

module.exports = router;
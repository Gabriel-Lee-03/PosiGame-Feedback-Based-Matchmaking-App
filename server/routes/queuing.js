const express = require("express");
const router = express.Router();
const util = require('util');

const {createLobby} = require("../lobbys");
const {addToSearchQueue} = require("../search");

const Players = require("../models/player");

// Handle GET requests to /queue/name route
router.get("/queue/:name", async(req, res) => {
  const name = req.params.name;
  try {
    const playerList = await Players.find({name: name});
    // throws 403 forbidden error if user does not exist
    if (playerList.length === 0) {
      res.status(403).send("You do not have rights to visit this page");
    } else {
      res.send(playerList);
    }
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
    const date = req.body.date;
    const feedback = req.body.feedback;
    const rating = feedback.charCodeAt(0) - '0'.charCodeAt(0);
    console.log("rating info: " + util.inspect(req.body));
    const playerDB = await Players.findOne({name: player.name});
    console.log("playerDB: " + util.inspect(playerDB));
    const totalScore = playerDB.totalScore;
    const ratingCount = playerDB.ratingCount;
    const feedbackLog = playerDB.feedbackLog;
    console.log("old feedback log: " + util.inspect(feedbackLog));
    const newTotalScore = totalScore + rating;
    const newRatingCount = ratingCount + 1;
    feedbackLog.push({date: date, feedback: feedback});
    console.log("new feedback log: " + util.inspect(feedbackLog));
    await Players.findOneAndUpdate(
      { name: player.name },
      { friendliness: (newTotalScore / newRatingCount), ratingCount: newRatingCount, totalScore: newTotalScore, feedbackLog: feedbackLog }
    );

    res.send("ok");
  } catch (error) {
      res.send(error);
  }
});

//handles GET request for user's feedback log
router.get("/feedback/:name", async (req, res) => {
  try {
    const name = req.params.name;
    const userDB = await Players.findOne({name: name});
    res.send(userDB.feedbackLog);
  } catch (error) {
    res.send(error);
  }
});

module.exports = router;
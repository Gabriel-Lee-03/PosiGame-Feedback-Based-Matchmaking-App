const express = require("express");
const router = express.Router();
const util = require('util');

const {createLobby} = require("../lobbys");
const {addToSearchQueue} = require("../search");
const Players = require("../models/player");
const {calculateRating} = require("../ratingCalculator");

// Handle GET requests to /queue/name route
router.get("/queue/:name", async(req, res) => {
  const name = req.params.name;
  try {
    const playerList = await Players.find({name: name});
    // throws 403 forbidden error if user does not exist
    if (playerList.length === 0) {
      res.status(403).send("You do not have rights to visit this page");
    } else {
      console.log(util.inspect(playerList));
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
  try {
    const newLobby = await addToSearchQueue(thisLobby);
    const status = {players: newLobby.players, success: true};
    res.send(status);
  }catch (error) {
    console.error("queue timeout");
    const status = {players:players, success: false};
    res.send(status);
  }
});

//handles PUT request to route with confirmed rating 
router.put("/rate", async (req, res) => {
  try {
    console.log(`call put`);
    const player = req.body.player;
    const date = req.body.date;
    const feedback = req.body.feedback;
    const rating = req.body.rating;
    const score = calculateRating(rating);
    console.log("rating info: " + util.inspect(req.body));
    console.log("calculated score: " + util.inspect(score));
    const playerDB = await Players.findOne({name: player.name});
    const totalScore = playerDB.totalScore;
    const ratingCount = playerDB.ratingCount;
    const feedbackLog = playerDB.feedbackLog;
    // console.log("old feedback log: " + util.inspect(feedbackLog));
    const newTotalScore = totalScore + score;
    const newRatingCount = ratingCount + 1;
    feedbackLog.unshift({date: date, feedback: feedback});
    // console.log("new feedback log: " + util.inspect(feedbackLog));
    await Players.findOneAndUpdate(
      { name: player.name },
      { friendliness: (newTotalScore / newRatingCount), ratingCount: newRatingCount, totalScore: newTotalScore, feedbackLog: feedbackLog }
    );
    console.log("updated player: " + util.inspect(updated));
    res.send("put ok");
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
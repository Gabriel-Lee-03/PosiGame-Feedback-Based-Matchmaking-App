const express = require("express");
const router = express.Router();
const util = require('util');

const Players = require("../models/player");

// Handle POST request to / route
router.post("/", async (req, res) => {
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

module.exports = router;
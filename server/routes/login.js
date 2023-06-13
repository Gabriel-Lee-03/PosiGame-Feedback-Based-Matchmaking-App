const express = require("express");
const router = express.Router();
const util = require('util');

const Players = require("../models/player");

// constant variables
const defaultRating = 5;
const defaultRatingCount = 1;
const defaultTotalScore = 5;

// Handle POST request to / route
router.post("/", async (req, res) => {
  try {
    const loginInfo = req.body.loginInfo;
    console.log("login info: " +  util.inspect(loginInfo));
    const playerList = await Players.find({name: loginInfo.name});
    let player = {};
    let found = false;
    if (playerList.length == 0 && loginInfo.gameId !== "") {
      console.log("register new player");
      player = {
        gameId: loginInfo.gameId,
        name: loginInfo.name,
        friendliness: defaultRating,
        ratingCount: defaultRatingCount,
        totalScore: defaultTotalScore
      };
      await new Players(player).save();
      found = true;
    } else if (playerList.length !== 0) {
      console.log("get existing player");
      player = playerList[0];
      found = true;
    }
    console.log("post ok");
    console.log("found value: " +  util.inspect(found));
    console.log("found type: " + util.inspect(typeof(found)));
    res.send({isFound: found});
  } catch (error) {
    res.send(error);
  }
});

module.exports = router;
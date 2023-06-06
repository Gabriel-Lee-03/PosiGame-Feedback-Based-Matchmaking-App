const express = require("express");
const router = express.Router();

const defaultRating = 5;
const defaultIsGood = true;
const maxLobbySize = 4;

const dummyLobbys = [
  createLobby({ gameId: "dummyId_1",
                name: "dummy1",
                friendliness: defaultRating,
                goodTeammate: defaultIsGood}),
  createLobby({ gameId: "dummyId_2",
                name: "dummy2",
                friendliness: defaultRating,
                goodTeammate: defaultIsGood}),
  createLobby({ gameId: "dummyId_3",
                name: "dummy3",
                friendliness: defaultRating,
                goodTeammate: defaultIsGood}),
                createLobby({ gameId: "dummyId_4",
                name: "dummy4",
                friendliness: defaultRating,
                goodTeammate: defaultIsGood}),
  createLobby({ gameId: "dummyId_5",
                name: "dummy5",
                friendliness: defaultRating,
                goodTeammate: defaultIsGood}),
  createLobby({ gameId: "dummyId_6",
                name: "dummy6",
                friendliness: defaultRating,
                goodTeammate: defaultIsGood}),
  createLobby({ gameId: "dummyId_7",
                name: "dummy7",
                friendliness: defaultRating,
                goodTeammate: defaultIsGood})
]

var queue = [...dummyLobbys];

// Handle GET requests to lobbyUrl route
router.get("/:id", async(req, res) => {
  const thisLobby = req.body.lobby;
  const newLobby = {...thisLobby, players: dummyLobbys}
  res.send(newLobby);
});

// TODO: support concurrnet matching
matchingWorker = async () => {
  while(queue.length >= maxLobbySize) {
    console.log("hello!");
  }
}

function createLobby(players) {
  return {max: maxLobbySize,
          players: players,
          spaceLeft:(maxLobbySize - players.length)};
}

function mergeLobbys(lobbyA, lobbyB) {
  const errMsg = "Merge lobby failed, size exceeds " + maxLobbySize;
  console.assert(lobbyA.players.length + lobbyB.players.length <= maxLobbySize, errMsg);
  return {max: maxLobbySize, players: lobbyA.players.concat(lobbyB.players)}
}

module.exports = {router, dummyLobbys, matchingWorker, createLobby, mergeLobbys}
const express = require("express");
const router = express.Router();
const util = require('util');

const defaultRating = 5;
const defaultIsGood = true;
const maxLobbySize = 4;

function createLobby(players) {
  const ratingSum = players.reduce((acc, obj) => acc + obj.friendliness, 0);
  console.log("rating: " + ratingSum);
  return {max: maxLobbySize,
          players: players,
          spaceLeft:(maxLobbySize - players.length),
          averageRating: ratingSum / players.length};
}

const testPlayer1 = { gameId: "testID_1",
                      name: "testPlayer1",
                      friendliness: defaultRating,
                      goodTeammate: defaultIsGood};

const testPlayer2 = { gameId: "testID_2",
                      name: "testPlayer2",
                      friendliness: defaultRating,
                      goodTeammate: defaultIsGood};

const testPlayer3 = { gameId: "testID_3",
                      name: "testPlayer3",
                      friendliness: defaultRating,
                      goodTeammate: defaultIsGood};

const testLobby1 = createLobby([testPlayer1]);
const testLobby2 = createLobby([testPlayer2]);
const testLobby3 = createLobby([testPlayer3]);

// const dummyLobbys = [
//   createLobby({ gameId: "dummyId_1",
//                 name: "dummy1",
//                 friendliness: defaultRating,
//                 goodTeammate: defaultIsGood}),
//   createLobby({ gameId: "dummyId_2",
//                 name: "dummy2",
//                 friendliness: defaultRating,
//                 goodTeammate: defaultIsGood}),
//   createLobby({ gameId: "dummyId_3",
//                 name: "dummy3",
//                 friendliness: defaultRating,
//                 goodTeammate: defaultIsGood}),
//                 createLobby({ gameId: "dummyId_4",
//                 name: "dummy4",
//                 friendliness: defaultRating,
//                 goodTeammate: defaultIsGood}),
//   createLobby({ gameId: "dummyId_5",
//                 name: "dummy5",
//                 friendliness: defaultRating,
//                 goodTeammate: defaultIsGood}),
//   createLobby({ gameId: "dummyId_6",
//                 name: "dummy6",
//                 friendliness: defaultRating,
//                 goodTeammate: defaultIsGood}),
//   createLobby({ gameId: "dummyId_7",
//                 name: "dummy7",
//                 friendliness: defaultRating,
//                 goodTeammate: defaultIsGood})
// ]

// var queue = [...dummyLobbys];

// TODO: support concurrnet matching
matchingWorker = async () => {
  while(queue.length >= maxLobbySize) {
    console.log("hello!");
  }
}

function mergeLobbys(lobbyA, lobbyB) {
  const errMsg = "Merge lobby failed, size exceeds " + maxLobbySize;
  console.assert(lobbyA.players.length + lobbyB.players.length <= maxLobbySize, errMsg);
  const newPlayersList = lobbyA.players.concat(lobbyB.players);
  const ratingSum = newPlayersList.reduce((acc, obj) => acc + obj.friendliness, 0);
  return {max: maxLobbySize,
          players: newPlayersList,
          spaceLeft: (maxLobbySize - newPlayersList.length),
          averageRating: ratingSum / newPlayersList.length};
}

module.exports = {router, matchingWorker, createLobby, mergeLobbys, testLobby1, testLobby2, testLobby3}
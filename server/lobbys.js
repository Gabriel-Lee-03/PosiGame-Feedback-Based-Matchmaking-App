const express = require("express");
const router = express.Router();
const util = require('util');

const defaultRating = 5;
const defaultIsGood = true;
const maxLobbySize = 2;

function createLobby(players) {
  const ratingSum = players.reduce((acc, obj) => acc + obj.friendliness, 0);
  return {max: maxLobbySize,
          players: players,
          spaceLeft:(maxLobbySize - players.length),
          averageRating: ratingSum / players.length};
}

const testPlayer1 = { gameId: "testID_1",
                      name: "testPlayer1",
                      friendliness: defaultRating,
                      ratingCount: 1,
                      totalScore: 5};

const testPlayer2 = { gameId: "testID_2",
                      name: "testPlayer2",
                      friendliness: defaultRating,
                      ratingCount: 2,
                      totalScore: 10};

const testPlayer3 = { gameId: "testID_3",
                      name: "testPlayer3",
                      friendliness: defaultRating,
                      ratingCount: 4,
                      totalScore: 20};

const testLobby1 = createLobby([testPlayer1]);
const testLobby2 = createLobby([testPlayer2]);
const testLobby3 = createLobby([testPlayer3]);

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

module.exports = {router, createLobby, mergeLobbys, testPlayer1, testPlayer2, testPlayer3}
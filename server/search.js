const {createLobby, mergeLobbys, testPlayer1, testPlayer2, testPlayer3} = require("./lobbys");
const util = require('util');
const Players = require("./models/player");

const maxRatingDifference = 5

let isRunningSearch = false;
// const player1 = await Players.findOne({name: testPlayer1});
// const player2 = await Players.findOne({name: testPlayer2});
// const player3 = await Players.findOne({name: testPlayer3});
const testLobby1 = createLobby([testPlayer1]);
const testLobby2 = createLobby([testPlayer2]);
const testLobby3 = createLobby([testPlayer3]);
const testLobbyObj1 = {lobby: testLobby1, resolve: []};
const testLobbyObj2 = {lobby: testLobby2, resolve: []};
const testLobbyObj3 = {lobby: testLobby3, resolve: []};
let searchingQueue = [testLobbyObj1, testLobbyObj2, testLobbyObj3];

async function search() { 
    isRunningSearch = true;
    console.log("current queue: " + util.inspect(searchingQueue));
    // const player1 = await Players.findOne({name: testPlayer1});
    // console.log("testplayer1: " + util.inspect(player1));
    // const player2 = await Players.findOne({name: testPlayer2});
    // const player3 = await Players.findOne({name: testPlayer3});
    // const testLobby1 = createLobby([player1]);
    // const testLobby2 = createLobby([player2]);
    // const testLobby3 = createLobby([player3]);
    // const testLobbyObj1 = {lobby: testLobby1, resolve: []};
    // const testLobbyObj2 = {lobby: testLobby2, resolve: []};
    // const testLobbyObj3 = {lobby: testLobby3, resolve: []};
    // searchingQueue.push(testLobbyObj1);
    // searchingQueue.push(testLobbyObj2);
    // searchingQueue.push(testLobbyObj3);
    // await updatePlayers();
    while (searchingQueue.length > 0) {
        // console.log("searchQueue:" + util.inspect(searchingQueue));
        let objA = searchingQueue.shift();
        let lobbyA = objA.lobby;
        let resolveA = objA.resolve;
        if (lobbyA.spaceLeft === 0) {
            resolveA.forEach(res => res(lobbyA));
            continue;
        }
        if (searchingQueue.length === 0) {
            searchingQueue.push({lobby: lobbyA, resolve: resolveA});
            break;
        }
        for (let i = 0; i < searchingQueue.length; i++) {
            let objB = searchingQueue[i];
            let lobbyB = objB.lobby;
            let resolveB = objB.resolve;
            const ratingA = lobbyA.averageRating;
            const ratingB = lobbyB.averageRating;
            if (Math.abs(ratingA - ratingB) <= maxRatingDifference) {
                searchingQueue.splice(i, 1);
                let lobbyC = mergeLobbys(lobbyA, lobbyB);
                let resolveC = resolveA.concat(resolveB);
                searchingQueue.unshift({lobby: lobbyC, resolve: resolveC});
                break;
            }
        }
    }
    isRunningSearch = false;
}

function addToSearchQueue(lobby) {
    return new Promise(resolve => {
        searchingQueue.push({lobby: lobby, resolve: [resolve]});
        if (!isRunningSearch) {
            search();
        }
    });
}

async function updatePlayers() {
    for (let i = 0; i < searchingQueue.length; i++) {
        console.log(i);
        console.log("queue length: " + util.inspect(searchingQueue.length));
        let obj = searchingQueue[i];
        let lobby = obj.lobby;
        for (let j = 0; j < lobby.players.length; j++) {
            let player = lobby.players[j];
            let updatedPlayer = await Players.findOne({name: player.name});
            lobby.players.splice(j, 1, updatedPlayer);
        }
        // console.log("obj:" + util.inspect(obj));
        // console.log("old lobby: " + util.inspect(searchingQueue[i].lobby.players[0]));
        // console.log("new lobby: " + util.inspect(lobby.players[0]));
        // searchingQueue[i].lobby = lobby;
    }
}

module.exports = {addToSearchQueue}
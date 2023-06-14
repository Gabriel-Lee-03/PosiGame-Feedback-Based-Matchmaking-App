const {createLobby, mergeLobbys, testPlayer1, testPlayer2, testPlayer3} = require("./lobbys");
const util = require('util');
const Players = require("./models/player");

const maxRatingDifference = 5

let isRunningSearch = false;
const testLobby1 = createLobby([testPlayer1]);
const testLobby2 = createLobby([testPlayer2]);
const testLobby3 = createLobby([testPlayer3]);
const testLobbyObj1 = {lobby: testLobby1, resolve: []};
const testLobbyObj2 = {lobby: testLobby2, resolve: []};
const testLobbyObj3 = {lobby: testLobby3, resolve: []};
let searchingQueue = [testLobbyObj1, testLobbyObj2, testLobbyObj3];

async function search() { 
    isRunningSearch = true;
    // console.log("current queue: " + util.inspect(searchingQueue));
    while (searchingQueue.length > 0) {
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
    return new Promise((resolve, reject) => {
        searchingQueue.push({lobby: lobby, resolve: [resolve]});
        if (!isRunningSearch) {
            search();
        }
    });
}

module.exports = {addToSearchQueue}
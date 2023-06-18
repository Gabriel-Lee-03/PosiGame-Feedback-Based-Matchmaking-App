const {createLobby, mergeLobbys, testPlayer1, testPlayer2, testPlayer3} = require("./lobbys");
const util = require('util');
const Players = require("./models/player");

const maxRatingDifference = 1

let isRunningSearch = false;
const testLobby1 = createLobby([testPlayer1]);
const testLobby2 = createLobby([testPlayer2]);
const testLobby3 = createLobby([testPlayer3]);
const testLobbyObj1 = {lobby: testLobby1, resolve: []};
const testLobbyObj2 = {lobby: testLobby2, resolve: []};
const testLobbyObj3 = {lobby: testLobby3, resolve: []};
// let searchingQueue = [testLobbyObj1, testLobbyObj2, testLobbyObj3];
let searchingQueue = [];

async function search() {
    isRunningSearch = true;

    while (searchingQueue.length > 0) {
        let objA = searchingQueue.shift();
        let lobbyA = objA.lobby;
        let resolveA = objA.resolve;

        if (lobbyA.spaceLeft === 0) {
            resolveA.forEach(res => res(lobbyA));
            continue;
        }

        if (searchingQueue.length === 0) {
            searchingQueue.push({ lobby: lobbyA, resolve: resolveA });
            break;
        }

        const startTime = Date.now(); // Record the start time

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
                searchingQueue.unshift({ lobby: lobbyC, resolve: resolveC });
                break;
            }

            // Check if 10 seconds have passed and spaceLeft is still not 0
            const currentTime = Date.now();
            if (currentTime - startTime >= 40000 && lobbyA.spaceLeft > 0) {
                searchingQueue.splice(i, 1);
                resolveA.forEach(res => res(lobbyA)); // Reject the promise
                break;
            }
        }
    }

    isRunningSearch = false;
}

function addToSearchQueue(lobby) {
    console.log("current queue (before adding): " + util.inspect(searchingQueue));
    return new Promise((resolve, reject) => {
        const timeoutId = setTimeout(() => {
            const index = searchingQueue.findIndex(item => item.lobby === lobby);
            if (index !== -1) {
                searchingQueue.splice(index, 1);
                reject(new Error('Search timeout'));
            }
        }, 40000); // Timeout after 10 seconds

        const resolveWrapper = (...args) => {
            clearTimeout(timeoutId);
            resolve(...args);
        };

        searchingQueue.push({ lobby: lobby, resolve: [resolveWrapper] });

        if (!isRunningSearch) {
            search();
        }
    });
}
module.exports = {addToSearchQueue}
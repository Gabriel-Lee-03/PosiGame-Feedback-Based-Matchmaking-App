const {mergeLobbys, testLobby} = require("./lobbys");
const util = require('util');

const maxRatingDifference = 5

let isRunningSearch = false;
const testLobbyObj = {lobby: testLobby, resolve: []};
let searchingQueue = [testLobbyObj];

function search() {
    
    isRunningSearch = true;
    while (searchingQueue.length > 0) {
        console.log("searchQueue:" + util.inspect(searchingQueue));
        let objA = searchingQueue.shift();
        let lobbyA = objA.lobby;
        console.log("lobbyObj:" + util.inspect(objA));
        console.log("lobbyA:" + util.inspect(objA.lobby));
        let resolveA = objA.resolve;
        if (lobbyA.spaceLeft === 0) {
            resolveA.forEach(res => res(lobbyA));
            continue;
        }
        if (searchingQueue.length === 0) {
            searchingQueue.push({lobbyA, resolveA});
            break;
        }
        for (var x in searchingQueue) {
            let objB = searchingQueue.shift();
            let lobbyB = objB.lobby;
            let resolveB = objB.resolve;
            const ratingA = lobbyA.averageRating;
            const ratingB = lobbyB.averageRating;
            if (Math.abs(ratingA - ratingB) <= maxRatingDifference) {
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
        searchingQueue.push({lobby, resolve: [resolve]});
        if (!isRunningSearch) {
            search();
        }
    });
}

module.exports = {addToSearchQueue}
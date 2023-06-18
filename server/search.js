const {createLobby, mergeLobbys, maxLobbySize, testPlayer1, testPlayer2, testPlayer3} = require("./lobbys");
const util = require('util');
const Players = require("./models/player");

const maxRatingDifference = 1
let isRunningSearch = false;
const timeOutVal = 30000;

const testLobby1 = createLobby([testPlayer1]);
const testLobby2 = createLobby([testPlayer2]);
const testLobby3 = createLobby([testPlayer3]);
// const testLobbyObj1 = {lobby: testLobby1, resolve: []};
// const testLobbyObj2 = {lobby: testLobby2, resolve: []};
// const testLobbyObj3 = {lobby: testLobby3, resolve: []};
// let searchingQueue = [testLobbyObj1, testLobbyObj2, testLobbyObj3];
let searchingQueue = [];

  async function search() {
    isRunningSearch = true;
  
    while (searchingQueue.length > 0) {
      let objA = searchingQueue.shift();
      let lobbyA = objA.lobby;
      let resolveA = objA.resolve;
  
      if (lobbyA.spaceLeft === 0) {
        // Lobby A is full, resolve all promises with a merged lobby
        const mergedLobby = mergeLobbys(lobbyA, lobbyA);
        resolveA.forEach(res => res(mergedLobby));
        continue;
      }
  
      if (searchingQueue.length === 0) {
        searchingQueue.push({ lobby: lobbyA, resolve: resolveA });
        break;
      }
  
      const startTime = Date.now(); // Record the start time
  
      const groupedLobbies = [lobbyA]; // Store the lobbies grouped together
      const groupedPromises = [resolveA]; // Store the promises associated with each lobby
  
      for (let i = 0; i < searchingQueue.length; i++) {
        let objB = searchingQueue[i];
        let lobbyB = objB.lobby;
        let resolveB = objB.resolve;
  
        const ratingA = lobbyA.averageRating;
        const ratingB = lobbyB.averageRating;
  
        if (
          Math.abs(ratingA - ratingB) <= maxRatingDifference &&
           (lobbyA.spaceLeft >= lobbyB.players.length) && (lobbyB.spaceLeft >= lobbyA.players.length)
        ) {
          searchingQueue.splice(i, 1);
          groupedLobbies.push(lobbyB);
          groupedPromises.push(resolveB);
          i--; // Decrement i since we removed an item from the queue
        }
  
        // Check if timeOutVal seconds have passed and spaceLeft is still not 0
        const currentTime = Date.now();
        if (currentTime - startTime >= timeOutVal &&  groupedLobbies.length<maxLobbySize) {
          // Reject all promises associated with each lobby in the lobbyList of the lobby group
          startingGroup.lobbyList.forEach(lobby => {
            lobby.resolve.forEach(res => res(null)); // Reject the promise
          });
          break;
        }
      }
  
      // Merge the grouped lobbies into a single lobby
      const mergedLobby = groupedLobbies.reduce((acc, lobby) => mergeLobbys(acc, lobby));
  
      // Combine the promises from all lobbies in the group
      const mergedPromises = groupedPromises.flat();
  
      // Add the merged lobby back to the searching queue
      searchingQueue.unshift({ lobby: mergedLobby, resolve: mergedPromises });
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
        }, timeOutVal); // Timeout after timeOutVal seconds

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
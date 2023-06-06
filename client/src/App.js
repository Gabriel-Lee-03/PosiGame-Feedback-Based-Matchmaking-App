import React, { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";

// Screen 1 component
function LogIn({ onSubmit, nameVal, savedGameID }) {
  // State for Game ID and Name inputs
  const [gameId, setGameId] = useState(savedGameID);
  const [name, setName] = useState(nameVal);
  const apiUrl = "/api"

  // Handle form submission
  async function handleSubmit(e) {
    e.preventDefault();
    try {
      //const player = { gameId: gameId, name: name, friendliness: defaultRating, goodTeammate: defaultIsGood };
      const info = { gameId: gameId, name: name };
      const player = await axios.post(apiUrl, {loginInfo: info});
      setGameId("");
      setName("");
      onSubmit(name, gameId);
    } catch (error) {
      // Request was not successful
      console.error('An error occurred:', error);
    }
  }

  return (
    <div className="Player">
      <h1>Player</h1>
      <div className="input-row">
        <label>Username: </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="input-row">
        <label>Game ID: </label>
        <input
          type="text"
          value={gameId}
          onChange={(e) => setGameId(e.target.value)}
        />
      </div>
      <button onClick={e => handleSubmit(e)}>Submit</button>
    </div>
  );
}


// Screen 2 component
function Lobby({ onAddPlayer, nameVal }) {
  const ratingUrl = "/api/rate/id";
  const apiUrl = "/api/" + nameVal;

  console.log(nameVal);

  const [players, setPlayers] = useState([]);

  async function increaseRating(player) {
    try {
      const response = await axios.put(ratingUrl, {player: player, increase: true});
      const data = await response.data;
      console.log("inc resp " + data);
      setPlayers(data);
    } catch (error) {
      // Request was not successful
      console.error('An error occurred:', error);
    }
  }

  async function decreaseRating(player) {
    try {
      const response = await axios.put(ratingUrl, {player: player, increase: false});
      const data = await response.data;
      console.log("dec resp " + data);
      setPlayers(data);
    } catch (error) {
      // Request was not successful
      console.error('An error occurred:', error);
    }
  }

   // Handle add player button click
  function handleAddPlayer() {
  // Call the onAddPlayer callback
    onAddPlayer();
  }

  useEffect(() => {
    try {
      axios.get(apiUrl)
      .then(res => {
        const players = res.data.players;
        setPlayers(players);
        console.log(`component mounted`);
      });
    }catch(error) {
      console.log(error);
    }
  }, []);

  return (
    <div className="Lobby">
      <h1>Lobby</h1>
      <table className="lobby-table">
        <thead>
          <tr>
            <th>Username</th>
            <th>Game ID</th>
            <th>Friendliness</th>
            {/* <th>Good teammate?</th> */}
          </tr>
        </thead>
        <tbody>
          {
            players.map((player) => (
              <tr key={player._id}>
                <td>{player.name}</td>
                <td>{player.gameId}</td>
                <td>{player.friendliness}</td>
                {/* <td>
                  <button className="thumbs-up-button" onClick={() => increaseRating(player)}>
                    {"👍"}
                  </button>
                  <button className="thumbs-down-button" onClick={() => decreaseRating(player)}>
                    {"👎"}
                  </button>
                </td> */}
              </tr>
            ))
          }
        </tbody>
      </table>
      <button onClick={handleAddPlayer}>Back</button>
    </div>
  );
}

function App() {
  // State for managing the current screen
  const [currentScreen, setCurrentScreen] = useState("LogIn");
  const [userName, setUserName] = useState("");
  const [userGameID, setUserGameID] = useState("");

  // Handle screen change from LogIn to Lobby
  function handleScreenChange(name, gameId) {
    // wait for server response
    // Set the current screen to Lobby
    setCurrentScreen("Lobby");
    setUserName(name);
    setUserGameID(gameId)
  }

  // Handle screen change from Lobby to LogIn
  function handleAddPlayer() {
    // Set the current screen to LogIn
    setCurrentScreen("LogIn");
  }

  return (
    <div className="app">
      {/* Render LogIn if the current screen is LogIn */}
      {currentScreen === "LogIn" && <LogIn onSubmit={handleScreenChange} nameVal={userName} savedGameID={userGameID}/>}

      {/* Render Lobby if the current screen is Lobby */}
      {currentScreen === "Lobby" && <Lobby onAddPlayer={handleAddPlayer} nameVal={userName}/>}
    </div>
  );
}

export default App;
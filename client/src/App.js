import React, { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";

// Screen 1 component
function Screen1({ onSubmit }) {
  // State for Game ID and Name inputs
  const [gameId, setGameId] = useState("");
  const [name, setName] = useState("");
  const apiUrl = "/api"

  const defaultRating = 5;
  const defaultIsGood = true;

  // Handle form submission
  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const player = { gameId: gameId, name: name, friendliness: defaultRating, goodTeammate: defaultIsGood };
      const response = await axios.post(apiUrl, {player: player});
      setGameId("");
      setName("");
      onSubmit(gameId, name);
    } catch (error) {
      // Request was not successful
      console.error('An error occurred:', error);
    }
  }

  return (
    <div className="screen1">
      <h1>Player</h1>
      <div className="input-row">
        <label>Game ID: </label>
        <input
          type="text"
          value={gameId}
          onChange={(e) => setGameId(e.target.value)}
        />
      </div>
      <div className="input-row">
        <label>Name: </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <button onClick={e => handleSubmit(e)}>Submit</button>
    </div>
  );
}


// Screen 2 component
function Screen2({ onAddPlayer }) {
  const ratingUrl = "/api/rate/id";
  const apiUrl = "/api"

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
        const data = res.data;
        setPlayers(data);
        console.log(`component mounted`);
      });
    }catch(error) {
      console.log(error);
    }
  }, []);

  return (
    <div className="screen2">
      <h1>Lobby</h1>
      <table className="lobby-table">
        <thead>
          <tr>
            <th>Game ID</th>
            <th>Name</th>
            <th>Friendliness</th>
            <th>Good teammate?</th>
          </tr>
        </thead>
        <tbody>
          {
            players.map((player) => (
              <tr key={player._id}>
                <td>{player.gameId}</td>
                <td>{player.name}</td>
                <td>{player.friendliness}</td>
                <td>
                  <button className="thumbs-up-button" onClick={() => increaseRating(player)}>
                    {"👍"}
                  </button>
                  <button className="thumbs-down-button" onClick={() => decreaseRating(player)}>
                    {"👎"}
                  </button>
                </td>
              </tr>
            ))
          }
        </tbody>
      </table>
      <button onClick={handleAddPlayer}>Add Player</button>
    </div>
  );
}

function App() {
  // State for managing the current screen
  const [currentScreen, setCurrentScreen] = useState("screen2");

  // Handle screen change from Screen 1 to Screen 2
  function handleScreenChange(gameId, name) {
    // wait for server response
    // Set the current screen to Screen 2
    setCurrentScreen("screen2");
  }

  // Handle screen change from Screen 2 to Screen 1
  function handleAddPlayer() {
    // Set the current screen to Screen 1
    setCurrentScreen("screen1");
  }

  return (
    <div className="app">
      {/* Render Screen 1 if the current screen is Screen 1 */}
      {currentScreen === "screen1" && <Screen1 onSubmit={handleScreenChange} />}

      {/* Render Screen 2 if the current screen is Screen 2 */}
      {currentScreen === "screen2" && <Screen2 onAddPlayer={handleAddPlayer} />}
    </div>
  );
}

export default App;
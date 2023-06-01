import React, { useState } from "react";
import "./App.css";

// Screen 1 component
function Screen1({ onSubmit }) {
  // State for Game ID and Name inputs
  const [gameId, setGameId] = useState("");
  const [name, setName] = useState("");

  // Handle form submission
  function handleSubmit() {
    // Call the onSubmit callback with the entered values
    onSubmit(gameId, name);
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
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
}


// Screen 2 component
function Screen2({ onAddPlayer }) {
  // Sample player data
  const players = [
    { gameId: "123", name: "Tom", friendliness: 5, goodTeammate: true },
    // Add more players here
  ];

  // Handle add player button click
  function handleAddPlayer() {
    // Call the onAddPlayer callback
    onAddPlayer();
  }

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
          {players.map((player, index) => (
            <tr key={index}>
              <td>{player.gameId}</td>
              <td>{player.name}</td>
              <td>{player.friendliness}</td>
              <td>
                <button className="thumbs-up-button">
                  {player.goodTeammate ? "👍" : "👎"}
                </button>
                <button className="thumbs-down-button">
                    {player.goodTeammate ? "👎" : "👍"}
                </button>
              </td>
            </tr>
          ))}
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
    // Perform any necessary validation or data processing here

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
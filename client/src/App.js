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
      const info = { gameId: gameId, name: name };
      await axios.post(apiUrl, {loginInfo: info});
      setGameId("");
      setName("");
      onSubmit(name);
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
function Lobby({ onSearch, onAddPlayer, nameVal }) {
  const ratingUrl = "/api/rate/id";
  const apiUrl = "/api/queue/" + nameVal;
  const lobbyUrl = "/api/lobby/search/" + nameVal;

  const [players, setPlayers] = useState([]);

  async function increaseRating(player) {
    // try {
    //   const response = await axios.put(ratingUrl, {player: player, increase: true});
    //   const data = await response.data;
    //   console.log("inc resp " + data);
    //   setPlayers(data);
    // } catch (error) {
    //   // Request was not successful
    //   console.error('An error occurred:', error);
    // }
  }

  async function decreaseRating(player) {
    // try {
    //   const response = await axios.put(ratingUrl, {player: player, increase: false});
    //   const data = await response.data;
    //   console.log("dec resp " + data);
    //   setPlayers(data);
    // } catch (error) {
    //   // Request was not successful
    //   console.error('An error occurred:', error);
    // }
  }

   // Handle add player button click
  function handleAddPlayer() {
    onAddPlayer();
  }

  async function handleSearch() {
    onSearch();
    console.log(players);
    try {
      const response = await axios.post(lobbyUrl, {players: players});
      const newPlayers = response.data;
      setPlayers(newPlayers);
    } catch (error) {
      // Request was not successful
      console.error('An error occurred:', error);
    } 
  }

  useEffect(() => {
    try {
      axios.get(apiUrl)
      .then(res => {
        const players = res.data;
        setPlayers(players);
        console.log(players);
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
          </tr>
        </thead>
        <tbody>
          {
            players.map((player) => (
              <tr key={player._id}>
                <td>{player.name}</td>
                <td>{player.gameId}</td>
                <td>{player.friendliness}</td>
              </tr>
            ))
          }
        </tbody>
      </table>
      <button onClick={handleSearchPlayer}>Search</button>
      <button onClick={handleAddPlayer}>Back</button>
    </div>
  );
}

function App() {
  // State for managing the current screen
  const [currentScreen, setCurrentScreen] = useState("LogIn");
  const [userName, setUserName] = useState("");
  const [userGameID, setUserGameID] = useState("");
  const [showButton, setShowButton] = useState(true);

  // Handle screen change from LogIn to Lobby
  function handleScreenChange(name, gameId) {
    // wait for server response
    // Set the current screen to Lobby
    setCurrentScreen("Lobby");
    setUserName(name);
    setUserGameID(gameId);
  }

  // Handle screen change from Lobby to LogIn
  function handleAddPlayer() {
    // Set the current screen to LogIn
    setCurrentScreen("LogIn");
  }

  function handleSearch() {
    setShowButton(!showButton);
  }

  return (
    <div className="app">
      {/* Render LogIn if the current screen is LogIn */}
      {currentScreen === "LogIn" && <LogIn onSubmit={handleScreenChange} nameVal={userName} savedGameID={userGameID}/>}

      {/* Render Lobby if the current screen is Lobby */}
      {currentScreen === "Lobby" && <Lobby onSearch={handleSearch} onAddPlayer={handleAddPlayer} nameVal={userName}/>}
    </div>
  );
}

export default App;
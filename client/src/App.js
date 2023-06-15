import React, { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";
import ProfileDrawer from "./ProfileDawer";
import RatingDrawer from "./RatingDrawer";

// Player Login screen
function LogIn({ onSubmit, nameVal, savedGameID }) {
  // State for Game ID and Name inputs
  const [gameId, setGameId] = useState(savedGameID);
  const [name, setName] = useState(nameVal);
  const loginUrl = "/api/login"

  // Handle form submission
  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const info = { gameId: gameId, name: name };
      await axios.post(loginUrl, {loginInfo: info});
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

// Lobby screen component
function Lobby({ onAddPlayer, nameVal }) {
  const queueUrl = "/api/lobby/queue/" + nameVal;
  const lobbyUrl = "/api/lobby/search";

  const [players, setPlayers] = useState([]);
  //info of the logged in user
  const [profile, setProfile] = useState({});
  const [showSearch, setShowSearch] = useState(true);

   // Handle add player button click
  function handleAddPlayer() {
    onAddPlayer();
  }

  async function handleSearch() {
    setShowSearch(false);
    try {
      const response = await axios.post(lobbyUrl, {players: players});
      setShowSearch(true);
      const newPlayers = response.data;
      setPlayers(newPlayers);
    } catch (error) {
      // Request was not successful
      console.error('An error occurred:', error);
    } 
  }

  useEffect(() => {
    try {
      axios.get(queueUrl)
      .then(res => {
        const players = res.data;
        setPlayers(players);
        console.log("players > " + players);
        setProfile(players.at(0));
        console.log(`component mounted`);
      });
    }catch(error) {
      console.log(error);
    }
  }, []);

  return (
    <div className="lobby-page">
      <ProfileDrawer player={profile}/>
      <div className="Lobby">
        <h1>Lobby</h1>
        <table className="lobby-table">
          <thead>
            <tr>
              <th>Username</th>
              <th>Game ID</th>
              <th>Friendliness</th>
              <th>Rating
                {/* info bx */}
              </th>
            </tr>
          </thead>
          <tbody>
            {
              players.map((player) => (
                <tr key={player._id}>
                  <td>{player.name}</td>
                  <td>{player.gameId}</td>
                  <td>{player.friendliness}</td>
                  <td>
                  { player.name !== nameVal ? (<RatingDrawer ratedPlayer={player}/>) : '' }
                  </td>
                </tr>
              ))
            }
          </tbody>
        </table>
        {showSearch ? (<button onClick={handleSearch}>Search</button>) : <p className="searching__text">Searching ...</p>}
        <button onClick={handleAddPlayer}>Back</button>
      </div>
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
    setUserGameID(gameId);
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
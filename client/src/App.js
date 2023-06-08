import React, { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";

// Player screen
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

// Rating dropdown and confirm button
const Rating = (selectedUser) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState('Rate');
  const [showRating, setShowRating] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    setIsOpen(false);
    setShowConfirm(true);
  };

  const handleButtonClick = () => {
    setIsOpen(!isOpen);
  };

  const handleConfirmClick = () => {
    setShowRating(true);
    // Send the selectedOption value to the backend
    // Here, you can use an API call or any other method to send the data to your backend server
    console.log("Selected user:", selectedUser.name);
    console.log("Selected option:", selectedOption);
  };

  return (
    <div className={`dropdown ${isOpen ? 'open' : ''}`}>
      {showRating ? (
        <p className="rating__text">{selectedOption}</p>
      ) : (
      <>
        <button className="dropdown__button" onClick={handleButtonClick}>{selectedOption}</button>
        <ul className="dropdown__list">
          <li onClick={() => handleOptionClick(1)}>1 - discriminatory</li>
          <li onClick={() => handleOptionClick(2)}>2 - rude and unkind</li>
          <li onClick={() => handleOptionClick(3)}>3 - normal interactions</li>
          <li onClick={() => handleOptionClick(4)}>4 - kind and fun</li>
          <li onClick={() => handleOptionClick(5)}>5 - positive environment</li>
        </ul>
        {showConfirm ? (//!showRating && (
          <button className="confirm__button" onClick={handleConfirmClick}>Confirm</button>
        ) : <div className="no_confirm"></div>}
      </>
      )}
      </div>
  );
};

// Screen 2 component
function Lobby({ onAddPlayer, nameVal }) {
  const ratingUrl = "/api/rate";
  const apiUrl = "/api/queue/" + nameVal;
  const lobbyUrl = "/api/lobby/search/" + nameVal;

  const [players, setPlayers] = useState([]);
  const [showSearch, setShowSearch] = useState(true);

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
    setShowSearch(false);
    console.log(players);
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
            <th>Rating</th>
          </tr>
        </thead>
        <tbody>
          {
            players.map((player) => (
              <tr key={player._id}>
                <td>{player.name}</td>
                <td>{player.gameId}</td>
                <td>
                { player.name != nameVal ? (<Rating selectedUser={nameVal}/>) : '' }
                </td>
              </tr>
            ))
          }
        </tbody>
      </table>
      {showSearch ? (<button onClick={handleSearch}>Search</button>) : <p className="searching__text">Searching ...</p>}
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
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

// Rating button
const DropdownMenu = (selectedUser) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState('Rate');

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    setIsOpen(false);
  };

  const handleButtonClick = () => {
    setIsOpen(!isOpen);
  };

  const handleConfirmClick = () => {
    // Send the selectedOption value to the backend
    // Here, you can use an API call or any other method to send the data to your backend server
    console.log("Selected user:", selectedUser.name);
    console.log("Selected option:", selectedOption);
  };

  return (
    <div className={`dropdown ${isOpen ? 'open' : ''}`}>
      <button className="dropdown__button" onClick={handleButtonClick}>{selectedOption}</button>
      <ul className="dropdown__list">
        <li onClick={() => handleOptionClick('1 - discriminatory')}>1 - discriminatory</li>
        <li onClick={() => handleOptionClick('2 - rude and unkind')}>2 - rude and unkind</li>
        <li onClick={() => handleOptionClick('3 - normal interactions')}>3 - normal interactions</li>
        <li onClick={() => handleOptionClick('4 - kind and fun')}>4 - kind and fun</li>
        <li onClick={() => handleOptionClick('5 - positive environment')}>5 - positive environment</li>
      </ul>
      <button className="confirm__button" onClick={handleConfirmClick}>Confirm</button>
    </div>
  );
};

// Screen 2 component
function Lobby({ onSearch, onAddPlayer, nameVal }) {
  const ratingUrl = "/api/rate/id";
  const apiUrl = "/api/" + nameVal;

  console.log(nameVal);

  const [players, setPlayers] = useState([]);

  function handleSearch() {
      onSearch();
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
                  <DropdownMenu selectedUser={player}/>
                </td>
              </tr>
            ))
          }
        </tbody>
      </table>
      <button onSearch={handleSearch}>Search</button> <button onClick={handleAddPlayer}>Back</button>
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
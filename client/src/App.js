import React, { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';


// Player Login screen
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
const Rating = (ratedPlayer, currentUser) => {
  const ratingUrl = "/api/rate";
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRating, setSelectedRating] = useState('Rate');
  const [showRating, setShowRating] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleOptionClick = (option) => {
    setSelectedRating(option);
    setIsOpen(false);
    setShowConfirm(true);
  };

  const handleButtonClick = () => {
    setIsOpen(!isOpen);
  };

   const handleConfirmClick = async () => {
    setShowRating(true);
    await axios.put(ratingUrl, {player: ratedPlayer, rating: selectedRating})
  };

  return (
    <div className={`dropdown ${isOpen ? 'open' : ''}`}>
      {showRating ? (
        <p className="rating__text">{selectedRating}</p>
      ) : (
      <>
        <button className="dropdown__button" onClick={handleButtonClick}>{selectedRating}</button>
        <ul className="dropdown__list">
          <li onClick={() => handleOptionClick("1 - discriminatory")}>1 - discriminatory</li>
          <li onClick={() => handleOptionClick("2 - rude and unkind")}>2 - rude and unkind</li>
          <li onClick={() => handleOptionClick("3 - normal interactions")}>3 - normal interactions</li>
          <li onClick={() => handleOptionClick("4 - kind and fun")}>4 - kind and fun</li>
          <li onClick={() => handleOptionClick("5 - positive environment")}>5 - positive environment</li>
        </ul>
        {showConfirm ? (
          <button className="confirm__button" onClick={handleConfirmClick}>Confirm</button>
        ) : <div className="no_confirm"></div>}
      </>
      )}
      </div>
  );
};

function RatingExplained({ onBack }) {

  const [answersVisible, setAnswersVisible] = useState([]);

  const toggleAnswerVisibility = (index) => {
    setAnswersVisible((prevVisible) => {
      const newVisible = [...prevVisible];
      newVisible[index] = !newVisible[index];
      return newVisible;
    });
  };
  
  async function handleBack() {
    onBack();
  }

  return (
    <div>
      <h1>What is Rating?</h1>
      <div className="qa-container">
        <div className="qa-item">
          <button
            className="qa-question"
            onClick={() => toggleAnswerVisibility(0)}
          >
            Question 1 {answersVisible[0] ? <IoIosArrowUp /> : <IoIosArrowDown />}
          </button>
          {answersVisible[0] && <div className="qa-answer">Answer 1</div>}
        </div>
        <div className="qa-item">
          <button
            className="qa-question"
            onClick={() => toggleAnswerVisibility(1)}
          >
            Question 2 {answersVisible[1] ? <IoIosArrowUp /> : <IoIosArrowDown />}
          </button>
          {answersVisible[1] && <div className="qa-answer">Answer 2</div>}
        </div>
        {/* Add more QA items as needed */}
      </div>
      <button onClick={handleBack}>Back</button>
    </div>
  );
}

// Lobby screen component
function Lobby({ onAddPlayer, nameVal, onRatingExplained }) {
  const apiUrl = "/api/queue/" + nameVal;
  const lobbyUrl = "/api/lobby/search/" + nameVal;

  const [players, setPlayers] = useState([]);
  const [showSearch, setShowSearch] = useState(true);

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
            <th>Friendliness</th>
            <th>Rating {
              <div className="question__container">
              <button className="question__button" onClick={onRatingExplained}>?</button>
              </div> }
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
                { player.name != nameVal ? (<Rating ratedPlayer = {player} currentUser = {nameVal}/>) : '' }
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

  function handleBack() {
    setCurrentScreen("Lobby");
  }

  function handleRatingExplained() {
    setCurrentScreen("RatingExplained");
  }

  return (
    <div className="app">
      {/* Render LogIn if the current screen is LogIn */}
      {currentScreen === "LogIn" && <LogIn onSubmit={handleScreenChange} nameVal={userName} savedGameID={userGameID}/>}

      {/* Render Lobby if the current screen is Lobby */}
      {currentScreen === "Lobby" && <Lobby onAddPlayer={handleAddPlayer} nameVal={userName} onRatingExplained={handleRatingExplained}/>}

      {/* Render RatingExplained if the current screen is RatingExplained */}
      {currentScreen === "RatingExplained" && <RatingExplained onBack={handleBack}/>}
    </div>
  );
}

export default App;
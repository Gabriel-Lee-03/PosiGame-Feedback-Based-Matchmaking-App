import React, { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";
import RatingDrawer from "./RatingDrawer";
import ProfileAppBar from "./ProfileAppBar";
import SearchFailSnackBar from "./SearchFailSnackBar";
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';

// Player Login screen
function LogIn({ onSubmit, nameVal}) {
  // State for Game ID and Name inputs
  const [gameId, setGameId] = useState("");
  const [name, setName] = useState(nameVal);
  const [errorMessage, setMessage] = useState("");
  const loginUrl = "/api/login"

  // Handle form submission
  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const info = { gameId: gameId, name: name };
      var res = await axios.post(loginUrl, {loginInfo: info});
      if (res.data.isFound) {
        setGameId("");
        setName("");
        onSubmit(name);
      } else {
        setMessage("Not registered user");
      }
    } catch (error) {
      // Request was not successful
      console.error('An error occurred:', error);
    }
  }

  return (
    <div className="Player">
      <h1>Player Login</h1>
      <p>{errorMessage}</p>
      <div className="input-row">
        <label>Username: </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <p>If you are a new user, please enter your Game ID (in-game name)</p>
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
      <h1 className="title">What is Rating?</h1>
      <div className="qa-container">
        <div className="qa-item">
          <button className="qa-question" onClick={() => toggleAnswerVisibility(0)}>
            What should I rate? {answersVisible[0] ? <IoIosArrowUp /> : <IoIosArrowDown />}
          </button>
          {answersVisible[0] && (
            <div className="qa-answer">
              After playing a game with your team, you may rate your teammates from various categories that best describe your experience during the game.
            </div>
          )}
        </div>
        <div className="qa-item">
          <button className="qa-question" onClick={() => toggleAnswerVisibility(1)}>
            How does teammate matching work? {answersVisible[1] ? <IoIosArrowUp /> : <IoIosArrowDown />}
          </button>
          {answersVisible[1] && (
            <div className="qa-answer">
              You will be matched with players who share a similar friendliness to those already in your lobby.
            </div>
          )}
        </div>
        <div className="qa-item">
          <button className="qa-question" onClick={() => toggleAnswerVisibility(2)}>
            How is friendliness determined? {answersVisible[2] ? <IoIosArrowUp /> : <IoIosArrowDown />}
          </button>
          {answersVisible[2] && (
            <div className="qa-answer">
              Friendliness is calculated by averaging the rating scores given by your teammates over the past 30 days.
            </div>
          )}
        </div>
        <div className="qa-item">
          <button className="qa-question" onClick={() => toggleAnswerVisibility(3)}>
            How can I increase my friendliness? {answersVisible[3] ? <IoIosArrowUp /> : <IoIosArrowDown />}
          </button>
          {answersVisible[3] && (
            <div className="qa-answer">
              Be nice and kind to your teammates! Communicate well, and try your best to provide help and support. When things don’t go well, be encouraging and motivate each other. You will be more likely to receive higher ratings and be matched with friendlier players.
            </div>
          )}
        </div>
        <div className="qa-item">
          <button className="qa-question" onClick={() => toggleAnswerVisibility(4)}>
            What happens if I am rated poorly? {answersVisible[4] ? <IoIosArrowUp /> : <IoIosArrowDown />}
          </button>
          {answersVisible[4] && (
            <div className="qa-answer">
              It’s likely that your teammates feel that you could do better. Avoid negativity, rudeness, or discriminatory behavior, as they harm the gaming environment and your teammates' experience. Until you improve your behavior, you will be matched with similar players.
            </div>
          )}
        </div>
        <div className="qa-item">
          <button className="qa-question" onClick={() => toggleAnswerVisibility(5)}>
            How should I improve? {answersVisible[5] ? <IoIosArrowUp /> : <IoIosArrowDown />}
          </button>
          {answersVisible[5] && (
            <div className="qa-answer">
              Click on your user icon to view the feedback and reasons behind the ratings you received. Try to improve the behavior that your teammates don’t like!
            </div>
          )}
        </div>
      </div>
      <button className="back_button" onClick={handleBack}>Back</button>
    </div>
  );
}

// Lobby screen component
function Lobby({ onAddPlayer, nameVal, onRatingExplained }) {
  const queueUrl = "/api/lobby/queue/" + nameVal;	
  const lobbyUrl = "/api/lobby/search";

  // snackbar state for when search for player fails
  const [openSnackBar, toggleSnackBar] = useState(false);
  const [players, setPlayers] = useState([]);
  //info of the logged in user
  const [profile, setProfile] = useState({});
  const [showSearch, setShowSearch] = useState(true);

   // Handle add player button click
  function handleAddPlayer() {
    onAddPlayer();
  }

  // open snackbar when search for player fails
  function handleClose () {
    toggleSnackBar(false);
  }

  async function handleSearch() {
    setShowSearch(false);
    try {
      const response = await axios.post(lobbyUrl, {players: players});
      setShowSearch(true);
      const status = response.data;
      if (status.success) {
        setPlayers(status.players);
      } else {
        toggleSnackBar(true);
      }
      
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
      <SearchFailSnackBar open={openSnackBar} handleClose={handleClose}/>
      <ProfileAppBar player={profile}/>
      <div className="Lobby">
        <h1>Lobby</h1>
        <table className="lobby-table">
          <thead>
            <tr>
              <th>Username</th>
              <th>Game ID</th>
              <th>Friendliness Rating</th>
              <th>Rate Your Teammates {
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
                  <td>{player.friendliness.toFixed(2)}</td>
                  <td>
                  { player.name !== nameVal ? (<RatingDrawer ratedPlayer={player}/>) : '' }
                  </td>
                </tr>
              ))
            }
          </tbody>
        </table>
        {showSearch ? (<button onClick={handleSearch}>Search for Teammates</button>) : <p className="searching__text">Searching ...</p>}
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
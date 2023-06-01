import React from "react";
import logo from "./logo.svg";
import "./App.css";
import axios from "axios";

const apiUrl = "/api";

function componentDidMount(setState) {
  try {
    axios.get(apiUrl)
    .then(res => {
      const data = res.data;
      setState(data);
    });
  }catch(error) {
    console.log(error);
  }
}

async function handleSubmit(e, setText, setData) {
  console.log(`ok`);
  e.preventDefault();
  try {
    console.log("value to post: " + e.target.name.value);
    const response = await axios.post(apiUrl, e.target.name.value);
    setText('');
    //setData(response);
  } catch (error) {
    // Request was not successful
    console.error('An error occurred:', error);
  }
}

function App() {
  const defaultNames = [{name: `Ann Frank`, id: 0}, {name: `Frank Sinatra`, id: 1}];
  const [data, setData] = React.useState(defaultNames);
  const [input, setCurrentName] = React.useState(``);

  componentDidMount(setData);

  return (
    <div className="App">
      <img src={logo} className="App-logo" alt="logo" />
      <p>{!data ? `Loading...` : `data loaded`}</p>
      <form onSubmit={(e) => {handleSubmit(e, setCurrentName, setData)}}>
        <label for="name">First name: </label>
        <input 
          onChange={(e) => setCurrentName(e.target.value)}
          type="text" id="name" name="name" value={input}>
        </input><br></br>
        <button type="submit">Submit</button>
      </form>
      <div>
        <p>Users of our website include:</p>
        {
          data.map((name) =>
            {return(<p key={name.id}>{name.name}</p>)})
        }
      </div>
    </div>
  );
}

export default App;
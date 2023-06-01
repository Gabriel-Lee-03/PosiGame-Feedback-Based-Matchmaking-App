import React from "react";
import logo from "./logo.svg";
import "./App.css";
import axios from "axios";

const apiUrl = "/api";

function componentDidMount(setState) {
  axios.get(apiUrl)
  .then(res => {
    const data = res.data;
    setState(data);
  });
}

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      return axios.post(apiUrl, e.target.name.value);
      //console.log(e.target.name.value)
    }catch (error) {
      console.log(error);
    }
  }

function App() {
  const [data, setData] = React.useState(null);
  const [input, setCurrentName] = React.useState(``);

  componentDidMount(setData);

  let defaultNames = [{name: `Ann Frank`, id: 0}, {name: `Frank Sinatra`, id: 1}];

  const names = data? data : defaultNames;

  return (
    <div className="App">
      <img src={logo} className="App-logo" alt="logo" />
      <p>{!data ? "Loading..." : `data loaded`}</p>
      <form onSubmit={handleSubmit}>
        <label for="name">First name: </label>
        <input 
          onChange={(e) => setCurrentName(e.target.value)}
          type="text" id="name" name="name" value={input}>
        </input><br></br>
        <input type="submit" value="Submit"></input>
      </form>
      <div>
        <p>Users of our website include:</p>
        {
          names.map((name) =>
            {return(<p key={name.id}>{name.name}</p>)})
        }
      </div>
    </div>
  );
}

export default App;
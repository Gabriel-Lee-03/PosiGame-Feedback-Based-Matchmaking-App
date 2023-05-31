import React from "react";
import logo from "./logo.svg";
import "./App.css";

function App() {
  const [data, setData] = React.useState(null);

  React.useEffect(() => {
    fetch("/api")
      .then((res) => res.json())
      .then((data) => setData(data.message));
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>{!data ? "Loading..." : data}</p>
        <form>
          <label for="fname">First name:</label><br></br>
          <input type="text" id="fname" name="fname" value="John"></input>
          <label for="lname">Last name:</label>
          <input type="text" id="lname" name="lname" value="Doe"></input>
          <input type="submit" value="Submit"></input>
        </form> 
      </header>
    </div>
  );
}

export default App;
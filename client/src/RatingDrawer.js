import React, { useState } from "react";
import { Button, ToggleButtonGroup, ToggleButton, Drawer, Box, Typography } from "@mui/material";
import axios from "axios";
import "./App.css";

export default function RatingDrawer({ratedPlayer}) {
  const ratingUrl = "/api/lobby/rate";
  
  // only a single response is recorded
  const [resp, setResp] = useState({});
  const [selected, setSelected] =useState([]);
  const [isDrawerOpen, toggleDrawer] = useState(false);
  const [allowRating, toggleRatePermission] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleOptionClick = (e, updatedValue, score) => {
    setSelected(updatedValue);
    const newResp = {act: updatedValue, score: score};
    setResp(newResp);
    console.log("resp: " + resp);
    setShowConfirm(true);
    console.log("act: " + updatedValue);
    console.log("score: " + score);
  };

  const handleConfirmClick = async () => {
    const ratingInfo = {player: ratedPlayer, rating: resp.score};
    console.log("CONFIRM CLICK: rating info: <name> " + 
                  ratingInfo.player.name + " : <score> " +
                  ratingInfo.rating);
    await axios.put(ratingUrl,ratingInfo);
    setShowConfirm(false);
    toggleRatePermission(false);
    toggleDrawer(false);
  };

  return(
    <div className="profile-drawer">
      <React.Fragment>
      {/* disabled if option is submitted */}
      <Button disabled={!allowRating} onClick={()=>toggleDrawer(true)} size='large'>
        Rate
      </Button>
      <Drawer
        anchor={'right'}
        open={isDrawerOpen}
        onClose={()=>toggleDrawer(false)}
      >
        <Typography variant="h6" align="left">
          <p className="username">username: {ratedPlayer.name}</p>
          <p>game ID: {ratedPlayer.gameId}</p>

          <div>
              <Box className="drawer-content" width="35em" p={2} textAlign={"center"} role="presentation">

              <p> Score 1</p>              
              <ToggleButtonGroup
                value={selected}
                exclusive={true}
                onChange={(e, newVal) => handleOptionClick(e, newVal, 1)}
              >
              {/* {act: "Threats", score: 1} */}
                <ToggleButton value="Threats">
                  Threats
                </ToggleButton>

                <ToggleButton value="Sexist">
                  Sexist
                </ToggleButton>

                <ToggleButton value="Racist">
                  Racist
                </ToggleButton>

                <ToggleButton value="Other discriminatory comments">
                  Other discriminatory comments
                </ToggleButton>
              </ToggleButtonGroup>

              <br className="rating-break"></br>
              <p> Score 2</p>

              <ToggleButtonGroup
                value={selected}
                exclusive={true}
                onChange={(e, newVal) => handleOptionClick(e, newVal, 2)}
              >
                <ToggleButton value="Leaving the game">
                  Leaving the game 
                </ToggleButton>
                <ToggleButton value="Intentionally losing">
                  Intentionally losing
                </ToggleButton>
                <ToggleButton value="Rude">
                  Rude
                </ToggleButton>
                <ToggleButton value="Inappropriate comments">
                  Inappropriate comments
                </ToggleButton>
              </ToggleButtonGroup>

              <br className="rating-break"></br>
              <p> Score 3</p>

              <ToggleButtonGroup
                value={selected}
                exclusive={true}
                onChange={(e, newVal) => handleOptionClick(e, newVal, 3)}
              >
                <ToggleButton value="Average communication">
                  Average communication 
                </ToggleButton>
                <ToggleButton value="No communication">
                  No communication
                </ToggleButton>
              </ToggleButtonGroup>

              <br className="rating-break"></br>
              <p> Score 4</p>

              <ToggleButtonGroup
                value={selected}
                exclusive={true}
                onChange={(e, newVal) => handleOptionClick(e, newVal, 4)}
              >
                <ToggleButton value="Friendly communication">
                  Friendly communication 
                </ToggleButton>
                <ToggleButton value="Fun and lighthearted">
                  Fun and lighthearted
                </ToggleButton>
              </ToggleButtonGroup>

              <br className="rating-break"></br>
              <p>.</p>

                {/* disabled if no option is selected */}
              <Button 
                variant="outlined"
                disabled={!showConfirm}
                onClick={handleConfirmClick}>Confirm</Button>   
              </Box>  
          </div>
        </Typography>
      </Drawer>
      </React.Fragment>
    </div>
  );
}
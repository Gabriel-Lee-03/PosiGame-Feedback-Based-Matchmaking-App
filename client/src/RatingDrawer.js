import React, { useState } from "react";
import { Button, ToggleButtonGroup, IconButton, ToggleButton, Drawer, Box, Typography, Tooltip } from "@mui/material";
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import {  SCORE_1_BEHAVIORS, SCORE_2_BEHAVIORS, SCORE_3_BEHAVIORS,
          SCORE_4_BEHAVIORS, SCORE_5_BEHAVIORS, getScores, getFeedbacks} from "./RatingTiers";
import axios from "axios";
import "./App.css";

export default function RatingDrawer({ratedPlayer}) {
  const ratingUrl = "/api/lobby/rate";
  
  // only a single response is recorded
  const [selected, setSelected] = useState([]);
  const [isDrawerOpen, toggleDrawer] = useState(false);
  const [allowRating, toggleRatePermission] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleOptionClick = (e, updatedValue, score) => {
    console.log("selected: " + updatedValue);
    setSelected(updatedValue);
    const newResp = {act: updatedValue, score: score};
    setShowConfirm(true);
  };

  const handleConfirmClick = async () => {
    const scores = getScores(selected);
    const feedbacks = getFeedbacks(selected);
    console.log("confirm scores: " + scores);
    console.log("confirm feedbacks: " + feedbacks);
    const ratingInfo = {player: ratedPlayer, rating: scores, feedback: feedbacks, date: new Date().toUTCString()};
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
        <div className="rating-div">
          <div className="rating-info">
            <Tooltip title="Final score will be weighted" placement="left-start">
              <IconButton>
                <InfoOutlinedIcon/>
              </IconButton>
            </Tooltip>
          </div>
          <p className="username"> How did {ratedPlayer.gameId} do? </p>
        </div>

          <div>
              <Box className="drawer-content" width="35em" p={2} textAlign={"center"} role="presentation">

              <p>Score 1:</p>              
              <ToggleButtonGroup
                className="button-group"
                value={selected}
                // exclusive={true}
                onChange={(e, newVal) => handleOptionClick(e, newVal, 1)}
              >
                {
                  SCORE_1_BEHAVIORS.map(b => (
                    <ToggleButton value={b}>
                      {b}
                    </ToggleButton>
                  ))
                }
              </ToggleButtonGroup>

              <br className="rating-break"></br>
              <p>Score 2:</p>

              <ToggleButtonGroup
                className="button-group"
                value={selected}
                // exclusive={true}
                onChange={(e, newVal) => handleOptionClick(e, newVal, 2)}
              >
                {
                  SCORE_2_BEHAVIORS.map(b => (
                    <ToggleButton value={b}>
                      {b}
                    </ToggleButton>
                  ))
                }
              </ToggleButtonGroup>

              <br className="rating-break"></br>
              <p> Score 3:</p>

              <ToggleButtonGroup
                className="button-group"
                value={selected}
                // exclusive={true}
                onChange={(e, newVal) => handleOptionClick(e, newVal, 3)}
              >
                {
                  SCORE_3_BEHAVIORS.map(b => (
                    <ToggleButton value={b}>
                      {b}
                    </ToggleButton>
                  ))
                }
              </ToggleButtonGroup>

              <br className="rating-break"></br>
              <p> Score 4:</p>

              <ToggleButtonGroup
                className="button-group"
                value={selected}
                // exclusive={true}
                onChange={(e, newVal) => handleOptionClick(e, newVal, 4)}
              >
                {
                  SCORE_4_BEHAVIORS.map(b => (
                    <ToggleButton value={b}>
                      {b}
                    </ToggleButton>
                  ))
                }
              </ToggleButtonGroup>

              <br className="rating-break"></br>
              <p> Score 5:</p>

              <ToggleButtonGroup
                className="button-group"
                value={selected}
                // exclusive={true}
                onChange={(e, newVal) => handleOptionClick(e, newVal, 5)}
              >
                {
                  SCORE_5_BEHAVIORS.map(b => (
                    <ToggleButton value={b}>
                      {b}
                    </ToggleButton>
                  ))
                }
              </ToggleButtonGroup>

              <br className="rating-break"></br>

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
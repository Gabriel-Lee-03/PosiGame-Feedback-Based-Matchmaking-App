import React, { useState } from "react";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { IconButton, Drawer, Box, Typography } from "@mui/material";
import FeedbackBox  from "./FeedbackBox";
import { commentBuilder } from "./commentBuilder";
import "./App.css";
import axios from "axios";

export default function ProfileDrawer({player}) {
  const [isDrawerOpen, toggleDrawer] = useState(false);
  const [feedbackLog, setFeedbackLog] = useState([]);

  async function getLogs() {
    const logUrl = "/api/lobby/feedback/" + player.name;
    const response = await axios.get(logUrl);
    const log = response.data.map((item, index) => ({...item, id: index + 1}));
    setFeedbackLog(log);
    toggleDrawer(true);
  }

  return(
    <div className="profile-drawer">
      <React.Fragment>
      <IconButton onClick={()=>getLogs()} size='large'>
        <AccountCircleIcon className="profile-icon"/>
      </IconButton>
      <Drawer
        anchor={'left'}
        open={isDrawerOpen}
        onClose={()=>toggleDrawer(false)}
      >
      <div className="logs">
          <Box className="drawer-content" width="40em" p={2} textAlign={"center"} role="presentation">
              <Typography variant="h6" align="left">
                <img className="icon" src="https://picsum.photos/200"></img>
                <div className="profile-div">
                  <p className="page-label">profile</p>
                  <p className="username">{player.name}</p>
                  <p className="gameId">game ID: {player.gameId}</p>
                </div>
                {
                  (feedbackLog.length === 0)? 
                    <FeedbackBox date="" feedback="play more games to see feedbacks from your fellow teammates!"></FeedbackBox> :
                    
                      feedbackLog.map((s) => (
                        <FeedbackBox key={s.id} date={s.date} feedback={commentBuilder(s.feedback)}></FeedbackBox>
                      ))
                }
              </Typography>
          </Box>
      </div>
      </Drawer>
      </React.Fragment>
    </div>
  );
}
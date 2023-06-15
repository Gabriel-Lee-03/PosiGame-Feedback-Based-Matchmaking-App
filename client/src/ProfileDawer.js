import React, { useState } from "react";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { IconButton, Drawer, Box, Typography } from "@mui/material";
import FeedbackBox  from "./FeedbackBox";
import "./App.css";

const dummyStrings = []

export default function ProfileDrawer({player}) {
  const [isDrawerOpen, toggleDrawer] = useState(false);
  return(
    <div className="profile-drawer">
      <React.Fragment>
      <IconButton onClick={()=>toggleDrawer(true)} size='large'>
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
                  dummyStrings.map((s) => (
                    <FeedbackBox key={s.id} date={s.date} feedback={s.feedback}></FeedbackBox>
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
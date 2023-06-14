import React, { useState } from "react";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { IconButton, Drawer, Box, Typography } from "@mui/material";
import FeedbackBox  from "./FeedbackBox";
import "./App.css";

const dummyStrings = [{id: 0, date:"23-6-2023", feedback:"1. to remove a local branch from your machine"},
                      {id: 1, date:"23-6-2023", feedback:"2. to remove a local branch from your machine"}, 
                      {id: 2, date:"23-6-2023", feedback:"3. to remove a local branch from your machine"}, 
                      {id: 3, date:"23-6-2023", feedback:"4. to remove a local branch from your machine"},
                      {id: 4, date:"23-6-2023", feedback:"1. to remove a local branch from your machine"},
                      {id: 5, date:"23-6-2023", feedback:"2. to remove a local branch from your machine"}, 
                      {id: 6, date:"23-6-2023", feedback:"3. to remove a local branch from your machine"}, 
                      {id: 7, date:"23-6-2023", feedback:"4. to remove a local branch from your machine"}];

export default function ProfileDrawer({player}) {
  const [isDrawerOpen, toggleDrawer] = useState(false);
  console.log(player);
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
                <p className="username">username: {player.name}</p>
                <p>game ID: {player.gameId}</p>
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
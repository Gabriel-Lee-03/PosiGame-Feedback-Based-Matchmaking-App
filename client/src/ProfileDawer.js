import React, { useState } from "react";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { IconButton, Drawer, Box, Typography } from "@mui/material";
import "./App.css";

export default function ProfileDrawer() {
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
          <Box width="40em" p={2} textAlign={"center"} role="presentation">
              Hello world!
          </Box>
      </div>
      </Drawer>
      </React.Fragment>
    </div>
  );
}
import {AppBar, Box, Toolbar, Typography} from '@mui/material';
import ProfileDrawer from "./ProfileDawer";
import "./App.css";

export default function ProfileAppBar({player}) {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <div className='title-div'>
            <ProfileDrawer className="profile-button" player={player}/>
            <h6 className="app-title">PosiGame</h6>
          </div>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
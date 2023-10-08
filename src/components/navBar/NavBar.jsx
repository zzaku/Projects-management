import React, { useState } from "react";
import { Box } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
//import PersonAdd from '@mui/icons-material/PersonAdd';
import Settings from '@mui/icons-material/Settings';
import Logout from '@mui/icons-material/Logout';
import { useFirebase } from "../context/firebaseContext";
import Button from '@mui/material/Button';
import { useNavigate } from "react-router-dom";
import "./NavBar.css"
import "../../Index.css"

export default function NavBar() {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const {setNeedToConnect, signout, currentUser, currentUserID} = useFirebase()
  const navigate = useNavigate();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const goToDashBoard = () => {
    navigate(`/DashBoard/${currentUser[0]?.id}`);
  }
  
  return (
    <div className="navbar-container d-flex content-end">
      <div className="navbar-wrapper d-flex content-end item-start">  
        <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
          {currentUserID && <Button variant="outained" onClick={goToDashBoard}><Typography style={{cursor: "pointer"}} sx={{ minWidth: 100 }}>DashBoard</Typography></Button>}
          <Typography style={{cursor: "pointer"}} sx={{ minWidth: 100 }}>Contact</Typography>
          <Typography style={{cursor: "pointer"}} sx={{ minWidth: 100 }}>Profile</Typography>
          {!currentUserID && <Typography style={{cursor: "pointer"}} onClick={() => setNeedToConnect(true)} sx={{ minWidth: 100 }}>Connexion</Typography>}
          {currentUserID && 
          <Tooltip title="compte">
            <IconButton
              onClick={handleClick}
              size="small"
              sx={{ ml: 2 }}
              aria-controls={open ? 'account-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
            >
              <Avatar sx={{ width: 32, height: 32 }}>M</Avatar>
            </IconButton>
          </Tooltip>}
        </Box>
        <Menu
          anchorEl={anchorEl}
          id="account-menu"
          open={open}
          onClose={handleClose}
          onClick={handleClose}
          PaperProps={{
            elevation: 0,
            sx: {
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
              mt: 1.5,
              '& .MuiAvatar-root': {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              '&:before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: 'background.paper',
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 0,
              },
            },
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <MenuItem onClick={handleClose}>
            <Avatar /> My account
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleClose}>
            
            Add another account
          </MenuItem>
          <MenuItem onClick={handleClose}>
            <ListItemIcon>
              <Settings fontSize="small" />
            </ListItemIcon>
            Settings
          </MenuItem>
          <MenuItem onClick={signout}>
            <ListItemIcon>
              <Logout fontSize="small" />
            </ListItemIcon>
            Logout
          </MenuItem>
        </Menu>
      </div>
    </div>
  );
}
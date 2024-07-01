// src/components/UserMenu.jsx
import React, { useState } from "react";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Tooltip from "@mui/material/Tooltip";
import { signOut } from "firebase/auth";
import { auth } from "../firebaseConfig";

const UserMenu = ({ user }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleOpenUserMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorEl(null);
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      handleCloseUserMenu();
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  return (
    <>
      {user && (
        <Tooltip title={user.email}>
          <Avatar
            src={user.photoURL}
            alt={user.displayName}
            onClick={handleOpenUserMenu}
            sx={{ cursor: "pointer" }}
          />
        </Tooltip>
      )}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseUserMenu}
      >
        <MenuItem onClick={handleSignOut}>Sign Out</MenuItem>
      </Menu>
    </>
  );
};

export default UserMenu;

// src/components/AppBar.jsx
import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import UserMenu from "./UserMenu";

const CustomAppBar = ({ user, onMenuOpen }) => {
  return (
    <AppBar position="static">
      <Toolbar>
        {user && (
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={onMenuOpen}
          >
            <MenuIcon />
          </IconButton>
        )}
        <Box sx={{ flexGrow: 1, display: "flex", justifyContent: "center" }}>
          <Typography variant="h6" component="div">
            Spent
          </Typography>
        </Box>
        <UserMenu user={user} />
      </Toolbar>
    </AppBar>
  );
};

export default CustomAppBar;

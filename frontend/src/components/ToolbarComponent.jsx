import "./ToolbarComponent.css";
import React from "react";
import { AppBar, Toolbar, Typography, Button, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useAuth } from "../context/AuthContext";

const ToolbarComponent = () => {
  const { user, login, logout } = useAuth();

  return (
    <AppBar position="static">
      <Toolbar className="toolbar">
        {user && (
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            className="menu-icon"
          >
            <MenuIcon />
          </IconButton>
        )}
        <Typography variant="h6" component="div" className="toolbar-title">
          Truffle Dog Digital CRM
        </Typography>
        {user ? (
          <Button color="inherit" onClick={logout}>
            Logout
          </Button>
        ) : (
          <Button color="inherit" onClick={login}>
            Login
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default ToolbarComponent;

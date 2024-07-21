import React from "react";
import { AppBar, Toolbar, Button, IconButton, Grid, Box } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useAuth } from "../context/AuthContext";
import { NavLink } from "react-router-dom";

const ToolbarComponent = () => {
  const { user, login, logout } = useAuth();

  return (
    <div style={{ position: "fixed", top: 0, width: "100%", zIndex: 1000 }}>
      <AppBar position="static">
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          {user ? (
            <Grid container alignItems="center">
              <Grid item xs={2}>
                <IconButton
                  edge="start"
                  color="inherit"
                  aria-label="menu"
                  sx={{ mr: 2 }}
                >
                  <MenuIcon />
                </IconButton>
              </Grid>
              <Grid item xs={8}>
                <Box display="flex" justifyContent="center">
                  <NavLink
                    to="/humans"
                    style={{
                      textDecoration: "none",
                      color: "inherit",
                      marginRight: "20px",
                    }}
                  >
                    <Button sx={{ color: "inherit" }}>Humans</Button>
                  </NavLink>
                  <NavLink
                    to="/backlog"
                    style={{
                      textDecoration: "none",
                      color: "inherit",
                      marginRight: "20px",
                    }}
                  >
                    <Button sx={{ color: "inherit" }}>Backlog</Button>
                  </NavLink>
                </Box>
              </Grid>
              <Grid item xs={2} container justifyContent="flex-end">
                <Button color="inherit" onClick={logout}>
                  Logout
                </Button>
              </Grid>
            </Grid>
          ) : (
            <Grid container justifyContent="flex-end">
              <Button color="inherit" onClick={login}>
                Login
              </Button>
            </Grid>
          )}
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default ToolbarComponent;

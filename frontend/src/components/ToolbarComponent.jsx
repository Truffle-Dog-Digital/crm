import React from "react";
import { AppBar, Toolbar, Button, IconButton, Grid, Box } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

const ToolbarComponent = () => {
  const { user, login, logout } = useAuth();

  return (
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
                <Button color="inherit" component={Link} to="/humans">
                  Humans
                </Button>
                <Button color="inherit" component={Link} to="/backlog">
                  Backlog
                </Button>
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
  );
};

export default ToolbarComponent;
